'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { CircleMarker, MapContainer, Marker, Polyline, Popup, TileLayer, Tooltip } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { Port, Vessel } from '@/lib/types/domain';
import { tradeLanes } from '@/lib/data/mock-data';
import { Card } from '@/components/ui/card';

function vesselSeverity(vessel: Vessel): 'low' | 'medium' | 'high' | 'critical' {
  if ((vessel.speed ?? 0) < 2) return 'critical';
  if ((vessel.speed ?? 0) < 6) return 'high';
  if ((vessel.speed ?? 0) < 12) return 'medium';
  return 'low';
}

function markerColorBySeverity(severity: ReturnType<typeof vesselSeverity>) {
  if (severity === 'critical') return '#ef4444';
  if (severity === 'high') return '#f97316';
  if (severity === 'medium') return '#f59e0b';
  return '#22c55e';
}

function vesselIcon(vessel: Vessel) {
  const severity = vesselSeverity(vessel);
  const color = markerColorBySeverity(severity);
  const pulse = severity === 'critical' || severity === 'high';
  return divIcon({
    className: 'vessel-marker',
    html: `<div style="position:relative;width:14px;height:14px;border-radius:999px;background:${color};box-shadow:0 0 0 3px rgba(255,255,255,0.12),0 0 16px ${color}"><span style="position:absolute;inset:-6px;border-radius:999px;border:1px solid ${color};opacity:${pulse ? 0.8 : 0};animation:${pulse ? 'pulse-ring 1.8s infinite' : 'none'}"></span></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
}

const majorRegions = [
  { label: 'Los Angeles / Long Beach', coords: [33.75, -118.25] as [number, number] },
  { label: 'Panama Canal', coords: [9.08, -79.68] as [number, number] },
  { label: 'Singapore', coords: [1.26, 103.84] as [number, number] },
  { label: 'Rotterdam', coords: [51.95, 4.14] as [number, number] },
  { label: 'Shanghai', coords: [31.23, 121.47] as [number, number] }
];

function MapLegend() {
  const legend = [
    { label: 'Transit Stable', color: '#22c55e' },
    { label: 'Moderate Speed', color: '#f59e0b' },
    { label: 'Slow/Queue', color: '#f97316' },
    { label: 'Near Standstill', color: '#ef4444' }
  ];

  return (
    <Card className="absolute bottom-3 left-3 z-[500] p-2 text-xs">
      <p className="mb-2 font-semibold text-cyan-100">Map Legend</p>
      <div className="space-y-1 text-slate-300">
        {legend.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span>{item.label}</span>
          </div>
        ))}
        <div className="mt-1 border-t border-white/10 pt-1 text-[11px] text-slate-400">Dashed lanes: major trade routes</div>
      </div>
    </Card>
  );
}

interface VesselApiResponse {
  vessels: Vessel[];
  sourceMode: 'live' | 'fallback' | 'unavailable';
  message?: string;
  updatedAt: string;
}

export function VesselMap({ ports }: { ports: Port[] }) {
  const [payload, setPayload] = useState<VesselApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchVessels = useCallback(async () => {
    try {
      const response = await fetch('/api/vessels', { cache: 'no-store' });
      if (!response.ok) throw new Error('Failed to load vessels');
      const data = (await response.json()) as VesselApiResponse;
      setPayload(data);
    } catch {
      setPayload({ vessels: [], sourceMode: 'unavailable', message: 'Live vessel feed unavailable', updatedAt: new Date().toISOString() });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchVessels();
    const timer = setInterval(() => {
      void fetchVessels();
    }, 20_000);
    return () => clearInterval(timer);
  }, [fetchVessels]);

  const vessels = useMemo(() => payload?.vessels ?? [], [payload]);
  const portMap = useMemo(() => new Map(ports.map((port) => [port.slug, port])), [ports]);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-cyan-100">Live Ship Map</h3>
        <div className="text-xs text-slate-400">Source: AISStream websocket via server route</div>
      </div>

      {payload?.sourceMode === 'unavailable' ? (
        <Card className="p-4 text-sm text-amber-200">Live vessel feed unavailable</Card>
      ) : null}

      {payload?.message && payload.sourceMode !== 'unavailable' ? (
        <Card className="p-3 text-xs text-amber-200">{payload.message}</Card>
      ) : null}

      <div className="relative h-[520px] overflow-hidden rounded-2xl border border-white/10 shadow-glow">
        {loading ? <div className="shimmer absolute inset-0 z-[450] h-full w-full bg-card/60" /> : null}
        <MapContainer center={[21, 8]} zoom={2} className="h-full w-full" worldCopyJump minZoom={2}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {tradeLanes.map((lane) => (
            <Polyline key={lane.id} positions={lane.path as [number, number][]} pathOptions={{ color: lane.color, weight: 4, opacity: 0.25 }} />
          ))}

          {tradeLanes.map((lane) => (
            <Polyline
              key={`${lane.id}-top`}
              positions={lane.path as [number, number][]}
              pathOptions={{ color: lane.color, weight: 2, opacity: 0.85, dashArray: '8, 8' }}
            >
              <Tooltip>{lane.name}</Tooltip>
            </Polyline>
          ))}

          {majorRegions.map((region) => (
            <CircleMarker key={region.label} center={region.coords} radius={4} pathOptions={{ color: '#22d3ee', fillOpacity: 0.9 }}>
              <Tooltip>{region.label}</Tooltip>
            </CircleMarker>
          ))}

          {vessels.map((vessel) => {
            const nearestPort = Array.from(portMap.values()).sort((a, b) => {
              const dA = Math.hypot(vessel.lat - a.coordinates.lat, vessel.lon - a.coordinates.lng);
              const dB = Math.hypot(vessel.lat - b.coordinates.lat, vessel.lon - b.coordinates.lng);
              return dA - dB;
            })[0];

            return (
              <Marker key={vessel.id} position={[vessel.lat, vessel.lon]} icon={vesselIcon(vessel)}>
                <Popup>
                  <div className="space-y-1 text-xs">
                    <p>
                      <strong>MMSI {vessel.mmsi}</strong>
                    </p>
                    <p>Speed: {vessel.speed?.toFixed(1) ?? 'n/a'} kn</p>
                    <p>Course: {vessel.course?.toFixed(0) ?? 'n/a'}°</p>
                    <p>Nearest hub: {nearestPort?.name ?? 'n/a'}</p>
                    <p>Updated: {new Date(vessel.updatedAt).toISOString()}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        <MapLegend />
      </div>

      <style jsx>{`
        @keyframes pulse-ring {
          0% {
            transform: scale(0.7);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}
