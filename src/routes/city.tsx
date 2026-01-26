import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from '@tanstack/react-router';
import { Table } from '../components';
import { fetchComedy } from '../data/fetchComedy';

// Helper to capitalize first letter (melbourne -> Melbourne)
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function City() {
  // 1. Get params from URL (e.g. /au/melbourne -> country="au", city="melbourne")
  const { country, city } = useParams({ from: '/$country/$city' });

  const cityName = capitalize(city);
  const countryCode = country.toUpperCase();

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedFrequencies, setSelectedFrequencies] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // 2. Fetch data using dynamic keys
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['comedy', country, city],
    queryFn: () => fetchComedy(countryCode, cityName),
    staleTime: 1000 * 60 * 60,
  });

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${cityName} Comedy Shows`,
    description: `Complete listing of comedy shows in ${cityName}, ${countryCode}`,
    itemListElement: events.slice(0, 20).map((event, index) => ({
      '@type': 'Event',
      position: index + 1,
      name: event.Name,
      startDate: event.Day,
      location: {
        '@type': 'Place',
        name: event.Neighbourhood,
        address: event.Address,
      },
    })),
  };

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading {cityName}...</div>;
  }

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        <title>{cityName} Comedy Shows | Dead Funny Club</title>
        <meta
          name="description"
          content={`Find ${cityName} comedy shows, stand-up events, and open mics.`}
        />
        <link rel="canonical" href={`https://deadfunny.club/${country}/${city}`} />
      </Helmet>

      <main className="flex min-h-screen flex-col items-center p-4 sm:p-10">
        <div className="flex flex-col gap-6 w-full max-w-7xl">
          <div className="flex gap-3.5">
            <h1
              className="text-3xl sm:text-5xl font-bold"
              style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
            >
              {cityName} Comedy Shows
            </h1>
          </div>

          <Table
            data={events}
            selectedDays={selectedDays}
            setSelectedDays={setSelectedDays}
            selectedFrequencies={selectedFrequencies}
            setSelectedFrequencies={setSelectedFrequencies}
            selectedTypes={selectedTypes}
            setSelectedTypes={setSelectedTypes}
          />
        </div>
      </main>
    </>
  );
}