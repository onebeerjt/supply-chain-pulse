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
}

const TEN_MIN_MS = 10 * 60 * 1000;
const WS_URL = 'wss://stream.aisstream.io/v0/stream';

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
      reconnectTimer: null
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
          BoundingBoxes: [
            [
              [-90, -180],
              [90, 180]
            ]
          ],
          FilterMessageTypes: ['PositionReport']
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

  const vessels = Array.from(state.vessels.values());
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
