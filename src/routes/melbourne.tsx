import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { fetchMelbourneComedy } from '../data/fetchComedy';
import { Table } from '../components';

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

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-10">
      <div className="flex flex-col gap-6 w-full max-w-7xl">
        <h1 className="text-3xl sm:text-5xl font-bold" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
          Melbourne Comedy Shows
        </h1>
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
  )
}