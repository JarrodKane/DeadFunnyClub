import {
  AdvancedMarker,
  APIProvider,
  Map as GoogleMap,
  Pin,
  useMap,
} from '@vis.gl/react-google-maps';
import { useEffect, useMemo, useState } from 'react';
import { getTypeAttributes } from '../../helper';
import { type ComedyEvent } from '../../types';
import { TypeBadge } from '../badges/type-badge';
import { DayBadge } from '../badges/day-badge';

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
  id: string;
  address: string;
  lat: number;
  lng: number;
  shows: ShowDetails[];
  venueName: string;
}

function VenueMapContent({ events }: { events: ComedyEvent[] }) {
  const [selectedVenue, setSelectedVenue] = useState<VenueLocation | null>(null);
  const map = useMap();

  const locations = useMemo(() => {
    const unique = new Map<string, VenueLocation>();

    events.forEach((e) => {
      const latStr = e.Latitude;
      const lngStr = e.Longitude;

      // Only map events that actually have coordinates
      if (latStr && lngStr) {
        const lat = parseFloat(latStr.toString());
        const lng = parseFloat(lngStr.toString());

        if (!isNaN(lat) && !isNaN(lng)) {
          // Create a unique ID based on location to group shows at the same spot
          // e.g. "144.9631,-37.8136"
          const locId = `${lng.toFixed(5)},${lat.toFixed(5)}`;

          const showDetail: ShowDetails = {
            name: e.Name,
            day: e.Day || '',
            time: e.Start || '',
            type: e.Type || 'Show',
            insta: e.Insta,
          };

          // If we've seen this location before, just add the show
          if (unique.has(locId)) {
            const existing = unique.get(locId)!;
            const isDuplicate = existing.shows.some(
              (s) => s.name === showDetail.name && s.day === showDetail.day
            );
            if (!isDuplicate) {
              existing.shows.push(showDetail);
            }
          } else {
            // New location found!
            // Clean up the venue name (e.g. remove http links if they ended up in the name field)
            // But since we fixed the import, e.Name should be the show name.
            // For the "Venue Name", we can try to guess it or just use the Show Name for now
            // since our data doesn't strictly have a "Venue Name" field separate from "Address".
            // Ideally, you'd add a "venueName" field to Payload later.
            // For now, we'll use the Address/Link as a fallback or just "Comedy Room".

            unique.set(locId, {
              id: locId,
              venueName: 'Comedy Room', // Generic title since we group by location
              address: e.Address || '', // This is the Google Maps link
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

  useEffect(() => {
    if (selectedVenue && map) {
      map.panTo({ lat: selectedVenue.lat, lng: selectedVenue.lng });
    }
  }, [selectedVenue, map]);

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
            key={loc.id}
            position={{ lat: loc.lat, lng: loc.lng }}
            title={loc.shows[0]?.name} // Tooltip
            onClick={(e) => {
              // Prevent clicking the map background
              e.domEvent.stopPropagation();
              setSelectedVenue(loc);
            }}
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
          onClick={(e) => e.domEvent.stopPropagation()}
        >
          <div className="flex flex-col items-center mb-10 drop-shadow-xl relative z-[60]">
            {/* Map Card */}
            <div className="p-0 min-w-[240px] max-w-[280px] bg-background text-foreground rounded-md overflow-hidden border border-border shadow-2xl">

              {/* Header: List of Shows */}
              <div className="p-3 flex flex-col gap-3 max-h-[200px] overflow-y-auto">
                {selectedVenue.shows.map((show, index) => (
                  <div
                    key={index}
                    className="flex flex-col border-b border-border pb-2 last:border-0 last:pb-0"
                  >
                    {show.insta ? (
                      <a
                        href={show.insta}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-extrabold text-base text-primary hover:underline leading-tight mb-1.5 pr-4 transition-colors block"
                      >
                        {show.name}
                      </a>
                    ) : (
                      <h4 className="font-extrabold text-base leading-tight mb-1.5 pr-4">
                        {show.name}
                      </h4>
                    )}
                    <div className="flex items-center flex-wrap gap-2 text-xs font-medium text-muted-foreground">
                      {show.type && <TypeBadge type={show.type} />}
                      <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <DayBadge day={show.day} />
                        {show.time && ` • ${show.time}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer: Action Button */}
              <div className="border-t border-border bg-muted/30 p-3">
                <a
                  href={selectedVenue.address} // The Google Maps link directly!
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block text-center bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold py-2.5 rounded shadow-sm transition-all hover:shadow-md"
                >
                  Get Directions
                </a>
              </div>
            </div>

            {/* Triangle Pointer */}
            <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-background absolute -bottom-2" />
          </div>
        </AdvancedMarker>
      )}
    </GoogleMap>
  );
}

export function VenueMap({ events }: VenueMapProps) {
  return (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-sm border border-border bg-muted relative">
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
        <VenueMapContent events={events} />
      </APIProvider>
    </div>
  );
}