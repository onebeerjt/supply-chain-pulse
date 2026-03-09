import { Vessel } from '@/lib/types/domain';

const now = new Date().toISOString();

export const fallbackVessels: Vessel[] = [
  { id: 'mmsi-538009331', mmsi: 538009331, lat: 33.86, lon: -121.8, speed: 15.2, course: 102, updatedAt: now },
  { id: 'mmsi-563128901', mmsi: 563128901, lat: 31.74, lon: 124.1, speed: 12.3, course: 214, updatedAt: now },
  { id: 'mmsi-636021918', mmsi: 636021918, lat: 1.2, lon: 103.6, speed: 8.4, course: 31, updatedAt: now },
  { id: 'mmsi-370917000', mmsi: 370917000, lat: 9.18, lon: -79.62, speed: 4.2, course: 17, updatedAt: now },
  { id: 'mmsi-244890527', mmsi: 244890527, lat: 51.86, lon: 3.92, speed: 9.9, course: 66, updatedAt: now }
];
