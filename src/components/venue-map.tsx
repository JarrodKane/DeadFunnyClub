import { useEffect, useState, useMemo } from 'react';
import {
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
  Pin,
  useMap,
  useMapsLibrary // <--- Import this hook
} from '@vis.gl/react-google-maps';
import { type ComedyEvent } from '../types';

interface VenueMapProps {
  events: ComedyEvent[];
}

interface VenueLocation {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

// 1. Logic Component (Must be INSIDE the Provider)
function VenueMapContent({ events }: { events: ComedyEvent[] }) {
  const map = useMap();
  const geocodingLib = useMapsLibrary('geocoding'); // <--- Safely load the library
  const [locations, setLocations] = useState<VenueLocation[]>([]);

  // Calculate unique venues
  const venues = useMemo(() => {
    const unique = new Map<string, string>();
    events.forEach(e => {
      const venueName = e["Venue (Insta)"]?.replace(/^https?:\/\/[^\s]+/, '').replace('@', '').trim();
      const address = e.Address;
      if (venueName && address) {
        unique.set(venueName, address);
      }
    });
    return Array.from(unique.entries());
  }, [events]);

  // Geocode Effect
  useEffect(() => {
    // STOP if the library isn't loaded yet
    if (!geocodingLib || !map || venues.length === 0) return;

    const geocoder = new google.maps.Geocoder();
    let isMounted = true;

    const fetchCoords = async () => {
      const resolvedVenues: VenueLocation[] = [];

      // Loop through venues
      for (const [name, address] of venues) {
        try {
          const result = await geocoder.geocode({ address: `${address}, Melbourne, Australia` });
          if (result.results[0]) {
            const { lat, lng } = result.results[0].geometry.location;
            resolvedVenues.push({ name, address, lat: lat(), lng: lng() });
          }
        } catch (error) {
          console.error(`Failed to geocode ${name}:`, error);
        }
        // Delay to prevent rate limiting
        await new Promise(r => setTimeout(r, 250));
      }

      if (isMounted) {
        setLocations(resolvedVenues);

        // Fit bounds to show all pins
        if (resolvedVenues.length > 0) {
          const bounds = new google.maps.LatLngBounds();
          resolvedVenues.forEach(loc => bounds.extend({ lat: loc.lat, lng: loc.lng }));
          map.fitBounds(bounds);

          // Prevent zooming in too close on a single pin
          if (resolvedVenues.length === 1) {
            map.setZoom(15);
          }
        }
      }
    };

    fetchCoords();

    return () => { isMounted = false; };
  }, [venues, geocodingLib, map]); // <--- Dependency on geocodingLib ensures it's ready

  return (
    <GoogleMap
      defaultCenter={{ lat: -37.8136, lng: 144.9631 }}
      defaultZoom={13}
      mapId="DEMO_MAP_ID"
      disableDefaultUI={true}
      className="w-full h-full"
    >
      {locations.map((loc) => (
        <AdvancedMarker key={loc.name} position={{ lat: loc.lat, lng: loc.lng }} title={loc.name}>
          <Pin background={'#E11D48'} borderColor={'#881337'} glyphColor={'white'} />
        </AdvancedMarker>
      ))}
    </GoogleMap>
  );
}

// 2. Wrapper Component (Provides the Context)
export function VenueMap({ events }: VenueMapProps) {
  return (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-sm border border-border bg-muted">
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_SHEETS_API_KEY || ''}>
        <VenueMapContent events={events} />
      </APIProvider>
    </div>
  );
}