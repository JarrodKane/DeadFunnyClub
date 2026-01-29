import type { ComedyEvent } from '../types';

const PAYLOAD_URL = import.meta.env.VITE_PAYLOAD_URL || 'https://admin.unchartedcomedy.com';

export async function fetchComedy(country: string, city: string): Promise<ComedyEvent[]> {
  try {
    // 1. Find City by SLUG (Matches URL exactly)
    const cityQuery = new URLSearchParams({
      'where[slug][equals]': city.toLowerCase(), // e.g. "gold-coast"
      'where[country][equals]': country.toUpperCase(), // e.g. "AU"
    });

    const cityRes = await fetch(`${PAYLOAD_URL}/api/cities?${cityQuery.toString()}`);

    if (!cityRes.ok) throw new Error('Failed to fetch city');

    const cityJson = await cityRes.json();

    if (!cityJson.docs || cityJson.docs.length === 0) {
      console.warn(`City not found: ${city}, ${country}`);
      return [];
    }

    const targetCity = cityJson.docs[0];
    const cityId = targetCity.id;

    // 2. SECOND: Fetch Rooms using the City ID
    const roomQuery = new URLSearchParams({
      'where[city][equals]': cityId, // Simple, fast ID lookup
      'limit': '1000',
      'depth': '1', // Still populate city details for the UI
    });

    const response = await fetch(`${PAYLOAD_URL}/api/rooms?${roomQuery.toString()}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch rooms: ${response.statusText}`);
    }

    const json = await response.json();

    // 3. Map Data
    return json.docs.map((room: any) => {
      let lat = undefined;
      let lng = undefined;
      if (room.location && Array.isArray(room.location)) {
        lng = room.location[0]?.toString();
        lat = room.location[1]?.toString();
      }

      let timeStr = '';
      if (room.startTime) {
        const date = new Date(room.startTime);
        timeStr = date.toLocaleTimeString('en-AU', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
      }

      return {
        Name: room.name,
        Day: room.day,
        Neighbourhood: room.city?.name || city,
        VenueName: room.venueName,
        Address: room.venue,
        Start: timeStr,
        Frequency: room.frequency,
        Type: room.type,
        'Ticket Price': room.ticketPrice === 0 ? 'Free' : `$${room.ticketPrice}`,
        'Venue (Insta)': '',
        FB: '',
        Insta: room.externalLink || '',
        'Room Runner (Insta)': room.roomRunners?.map((runner: any) => ({
          name: runner.name,
          url: runner.url
        })) || [],

        Info: room.info,
        Latitude: lat,
        Longitude: lng
      };
    });

  } catch (error) {
    console.error('Error fetching comedy events:', error);
    return [];
  }
}