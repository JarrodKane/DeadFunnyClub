// src/routes/neighbourhood.tsx
import { useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { fetchMelbourneComedy } from '../data/fetchComedy';
import { Table } from '../components/table';
import { VenueMap } from '../components/venue-map';

// Helper to normalize strings for comparison (e.g. "Fitzroy North" -> "fitzroy-north")
const toSlug = (str: string) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

export function Neighbourhood() {
  // 1. Get the param from the URL
  const { neighbourhood } = useParams({ from: '/melbourne/$neighbourhood' });

  // 2. Fetch data (this will use the cache if already loaded!)
  const { data: allEvents = [], isLoading } = useQuery({
    queryKey: ['melbourne-comedy'],
    queryFn: fetchMelbourneComedy,
    staleTime: 1000 * 60 * 60 * 24,
  });

  // 3. Filter events for this specific suburb
  // We compare "fitzroy-north" (url) with toSlug("Fitzroy North") (data)
  const suburbEvents = allEvents.filter(event =>
    event.Neighbourhood && toSlug(event.Neighbourhood) === neighbourhood
  );

  // 4. Get the "Nice Name" for display (e.g. take the first match or capitalize the slug)
  const displayName = suburbEvents.length > 0
    ? suburbEvents[0].Neighbourhood
    : neighbourhood.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // 5. SEO & Metadata
  useEffect(() => {
    if (displayName) {
      document.title = `Stand-up Comedy in ${displayName} | Dead Funny Club`;
      // You can add meta description updates here too like in melbourne.tsx
    }
  }, [displayName]);

  if (isLoading) return <div className="flex justify-center p-10">Loading...</div>;

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-10">
      <div className="flex flex-col gap-6 w-full max-w-7xl">

        {/* Header Section */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl sm:text-5xl font-bold font-impact uppercase tracking-wide">
            {displayName} Comedy
          </h1>
          <p className="text-muted-foreground">
            Found {suburbEvents.length} upcoming shows in {displayName}.
          </p>
        </div>

        {/* The Map */}
        <div className="w-full h-64 sm:h-96 rounded-lg overflow-hidden">
          {/* Pass the filtered suburb events directly to the map */}
          <VenueMap events={suburbEvents} />
        </div>
        {/* NOTE: If the iframe above fails without an API key, use this simple non-API version: 
           src={`https://maps.google.com/maps?q=${displayName},+Melbourne+Australia&t=&z=14&ie=UTF8&iwloc=&output=embed`}
        */}

        {/* The Table */}
        {suburbEvents.length > 0 ? (
          <Table
            data={suburbEvents}
            // Pass empty state handlers since we don't need deep filtering on these sub-pages usually, 
            // or pass your existing state handlers if you want them to be filterable.
            selectedDays={[]} setSelectedDays={() => { }}
            selectedFrequencies={[]} setSelectedFrequencies={() => { }}
            selectedTypes={[]} setSelectedTypes={() => { }}
          />
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            No upcoming gigs found in {displayName} right now.
            <a href="/melbourne" className="text-primary hover:underline ml-1">View all Melbourne shows</a>
          </div>
        )}
      </div>
    </main >
  );
}