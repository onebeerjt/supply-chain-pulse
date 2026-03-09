'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { Port, Vessel } from '@/lib/types/domain';

export function PortMiniMap({ port, vessels }: { port: Port; vessels: Vessel[] }) {
  return (
    <div className="h-72 overflow-hidden rounded-2xl border border-white/10">
      <MapContainer center={[port.coordinates.lat, port.coordinates.lng]} zoom={6} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <Marker
          position={[port.coordinates.lat, port.coordinates.lng]}
          icon={divIcon({ className: 'port-pin', html: '<div style="width:16px;height:16px;border-radius:999px;background:#22d3ee;box-shadow:0 0 20px #22d3ee"></div>' })}
        >
          <Popup>{port.name}</Popup>
        </Marker>
        {vessels.map((vessel) => (
          <Marker
            key={vessel.id}
            position={[vessel.lat, vessel.lon]}
            icon={divIcon({ className: 'nearby-vessel', html: '<div style="width:10px;height:10px;border-radius:999px;background:#f59e0b"></div>' })}
          >
            <Popup>MMSI {vessel.mmsi}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
