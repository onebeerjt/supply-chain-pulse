import { CongestionSnapshot, Port, Region } from '@/lib/types/domain';
import { getVessels } from '@/lib/providers/vesselProvider';

type PortSeed = {
  id: string;
  slug: string;
  name: string;
  country: string;
  region: Region;
  coordinates: { lat: number; lng: number };
  tradeLaneExposure: string;
};

const MAJOR_PORTS: PortSeed[] = [
  {
    id: 'port-la',
    slug: 'port-of-los-angeles',
    name: 'Port of Los Angeles',
    country: 'United States',
    region: 'Americas',
    coordinates: { lat: 33.7361, lng: -118.2923 },
    tradeLaneExposure: 'Trans-Pacific import lanes'
  },
  {
    id: 'port-lb',
    slug: 'port-of-long-beach',
    name: 'Port of Long Beach',
    country: 'United States',
    region: 'Americas',
    coordinates: { lat: 33.7542, lng: -118.2167 },
    tradeLaneExposure: 'Trans-Pacific consumer goods'
  },
  {
    id: 'port-rotterdam',
    slug: 'port-of-rotterdam',
    name: 'Port of Rotterdam',
    country: 'Netherlands',
    region: 'Europe',
    coordinates: { lat: 51.95, lng: 4.14 },
    tradeLaneExposure: 'North Europe gateway'
  },
  {
    id: 'port-shanghai',
    slug: 'port-of-shanghai',
    name: 'Port of Shanghai',
    country: 'China',
    region: 'Asia',
    coordinates: { lat: 31.2304, lng: 121.4737 },
    tradeLaneExposure: 'East Asia export lanes'
  },
  {
    id: 'port-singapore',
    slug: 'port-of-singapore',
    name: 'Port of Singapore',
    country: 'Singapore',
    region: 'Asia',
    coordinates: { lat: 1.2644, lng: 103.84 },
    tradeLaneExposure: 'Malacca transshipment chokepoint'
  },
  {
    id: 'port-panama',
    slug: 'panama-canal',
    name: 'Panama Canal',
    country: 'Panama',
    region: 'Americas',
    coordinates: { lat: 9.08, lng: -79.68 },
    tradeLaneExposure: 'Canal relay for Atlantic-Pacific services'
  }
];

const history = new Map<string, number>();

function haversineKm(aLat: number, aLon: number, bLat: number, bLon: number): number {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(bLat - aLat);
  const dLon = toRad(bLon - aLon);
  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);
  const h = sinLat * sinLat + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * sinLon * sinLon;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function statusFromCount(count: number): Port['status'] {
  if (count >= 25) return 'severe';
  if (count >= 10) return 'elevated';
  return 'normal';
}

function scoreFromCount(count: number): number {
  return Math.min(100, Math.max(8, Math.round((count / 30) * 100)));
}

function buildSparkline(base: number, delta: number): number[] {
  return [
    Math.max(0, base - delta - 3),
    Math.max(0, base - delta - 2),
    Math.max(0, base - delta - 1),
    Math.max(0, base - delta),
    Math.max(0, base - Math.round(delta / 2)),
    base
  ];
}

export async function getCongestionSnapshot(): Promise<CongestionSnapshot> {
  const vesselSnapshot = await getVessels();
  const sourceMode = vesselSnapshot.sourceMode === 'live' ? 'live' : 'sample';

  const ports: Port[] = MAJOR_PORTS.map((seed) => {
    const nearby = vesselSnapshot.vessels.filter(
      (v) => haversineKm(seed.coordinates.lat, seed.coordinates.lng, v.lat, v.lon) <= 25
    );
    const count = nearby.length;
    const prev = history.get(seed.slug) ?? count;
    history.set(seed.slug, count);

    const trendDeltaPct = prev === 0 ? (count > 0 ? 100 : 0) : ((count - prev) / prev) * 100;
    const status = statusFromCount(count);
    const congestionScore = scoreFromCount(count);

    const avgDelayHours = status === 'severe' ? 36 + Math.round(count * 0.4) : status === 'elevated' ? 18 + Math.round(count * 0.25) : 6 + Math.round(count * 0.15);

    return {
      ...seed,
      congestionScore,
      shipsWaiting: count,
      avgDelayHours,
      trendDeltaPct: Number(trendDeltaPct.toFixed(1)),
      status,
      berthUtilizationPct: Math.min(98, 45 + Math.round((count / 30) * 55)),
      dwellTimeHours: Math.max(6, Math.round(avgDelayHours * 1.25)),
      sparkline: buildSparkline(congestionScore, Math.round(trendDeltaPct / 6)),
      updatedAt: vesselSnapshot.updatedAt
    };
  }).sort((a, b) => b.congestionScore - a.congestionScore);

  return {
    generatedAt: new Date().toISOString(),
    sourceMode,
    ports
  };
}

export async function getPortBySlug(slug: string): Promise<Port | undefined> {
  const snapshot = await getCongestionSnapshot();
  return snapshot.ports.find((port) => port.slug === slug);
}
