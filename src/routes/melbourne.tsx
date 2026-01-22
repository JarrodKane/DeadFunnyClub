import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Table } from '../components';
import { fetchMelbourneComedy } from '../data/fetchComedy';

export function Melbourne() {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedFrequencies, setSelectedFrequencies] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['melbourne-comedy'],
    queryFn: fetchMelbourneComedy,
    staleTime: 1000 * 60 * 60 * 24, // 1 day
    gcTime: 1000 * 60 * 60 * 24, // 1 day (formerly cacheTime)
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Melbourne Comedy Shows',
    description: 'Complete listing of comedy shows and stand-up events in Melbourne',
    itemListElement: events.slice(0, 20).map((event, index) => ({
      '@type': 'Event',
      position: index + 1,
      name: event.Name,
      startDate: event.Day,
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      location: {
        '@type': 'Place',
        name: event.Neighbourhood,
        address: event.Address || event.Neighbourhood,
      },
      offers: {
        '@type': 'Offer',
        price: event['Ticket Price'],
        priceCurrency: 'AUD',
      },
    })),
  };

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        <title>Melbourne Comedy Shows & Stand-Up Events | Dead Funny Club</title>
        <meta
          name="description"
          content="Find Melbourne comedy shows, stand-up events, and open mics. Complete weekly listings with venues, prices, and showtimes across all Melbourne neighbourhoods. Updated daily."
        />
        <meta
          name="keywords"
          content="Melbourne comedy, stand-up comedy Melbourne, comedy shows Melbourne, open mic Melbourne, comedy events, live comedy, Melbourne entertainment"
        />
        <link rel="canonical" href="https://deadfunny.club/melbourne" />

        {/* Open Graph */}
        <meta property="og:title" content="Melbourne Comedy Shows & Stand-Up Events | Dead Funny Club" />
        <meta property="og:description" content="Find Melbourne comedy shows, stand-up events, and open mics. Complete weekly listings with venues, prices, and showtimes." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://deadfunny.club/melbourne" />
        <meta property="og:site_name" content="Dead Funny Club" />
        <meta property="og:image" content="https://deadfunny.club/dfc.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Melbourne Comedy Shows & Stand-Up Events | Dead Funny Club" />
        <meta name="twitter:description" content="Find Melbourne comedy shows, stand-up events, and open mics. Complete weekly listings with venues, prices, and showtimes." />
        <meta name="twitter:image" content="https://deadfunny.club/dfc.png" />
      </Helmet>
      <main className="flex min-h-screen flex-col items-center p-4 sm:p-10">
        <div className="flex flex-col gap-6 w-full max-w-7xl">
          <div className="flex gap-3.5">
            <h1
              className="text-3xl sm:text-5xl font-bold"
              style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
            >
              Melbourne Comedy Shows
            </h1>
            {/* <NeighbourhoodSelect events={events} /> */}
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
          <footer className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              All data imported from{' '}
              <a
                href="https://docs.google.com/spreadsheets/d/1MEXRL83oZ72PONC6k5yhqJb1EkGYADJ3TlMxkmDVaW8/edit?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Melbourne Standup Sheet
              </a>
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
