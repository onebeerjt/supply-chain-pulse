import { Port, SupplyChainAlert, WeatherAlert, Webcam } from '@/lib/types/domain';

const now = () => new Date().toISOString();

export const mockPorts: Port[] = [
  {
    id: 'port-la', slug: 'port-of-los-angeles', name: 'Port of Los Angeles', country: 'United States', region: 'Americas',
    coordinates: { lat: 33.7361, lng: -118.2923 }, congestionScore: 82, shipsWaiting: 29, avgDelayHours: 40, trendDeltaPct: 12.4,
    status: 'severe', berthUtilizationPct: 93, dwellTimeHours: 56, tradeLaneExposure: 'Trans-Pacific import lanes',
    sparkline: [71, 74, 76, 79, 81, 82], updatedAt: now()
  },
  {
    id: 'port-lb', slug: 'port-of-long-beach', name: 'Port of Long Beach', country: 'United States', region: 'Americas',
    coordinates: { lat: 33.7542, lng: -118.2167 }, congestionScore: 78, shipsWaiting: 24, avgDelayHours: 34, trendDeltaPct: 9.1,
    status: 'severe', berthUtilizationPct: 90, dwellTimeHours: 49, tradeLaneExposure: 'Trans-Pacific consumer goods',
    sparkline: [69, 70, 72, 75, 77, 78], updatedAt: now()
  },
  {
    id: 'port-panama', slug: 'panama-canal', name: 'Panama Canal', country: 'Panama', region: 'Americas',
    coordinates: { lat: 9.080, lng: -79.680 }, congestionScore: 73, shipsWaiting: 38, avgDelayHours: 52, trendDeltaPct: 6.4,
    status: 'elevated', berthUtilizationPct: 88, dwellTimeHours: 61, tradeLaneExposure: 'US East Coast - Asia relay',
    sparkline: [66, 67, 69, 71, 72, 73], updatedAt: now()
  },
  {
    id: 'port-rotterdam', slug: 'port-of-rotterdam', name: 'Port of Rotterdam', country: 'Netherlands', region: 'Europe',
    coordinates: { lat: 51.95, lng: 4.14 }, congestionScore: 59, shipsWaiting: 15, avgDelayHours: 19, trendDeltaPct: -2.2,
    status: 'elevated', berthUtilizationPct: 76, dwellTimeHours: 34, tradeLaneExposure: 'North Europe gateway',
    sparkline: [61, 60, 60, 59, 59, 59], updatedAt: now()
  },
  {
    id: 'port-singapore', slug: 'port-of-singapore', name: 'Port of Singapore', country: 'Singapore', region: 'Asia',
    coordinates: { lat: 1.2644, lng: 103.84 }, congestionScore: 70, shipsWaiting: 31, avgDelayHours: 29, trendDeltaPct: 4.9,
    status: 'elevated', berthUtilizationPct: 87, dwellTimeHours: 47, tradeLaneExposure: 'Malacca transshipment node',
    sparkline: [63, 65, 66, 68, 69, 70], updatedAt: now()
  },
  {
    id: 'port-shanghai', slug: 'port-of-shanghai', name: 'Port of Shanghai', country: 'China', region: 'Asia',
    coordinates: { lat: 31.2304, lng: 121.4737 }, congestionScore: 68, shipsWaiting: 26, avgDelayHours: 27, trendDeltaPct: 3.6,
    status: 'elevated', berthUtilizationPct: 84, dwellTimeHours: 43, tradeLaneExposure: 'East Asia export powerhouse',
    sparkline: [64, 65, 66, 66, 67, 68], updatedAt: now()
  },
  {
    id: 'port-ningbo', slug: 'port-of-ningbo', name: 'Port of Ningbo-Zhoushan', country: 'China', region: 'Asia',
    coordinates: { lat: 29.8683, lng: 121.544 }, congestionScore: 63, shipsWaiting: 18, avgDelayHours: 21, trendDeltaPct: 1.7,
    status: 'elevated', berthUtilizationPct: 78, dwellTimeHours: 36, tradeLaneExposure: 'Feeder to Pacific lanes',
    sparkline: [60, 61, 61, 62, 62, 63], updatedAt: now()
  },
  {
    id: 'port-hamburg', slug: 'port-of-hamburg', name: 'Port of Hamburg', country: 'Germany', region: 'Europe',
    coordinates: { lat: 53.5461, lng: 9.9661 }, congestionScore: 52, shipsWaiting: 9, avgDelayHours: 14, trendDeltaPct: -4.8,
    status: 'normal', berthUtilizationPct: 68, dwellTimeHours: 27, tradeLaneExposure: 'Central Europe distribution',
    sparkline: [57, 56, 55, 54, 53, 52], updatedAt: now()
  },
  {
    id: 'port-santos', slug: 'port-of-santos', name: 'Port of Santos', country: 'Brazil', region: 'Americas',
    coordinates: { lat: -23.9618, lng: -46.3289 }, congestionScore: 57, shipsWaiting: 12, avgDelayHours: 18, trendDeltaPct: 2.5,
    status: 'elevated', berthUtilizationPct: 72, dwellTimeHours: 31, tradeLaneExposure: 'South America agri exports',
    sparkline: [54, 54, 55, 56, 56, 57], updatedAt: now()
  },
  {
    id: 'port-dubai', slug: 'port-of-jebel-ali', name: 'Port of Jebel Ali', country: 'UAE', region: 'Asia',
    coordinates: { lat: 25.0113, lng: 55.0617 }, congestionScore: 55, shipsWaiting: 11, avgDelayHours: 16, trendDeltaPct: 1.1,
    status: 'normal', berthUtilizationPct: 70, dwellTimeHours: 29, tradeLaneExposure: 'Middle East transshipment',
    sparkline: [53, 53, 54, 54, 55, 55], updatedAt: now()
  },
  {
    id: 'port-felixstowe', slug: 'port-of-felixstowe', name: 'Port of Felixstowe', country: 'United Kingdom', region: 'Europe',
    coordinates: { lat: 51.963, lng: 1.309 }, congestionScore: 49, shipsWaiting: 8, avgDelayHours: 12, trendDeltaPct: -1.9,
    status: 'normal', berthUtilizationPct: 64, dwellTimeHours: 24, tradeLaneExposure: 'UK inbound retail lanes',
    sparkline: [50, 50, 50, 49, 49, 49], updatedAt: now()
  },
  {
    id: 'port-savannah', slug: 'port-of-savannah', name: 'Port of Savannah', country: 'United States', region: 'Americas',
    coordinates: { lat: 32.0835, lng: -81.0998 }, congestionScore: 61, shipsWaiting: 14, avgDelayHours: 22, trendDeltaPct: 5.8,
    status: 'elevated', berthUtilizationPct: 74, dwellTimeHours: 38, tradeLaneExposure: 'US East Coast import surge',
    sparkline: [56, 57, 58, 59, 60, 61], updatedAt: now()
  }
];

export const mockWeatherAlerts: WeatherAlert[] = [
  { id: 'w-1', location: 'Memphis Cargo Hub', region: 'Americas', coordinates: { lat: 35.15, lng: -90.05 }, condition: 'Severe thunderstorms', severity: 'high', likelyImpact: 'Potential air cargo rollover and trucking appointment spillover across Southeast lanes.', advisory: 'Expect 8-14 hour ground delays on time-critical freight.', updatedAt: now() },
  { id: 'w-2', location: 'East China Sea Lanes', region: 'Asia', coordinates: { lat: 25.4, lng: 126.2 }, condition: 'Typhoon band formation', severity: 'critical', likelyImpact: 'Vessel speed reductions and dynamic rerouting across Shanghai and Ningbo approaches.', advisory: 'Schedule buffers of 24-36 hours for East Asia export bookings.', updatedAt: now() },
  { id: 'w-3', location: 'Rotterdam Approach', region: 'Europe', coordinates: { lat: 52.1, lng: 3.8 }, condition: 'Dense fog and gusting crosswinds', severity: 'medium', likelyImpact: 'Intermittent pilotage suspension can slow berth turn times and feeder rotations.', advisory: 'Watch for bunching in overnight berthing windows.', updatedAt: now() },
  { id: 'w-4', location: 'Gulf of Mexico Corridor', region: 'Americas', coordinates: { lat: 27.1, lng: -91.2 }, condition: 'Tropical moisture plume', severity: 'high', likelyImpact: 'Potential barge and coastal service disruptions for Gulf-origin freight.', advisory: 'Recheck ETAs for Gulf to East Coast cargo.', updatedAt: now() },
  { id: 'w-5', location: 'Singapore Strait', region: 'Asia', coordinates: { lat: 1.2, lng: 103.7 }, condition: 'Heavy convection and lightning', severity: 'medium', likelyImpact: 'Harbor operations may switch to conservative sequencing during storm cells.', advisory: 'Allow margin in transshipment cutoffs.', updatedAt: now() },
  { id: 'w-6', location: 'Panama Canal Watershed', region: 'Americas', coordinates: { lat: 9.2, lng: -79.6 }, condition: 'Sustained rainfall event', severity: 'low', likelyImpact: 'Near-term neutral; monitor lock scheduling advisories for any transit adjustment.', advisory: 'No immediate restrictions, but queue behavior can shift quickly.', updatedAt: now() }
];

export const mockDisruptionAlerts: SupplyChainAlert[] = [
  { id: 'a-1', title: 'LA/LB vessel queue expands', detail: 'Combined anchorage count moved higher for a third session, lifting dwell time pressure on import flows.', severity: 'high', region: 'Americas', impactedLanes: ['Trans-Pacific Eastbound'], updatedAt: now() },
  { id: 'a-2', title: 'Panama transit backlog holds elevated', detail: 'Booking windows remain tight and non-priority vessels continue to face added waiting time.', severity: 'high', region: 'Americas', impactedLanes: ['Canal relay', 'US East Coast services'], updatedAt: now() },
  { id: 'a-3', title: 'North Europe weather friction', detail: 'Fog and wind at Rotterdam intermittently reduce approach throughput and tug availability.', severity: 'medium', region: 'Europe', impactedLanes: ['North Europe feeder network'], updatedAt: now() },
  { id: 'a-4', title: 'East Asia typhoon watch', detail: 'Carriers are preparing slow-steaming and selective blank sailings through high-risk weather bands.', severity: 'critical', region: 'Asia', impactedLanes: ['Shanghai export lanes', 'Ningbo feeder links'], updatedAt: now() },
  { id: 'a-5', title: 'US inland air cargo risk rises', detail: 'Thunderstorm volatility around Memphis increases potential for overnight rollover.', severity: 'medium', region: 'Americas', impactedLanes: ['Domestic air cargo'], updatedAt: now() },
  { id: 'a-6', title: 'Singapore transshipment dwell inches up', detail: 'Transshipment nodes are still fluid but show slight container rollover pressure.', severity: 'medium', region: 'Asia', impactedLanes: ['Malacca transshipment'], updatedAt: now() }
];

export const mockWebcams: Webcam[] = [
  {
    id: 'cam-la',
    portSlug: 'port-of-los-angeles',
    title: 'Port of Los Angeles Waterfront Livestream',
    sourceName: 'Port of Los Angeles',
    url: 'https://www.portoflosangeles.org/news/livestream',
    previewImage: 'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=1200&q=80',
    isEmbeddable: false
  },
  {
    id: 'cam-lb',
    portSlug: 'port-of-long-beach',
    title: 'Long Beach Harbor Camera',
    sourceName: 'Cruising Earth',
    url: 'https://www.cruisingearth.com/port-webcams/united-states/long-beach-california/',
    previewImage: 'https://images.unsplash.com/photo-1589778655375-3f2b6f8f95a8?auto=format&fit=crop&w=1200&q=80',
    isEmbeddable: false
  },
  {
    id: 'cam-rotterdam',
    portSlug: 'port-of-rotterdam',
    title: 'Rotterdam Port Webcam Hub',
    sourceName: 'Port of Rotterdam',
    url: 'https://www.portofrotterdam.com/en/experience-online/webcams',
    previewImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    isEmbeddable: false
  },
  {
    id: 'cam-panama',
    portSlug: 'panama-canal',
    title: 'Panama Canal Miraflores Locks',
    sourceName: 'Panama Canal Authority',
    url: 'https://multimedia.panama-canal.com/Webcams/miraflores.html',
    embedUrl: 'https://multimedia.panama-canal.com/Webcams/miraflores.html',
    previewImage: 'https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1200&q=80',
    isEmbeddable: true
  },
  {
    id: 'cam-singapore',
    portSlug: 'port-of-singapore',
    title: 'Singapore Strait Vessel Cam',
    sourceName: 'World Cams',
    url: 'https://worldcams.tv/singapore/singapore/port-of-singapore-live-webcam',
    previewImage: 'https://images.unsplash.com/photo-1541417904950-b855846fe074?auto=format&fit=crop&w=1200&q=80',
    isEmbeddable: false
  },
  {
    id: 'cam-felixstowe',
    portSlug: 'port-of-felixstowe',
    title: 'Felixstowe Seafront',
    sourceName: 'Harbor View Network',
    url: 'https://www.portoffelixstowe.co.uk/',
    previewImage: 'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=1200&q=80',
    isEmbeddable: false
  }
];

export const tradeLanes = [
  {
    id: 'lane-1',
    name: 'Trans-Pacific Eastbound',
    color: '#39d1ff',
    path: [
      [31.2, 121.7],
      [33.6, 140.2],
      [36.5, 170.0],
      [34.0, -150.0],
      [33.8, -118.3]
    ]
  },
  {
    id: 'lane-2',
    name: 'Asia-Europe via Suez',
    color: '#ff9f43',
    path: [
      [1.3, 103.8],
      [12.2, 45.0],
      [30.0, 32.5],
      [36.0, 14.0],
      [51.9, 4.1]
    ]
  },
  {
    id: 'lane-3',
    name: 'Canal Relay',
    color: '#f65f7a',
    path: [
      [33.7, -118.2],
      [18.4, -104.0],
      [9.0, -79.6],
      [26.0, -75.0],
      [32.0, -81.1]
    ]
  }
];
