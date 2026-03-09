export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type OperationalStatus = 'normal' | 'elevated' | 'severe';
export type Region = 'Americas' | 'Europe' | 'Asia';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface TrendPoint {
  label: string;
  value: number;
}

export interface Port {
  id: string;
  slug: string;
  name: string;
  country: string;
  region: Region;
  coordinates: Coordinates;
  congestionScore: number;
  shipsWaiting: number;
  avgDelayHours: number;
  trendDeltaPct: number;
  status: OperationalStatus;
  berthUtilizationPct: number;
  dwellTimeHours: number;
  tradeLaneExposure: string;
  sparkline: number[];
  updatedAt: string;
}

export interface CongestionSnapshot {
  generatedAt: string;
  ports: Port[];
  sourceMode: 'live' | 'sample';
}

export interface Vessel {
  id: string;
  mmsi: number;
  lat: number;
  lon: number;
  speed?: number;
  course?: number;
  updatedAt: string;
}

export interface Webcam {
  id: string;
  portSlug: string;
  title: string;
  sourceName: string;
  url: string;
  embedUrl?: string;
  previewImage: string;
  isEmbeddable: boolean;
}

export interface WeatherAlert {
  id: string;
  location: string;
  region: Region;
  coordinates: Coordinates;
  condition: string;
  severity: Severity;
  likelyImpact: string;
  advisory: string;
  updatedAt: string;
}

export interface SupplyChainAlert {
  id: string;
  title: string;
  detail: string;
  severity: Severity;
  region: Region;
  impactedLanes: string[];
  updatedAt: string;
}

export interface DailyBrief {
  generatedAt: string;
  sourceMode: 'live-llm' | 'sample-template';
  headline: string;
  bullets: string[];
}
