import { AdvancedMarker, APIProvider, Map as GoogleMap, Pin } from '@vis.gl/react-google-maps';
import { useMemo, useState } from 'react';
import { getTypeAttributes } from '../helper';
import { type ComedyEvent } from '../types';
import { CellType } from './cell-type';
import { DayBadge } from './day-badge';

interface VenueMapProps {
  events: ComedyEvent[];
}

interface ShowDetails {
  day: string;
  insta?: string;
  name: string;
  time: string;
  type: string;
}

interface VenueLocation {
  address: string;
  lat: number;
  lng: number;
  shows: ShowDetails[];
  venueName: string;
}

function VenueMapContent({ events }: { events: ComedyEvent[] }) {
  const [selectedVenue, setSelectedVenue] = useState<VenueLocation | null>(null);

  const locations = useMemo(() => {
    const unique = new Map<string, VenueLocation>();

    events.forEach((e) => {
      const rawVenue = e['Venue (Insta)']?.trim() || '';

      // Clean up venue name
      let venueName = rawVenue
        .replace(/^https?:\/\/[^\s]+/, '')
        .replace('@', '')
        .trim();

      if (!venueName && rawVenue.startsWith('http')) {
        venueName = rawVenue
          .replace(/^https?:\/\/(www\.)?instagram\.com\//, '@')
          .replace(/\/$/, '');
      }

      const showName = e.Name?.trim();
      const day = e.Day?.trim() || '';
      const time = e.Start?.trim() || '';
      const type = e.Type?.trim() || 'Show';
      const address = e.Address || '';
      const insta = e.Insta;

      const latStr = e.Latitude;
      const lngStr = e.Longitude;

      if (venueName && latStr && lngStr && showName) {
        const lat = parseFloat(latStr);
        const lng = parseFloat(lngStr);

        if (!isNaN(lat) && !isNaN(lng)) {
          const showDetail: ShowDetails = { name: showName, day, time, type, insta };

          if (unique.has(venueName)) {
            const existing = unique.get(venueName)!;
            const isDuplicate = existing.shows.some((s) => s.name === showName && s.day === day);
            if (!isDuplicate) {
              existing.shows.push(showDetail);
            }
          } else {
            unique.set(venueName, {
              venueName,
              address,
              lat,
              lng,
              shows: [showDetail],
            });
          }
        }
      }
    });

    return Array.from(unique.values());
  }, [events]);

  return (
    <GoogleMap
      defaultCenter={{ lat: -37.8136, lng: 144.9631 }}
      defaultZoom={13}
      mapId="DEMO_MAP_ID"
      disableDefaultUI={true}
      className="w-full h-full"
      onClick={() => setSelectedVenue(null)}
    >
      {locations.map((loc) => {
        const primaryType = loc.shows[0]?.type || '';
        const { pin } = getTypeAttributes(primaryType);

        return (
          <AdvancedMarker
            key={loc.venueName}
            position={{ lat: loc.lat, lng: loc.lng }}
            title={loc.shows[0]?.name || loc.venueName}
            onClick={() => setSelectedVenue(loc)}
            className="cursor-pointer"
          >
            <Pin
              background={pin.background}
              borderColor={pin.borderColor}
              glyphColor={pin.glyphColor}
            />
          </AdvancedMarker>
        );
      })}
      {selectedVenue && (
        <AdvancedMarker
          position={{ lat: selectedVenue.lat, lng: selectedVenue.lng }}
          zIndex={50}
          className="cursor-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col items-center mb-10 drop-shadow-xl">
            <div className="p-0 min-w-[240px] max-w-[280px] bg-background text-foreground rounded-md overflow-hidden">
              <div className="p-3 flex flex-col gap-3 max-h-[200px] overflow-y-auto">
                {selectedVenue.shows.map((show, index) => {
                  return (
                    <div
                      key={index}
                      className="flex flex-col border-b border-border pb-2 last:border-0 last:pb-0"
                    >
                      {show.insta ? (
                        <a
                          href={show.insta}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-extrabold text-base text-primary hover:underline leading-tight mb-1.5 pr-4  transition-colors block"
                        >
                          {show.name}
                        </a>
                      ) : (
                        <h4 className="font-extrabold text-base leading-tight mb-1.5 pr-4">
                          {show.name}
                        </h4>
                      )}
                      <div className="flex items-center flex-wrap gap-2 text-xs font-medium text-muted-foreground">
                        {show.type && <CellType type={show.type} />}
                        <span className="text-gray-600 dark:text-gray-400">
                          <DayBadge day={show.day} />
                          {show.time && ` • ${show.time}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-gray-200 dark:border-zinc-800 p-3">
                <div className="mb-3">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">
                    Location
                  </p>
                  <h3 className="font-bold text-sm text-foreground leading-tight">
                    {selectedVenue.venueName}
                  </h3>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    selectedVenue.venueName + ' ' + selectedVenue.address + ' Melbourne',
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded shadow-sm transition-all hover:shadow-md"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </AdvancedMarker>
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
