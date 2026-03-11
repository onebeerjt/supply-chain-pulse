import 'server-only';
import WebSocket from 'ws';
import { fallbackVessels } from '@/lib/data/vessel-fallback';
import { Vessel } from '@/lib/types/domain';

type FeedMode = 'live' | 'fallback' | 'unavailable';

interface FeedState {
  ws: WebSocket | null;
  started: boolean;
  vessels: Map<number, Vessel>;
  lastMessageAt: number | null;
  lastError: string | null;
  reconnectTimer: NodeJS.Timeout | null;
  burstPromise: Promise<Vessel[]> | null;
  lastBurstAt: number | null;
}

const TEN_MIN_MS = 10 * 60 * 1000;
const WS_URL = 'wss://stream.aisstream.io/v0/stream';
const AIS_BOUNDS: number[][][] = [
  [[32.2, -122.8], [35.4, -117.0]], // Los Angeles / Long Beach
  [[8.0, -80.8], [10.3, -78.8]], // Panama Canal
  [[50.7, 2.0], [53.0, 5.9]], // Rotterdam
  [[30.1, 120.0], [32.4, 122.8]], // Shanghai
  [[1.0, 103.2], [1.7, 104.2]], // Singapore
  [[28.4, 120.8], [30.3, 122.8]] // Ningbo extension
];

declare global {
  // eslint-disable-next-line no-var
  var __aisstreamState: FeedState | undefined;
}

function getState(): FeedState {
  if (!global.__aisstreamState) {
    global.__aisstreamState = {
      ws: null,
      started: false,
      vessels: new Map<number, Vessel>(),
      lastMessageAt: null,
      lastError: null,
      reconnectTimer: null,
      burstPromise: null,
      lastBurstAt: null
    };
  }
  return global.__aisstreamState;
}

function numberOrUndefined(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function normalizePayload(payload: unknown): Vessel | null {
  const root = typeof payload === 'object' && payload ? (payload as Record<string, unknown>) : null;
  if (!root) return null;

  const message = (root.Message as Record<string, unknown> | undefined) ?? root;
  const positionReport =
    (message.PositionReport as Record<string, unknown> | undefined) ??
    (message.PositionReportClassA as Record<string, unknown> | undefined) ??
    (message.PositionReportClassB as Record<string, unknown> | undefined);

  const meta = (root.MetaData as Record<string, unknown> | undefined) ?? {};
  const position = (positionReport?.Position as Record<string, unknown> | undefined) ?? {};

  const mmsi =
    numberOrUndefined(meta.MMSI) ??
    numberOrUndefined(positionReport?.UserID) ??
    numberOrUndefined(positionReport?.MMSI);

  const lat = numberOrUndefined(positionReport?.Latitude) ?? numberOrUndefined(position.Latitude);
  const lon = numberOrUndefined(positionReport?.Longitude) ?? numberOrUndefined(position.Longitude);

  if (!mmsi || lat === undefined || lon === undefined) return null;

  const speed =
    numberOrUndefined(positionReport?.Sog) ??
    numberOrUndefined(positionReport?.SpeedOverGround) ??
    numberOrUndefined(positionReport?.Speed);

  const course =
    numberOrUndefined(positionReport?.Cog) ??
    numberOrUndefined(positionReport?.CourseOverGround) ??
    numberOrUndefined(positionReport?.Course);

  const tsRaw = (meta.time_utc as string | undefined) ?? (meta.Timestamp as string | undefined);
  const updatedAt = tsRaw ? new Date(tsRaw).toISOString() : new Date().toISOString();

  return {
    id: `mmsi-${Math.trunc(mmsi)}`,
    mmsi: Math.trunc(mmsi),
    lat,
    lon,
    speed,
    course,
    updatedAt
  };
}

function cleanupStale(state: FeedState) {
  const cutoff = Date.now() - TEN_MIN_MS;
  for (const [mmsi, vessel] of state.vessels.entries()) {
    if (new Date(vessel.updatedAt).getTime() < cutoff) {
      state.vessels.delete(mmsi);
    }
  }
}

function scheduleReconnect(state: FeedState, apiKey: string) {
  if (state.reconnectTimer) return;
  state.reconnectTimer = setTimeout(() => {
    state.reconnectTimer = null;
    connect(state, apiKey);
  }, 5_000);
}

function connect(state: FeedState, apiKey: string) {
  if (state.ws && (state.ws.readyState === WebSocket.OPEN || state.ws.readyState === WebSocket.CONNECTING)) {
    return;
  }

  try {
    const ws = new WebSocket(WS_URL);
    state.ws = ws;

    ws.on('open', () => {
      ws.send(
        JSON.stringify({
          APIKey: apiKey,
          BoundingBoxes: AIS_BOUNDS
        })
      );
    });

    ws.on('message', (chunk) => {
      state.lastMessageAt = Date.now();
      const text = typeof chunk === 'string' ? chunk : chunk.toString('utf8');
      try {
        const parsed = JSON.parse(text);
        const vessel = normalizePayload(parsed);
        if (!vessel) return;
        state.vessels.set(vessel.mmsi, vessel);
        cleanupStale(state);
      } catch {
        // ignore malformed messages
      }
    });

    ws.on('error', (err) => {
      state.lastError = err.message;
    });

    ws.on('close', () => {
      state.ws = null;
      scheduleReconnect(state, apiKey);
    });
  } catch (error) {
    state.lastError = error instanceof Error ? error.message : 'AISStream connection failed';
    scheduleReconnect(state, apiKey);
  }
}

function ensureStarted() {
  const apiKey = process.env.AISSTREAM_API_KEY;
  if (!apiKey) return;
  const state = getState();
  if (state.started) return;
  state.started = true;
  connect(state, apiKey);
}

function collectBurst(apiKey: string, timeoutMs = 12000, maxMessages = 120): Promise<Vessel[]> {
  const state = getState();
  if (state.burstPromise) return state.burstPromise;

  const promise = new Promise<Vessel[]>((resolve) => {
    const local = new Map<number, Vessel>();
    let settled = false;
    let opened = false;
    let timedOut = false;

    const ws = new WebSocket(WS_URL);
    const finalize = () => {
      if (settled) return;
      settled = true;
      try {
        if (opened && ws.readyState === WebSocket.OPEN) {
          ws.close();
        } else if (ws.readyState === WebSocket.CONNECTING) {
          ws.terminate();
        }
      } catch {
        // ignore cleanup errors
      }
      const vessels = Array.from(local.values());
      for (const vessel of vessels) {
        state.vessels.set(vessel.mmsi, vessel);
      }
      cleanupStale(state);
      state.lastBurstAt = Date.now();
      state.burstPromise = null;
      resolve(vessels);
    };

    const timer = setTimeout(() => {
      timedOut = true;
      finalize();
    }, timeoutMs);

    ws.on('open', () => {
      opened = true;
      ws.send(
        JSON.stringify({
          APIKey: apiKey,
          BoundingBoxes: AIS_BOUNDS
        })
      );
    });

    ws.on('message', (chunk) => {
      const text = typeof chunk === 'string' ? chunk : chunk.toString('utf8');
      try {
        const parsed = JSON.parse(text);
        const vessel = normalizePayload(parsed);
        if (!vessel) return;
        local.set(vessel.mmsi, vessel);
        if (local.size >= maxMessages) {
          clearTimeout(timer);
          finalize();
        }
      } catch {
        // ignore malformed burst message
      }
    });

    ws.on('error', (err) => {
      const msg = err.message ?? 'unknown websocket error';
      if (!(timedOut && msg.includes('closed before the connection was established'))) {
        state.lastError = `Burst websocket error: ${msg}`;
      }
      clearTimeout(timer);
      finalize();
    });

    ws.on('close', (code, reasonBuffer) => {
      const reason = reasonBuffer.toString('utf8');
      if (!settled && !timedOut && code !== 1000 && code !== 1001) {
        state.lastError = `Burst socket closed (${code})${reason ? `: ${reason}` : ''}`;
      }
      clearTimeout(timer);
      finalize();
    });
  });

  state.burstPromise = promise;
  return promise;
}

export async function getAisVesselsSnapshot(): Promise<{
  mode: FeedMode;
  message?: string;
  vessels: Vessel[];
  updatedAt: string;
}> {
  const apiKey = process.env.AISSTREAM_API_KEY;
  const now = new Date().toISOString();

  if (!apiKey) {
    return {
      mode: 'unavailable',
      message: 'Live vessel feed unavailable',
      vessels: [],
      updatedAt: now
    };
  }

  ensureStarted();
  const state = getState();
  cleanupStale(state);

  let vessels = Array.from(state.vessels.values());
  const cacheStale = !state.lastMessageAt || Date.now() - state.lastMessageAt > 90_000;
  const burstCooldownPassed = !state.lastBurstAt || Date.now() - state.lastBurstAt > 20_000;
  if ((vessels.length === 0 || cacheStale) && burstCooldownPassed) {
    try {
      const burst = await collectBurst(apiKey);
      if (burst.length > 0) {
        vessels = Array.from(state.vessels.values());
      }
    } catch {
      // continue with cached/fallback behavior
    }
  }

  if (vessels.length > 0) {
    return {
      mode: 'live',
      vessels,
      updatedAt: new Date(Math.max(...vessels.map((v) => new Date(v.updatedAt).getTime()))).toISOString()
    };
  }

  if (state.lastError) {
    return {
      mode: 'fallback',
      message: `AIS feed degraded: ${state.lastError}. Showing fallback vessel sample.`,
      vessels: fallbackVessels,
      updatedAt: now
    };
  }

  return {
    mode: 'fallback',
    message: 'Awaiting AIS feed initialization. Showing fallback vessel sample.',
    vessels: fallbackVessels,
    updatedAt: now
  };
}
