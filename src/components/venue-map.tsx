import {
  AdvancedMarker,
  APIProvider,
  Map as GoogleMap,
  InfoWindow,
  Pin,
  useMap
} from '@vis.gl/react-google-maps';
import { useEffect, useMemo, useState } from 'react';
import { type ComedyEvent } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let google: any;

interface VenueMapProps {
  events: ComedyEvent[];
}

interface ShowDetails {
  name: string;
  day: string;
  time: string;
  type: string;
}

interface VenueLocation {
  venueName: string;
  address: string;
  lat: number;
  lng: number;
  shows: ShowDetails[];
}

function VenueMapContent({ events }: { events: ComedyEvent[] }) {
  const map = useMap();
  const [selectedVenue, setSelectedVenue] = useState<VenueLocation | null>(null);

  const locations = useMemo(() => {
    const unique = new Map<string, VenueLocation>();

    events.forEach(e => {
      const venueName = e["Venue (Insta)"]?.replace(/^https?:\/\/[^\s]+/, '').replace('@', '').trim();
      // Grab the details
      const showName = e.Name?.trim();
      const day = e.Day?.trim() || '';
      const time = e.Start?.trim() || '';
      const type = e.Type?.trim() || 'Show';
      const address = e.Address || '';

      const latStr = e.Latitude;
      const lngStr = e.Longitude;

      if (venueName && latStr && lngStr && showName) {
        const lat = parseFloat(latStr);
        const lng = parseFloat(lngStr);

        if (!isNaN(lat) && !isNaN(lng)) {

          const showDetail: ShowDetails = { name: showName, day, time, type };

          if (unique.has(venueName)) {
            const existing = unique.get(venueName)!;
            // Avoid adding exact duplicates
            const isDuplicate = existing.shows.some(s => s.name === showName && s.day === day);
            if (!isDuplicate) {
              existing.shows.push(showDetail);
            }
          } else {
            unique.set(venueName, {
              venueName,
              address,
              lat,
              lng,
              shows: [showDetail]
            });
          }
        }
      }
    });

    return Array.from(unique.values());
  }, [events]);

  // Auto-Zoom Effect
  useEffect(() => {
    if (!map || locations.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    locations.forEach(loc => bounds.extend({ lat: loc.lat, lng: loc.lng }));

    if (locations.length === 1) {
      map.setCenter({ lat: locations[0].lat, lng: locations[0].lng });
      map.setZoom(15);
    } else {
      map.fitBounds(bounds);
    }
  }, [map, locations]);

  return (
    <GoogleMap
      defaultCenter={{ lat: -37.8136, lng: 144.9631 }}
      defaultZoom={13}
      mapId="DEMO_MAP_ID"
      disableDefaultUI={true}
      className="w-full h-full"
      onClick={() => setSelectedVenue(null)}
    >
      {locations.map((loc) => (
        <AdvancedMarker
          key={loc.venueName}
          position={{ lat: loc.lat, lng: loc.lng }}
          title={loc.shows[0]?.name || loc.venueName}
          onClick={() => setSelectedVenue(loc)}
        >
          <Pin background={'#E11D48'} borderColor={'#881337'} glyphColor={'white'} />
        </AdvancedMarker>
      ))}
      {selectedVenue && (
        <InfoWindow
          position={{ lat: selectedVenue.lat, lng: selectedVenue.lng }}
          onCloseClick={() => setSelectedVenue(null)}
          pixelOffset={[0, -30]}
        >
          <div className="p-1 min-w-[220px] max-w-[260px] text-black">
            <div className="flex flex-col gap-3 mb-3 max-h-[200px] overflow-y-auto">
              {selectedVenue.shows.map((show, index) => (
                <div key={index} className="flex flex-col border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                  <h4 className="font-extrabold text-lg leading-tight text-rose-600 mb-1">
                    {show.name}
                  </h4>

                  <div className="flex items-center flex-wrap gap-2 text-xs font-medium text-gray-700">
                    {show.type && (
                      <span className="bg-gray-100 text-gray-600 border border-gray-200 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide">
                        {show.type}
                      </span>
                    )}
                    <span>
                      {show.day} {show.time && `• ${show.time}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-2 pt-2 border-t border-gray-200 bg-gray-50 -mx-1 -mb-1 px-2 pb-2 rounded-b">
              <div className="mb-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Location</p>
                <h3 className="font-bold text-sm text-gray-900 leading-tight">
                  {selectedVenue.venueName}
                </h3>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedVenue.venueName + " " + selectedVenue.address + " Melbourne")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded transition-colors shadow-sm"
              >
                Get Directions
              </a>
            </div>

          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

export function VenueMap({ events }: VenueMapProps) {
  return (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-sm border border-border bg-muted">
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
        <VenueMapContent events={events} />
      </APIProvider>
    </div>
  );
}