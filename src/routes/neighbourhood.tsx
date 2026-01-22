import { useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { fetchMelbourneComedy } from '../data/fetchComedy';
import { Table } from '../components/table/table';
import { VenueMap } from '../components/map/venue-map';
import { toSlug } from '../helper';

export function Neighbourhood() {
  const { neighbourhood } = useParams({ from: '/melbourne/$neighbourhood' });

  const { data: allEvents = [], isLoading } = useQuery({
    queryKey: ['melbourne-comedy'],
    queryFn: fetchMelbourneComedy,
    staleTime: 1000 * 60 * 60 * 24,
  });

  const suburbEvents = allEvents.filter(
    (event) => event.Neighbourhood && toSlug(event.Neighbourhood) === neighbourhood,
  );

  const displayName =
    suburbEvents.length > 0
      ? suburbEvents[0].Neighbourhood
      : neighbourhood
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

  useEffect(() => {
    if (displayName) {
      document.title = `Stand-up Comedy in ${displayName} | Dead Funny Club`;
    }
  }, [displayName]);

  if (isLoading) return <div className="flex justify-center p-10">Loading...</div>;

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-10">
      <div className="flex flex-col gap-6 w-full max-w-7xl">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl sm:text-5xl font-bold font-impact uppercase tracking-wide">
            {displayName} Comedy
          </h1>
          <p className="text-muted-foreground">
            Found {suburbEvents.length} upcoming shows in {displayName}.
          </p>
        </div>

        <div className="w-full h-64 sm:h-96 rounded-lg overflow-hidden">
          <VenueMap events={suburbEvents} />
        </div>
        {suburbEvents.length > 0 ? (
          <Table
            data={suburbEvents}
            // Pass empty state handlers since we don't need deep filtering on these sub-pages usually,
            // or pass your existing state handlers if you want them to be filterable.
            selectedDays={[]}
            setSelectedDays={() => { }}
            selectedFrequencies={[]}
            setSelectedFrequencies={() => { }}
            selectedTypes={[]}
            setSelectedTypes={() => { }}
          />
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            No upcoming gigs found in {displayName} right now.
            <a href="/melbourne" className="text-primary hover:underline ml-1">
              View all Melbourne shows
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
