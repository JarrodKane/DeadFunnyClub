import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { fetchMelbourneComedy } from '../data/fetchComedy';
import { Table } from '../components';
import { GeocodeHelper } from '../components/geocode-helper';
import { VenueMap } from '../components/venue-map';

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

  useEffect(() => {
    document.title = 'Melbourne Comedy Shows & Stand-Up Events | Dead Funny Club';

    // Meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Find Melbourne comedy shows, stand-up events, and open mics. Complete weekly listings with venues, prices, and showtimes across all Melbourne neighbourhoods. Updated daily.');

    // Meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', 'Melbourne comedy, stand-up comedy Melbourne, comedy shows Melbourne, open mic Melbourne, comedy events, live comedy, Melbourne entertainment');

    // Open Graph tags
    const ogTags = [
      { property: 'og:title', content: 'Melbourne Comedy Shows & Stand-Up Events | Dead Funny Club' },
      { property: 'og:description', content: 'Find Melbourne comedy shows, stand-up events, and open mics. Complete weekly listings with venues, prices, and showtimes.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: window.location.href },
    ];

    ogTags.forEach(({ property, content }) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    });

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.href);

    // Add structured data for comedy events
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Melbourne Comedy Shows",
      "description": "Complete listing of comedy shows and stand-up events in Melbourne",
      "itemListElement": events.slice(0, 20).map((event, index) => ({
        "@type": "Event",
        "position": index + 1,
        "name": event.Name,
        "startDate": event.Day,
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "eventStatus": "https://schema.org/EventScheduled",
        "location": {
          "@type": "Place",
          "name": event.Neighbourhood,
          "address": event.Address || event.Neighbourhood
        },
        "offers": {
          "@type": "Offer",
          "price": event["Ticket Price"],
          "priceCurrency": "AUD"
        }
      }))
    };

    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);


  }, [events]);

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-10">
      <div className="w-full max-w-7xl">
        <VenueMap events={events} />
        {/* Use the same map context or ensure APIProvider is wrapping this */}
        <GeocodeHelper events={events} />
      </div>
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