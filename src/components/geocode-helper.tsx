import { useState } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { type ComedyEvent } from '../types';
import { Button } from './ui/button';

interface GeocodeHelperProps {
  events: ComedyEvent[];
}

export function GeocodeHelper({ events }: GeocodeHelperProps) {
  const geocodingLib = useMapsLibrary('geocoding');
  const [results, setResults] = useState<string>('');
  const [status, setStatus] = useState('Idle');

  const runGeocode = async () => {
    if (!geocodingLib) return;
    setStatus('Starting...');

    // 1. Get Unique Venues
    const uniqueVenues = new Map<string, string>();
    events.forEach(e => {
      const name = e["Venue (Insta)"]?.replace(/^https?:\/\/[^\s]+/, '').replace('@', '').trim();
      // Only add if we haven't seen it and it has an address
      if (name && e.Address && !uniqueVenues.has(name)) {
        uniqueVenues.set(name, e.Address);
      }
    });

    const geocoder = new google.maps.Geocoder();
    let output = "Venue Name\tAddress\tLat\tLng\n"; // Header row
    let count = 0;
    const total = uniqueVenues.size;

    // 2. Loop and Fetch
    for (const [name, address] of uniqueVenues) {
      setStatus(`Processing ${count + 1}/${total}: ${name}`);

      try {
        const response = await geocoder.geocode({ address: `${address}, Melbourne, Australia` });
        if (response.results[0]) {
          const { lat, lng } = response.results[0].geometry.location;
          // Use Tabs (\t) so it pastes perfectly into Google Sheets
          output += `${name}\t${address}\t${lat()}\t${lng()}\n`;
        }
      } catch (err) {
        console.error(`Failed: ${name}`, err);
        output += `${name}\t${address}\tERROR\tERROR\n`;
      }

      // 3. Small delay to prevent rate limiting
      await new Promise(r => setTimeout(r, 300));
      count++;
    }

    setResults(output);
    setStatus('Done! Copy the text below.');
  };

  return (
    <div className="p-4 border rounded-lg bg-muted my-8 w-full max-w-4xl">
      <h3 className="font-bold mb-2">📍 Admin: Lat/Long Generator</h3>
      <p className="text-sm mb-4">
        Click the button to generate coordinates for all {events.length} events found.
        Then copy/paste the result into your Google Sheet.
      </p>

      <div className="flex gap-4 items-center mb-4">
        <Button onClick={runGeocode} disabled={status.startsWith('Processing')}>
          {status === 'Idle' ? 'Generate Coordinates' : status}
        </Button>
      </div>

      {results && (
        <textarea
          className="w-full h-64 p-2 text-xs font-mono border rounded"
          value={results}
          readOnly
          onClick={(e) => e.currentTarget.select()}
        />
      )}
    </div>
  );
}