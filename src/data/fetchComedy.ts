import type { ComedyEvent } from '../types';

// The URL of your Payload CMS (Admin Site)
const PAYLOAD_URL = import.meta.env.VITE_PAYLOAD_URL || 'http://localhost:3000';

// Helper: Payload stores text in a fancy JSON format (Lexical).
// We need to mash it back into a simple string for the frontend.
const extractTextFromLexical = (root: any): string => {
  if (!root?.children) return '';
  return root.children
    .map((child: any) => {
      if (child.type === 'text') return child.text;
      if (child.children) return extractTextFromLexical(child);
      return '';
    })
    .join(' ');
};

export async function fetchMelbourneComedy(): Promise<ComedyEvent[]> {
  try {
    // 1. Fetch from Payload API
    // limit=1000: Get everything (Payload defaults to 10)
    // depth=1: Populate the 'city' relationship so we get the city name
    const response = await fetch(`${PAYLOAD_URL}/api/rooms?limit=1000&depth=1`);

    if (!response.ok) {
      throw new Error(`Failed to fetch from Payload: ${response.statusText}`);
    }

    const json = await response.json();
    const payloadRooms = json.docs;

    // 2. Map Payload Data -> Frontend "ComedyEvent" Structure
    // This tricks the rest of your app into thinking it's still reading the spreadsheet
    const events: ComedyEvent[] = payloadRooms.map((room: any) => {

      // Extract Coordinates
      let lat = undefined;
      let lng = undefined;
      if (room.location && Array.isArray(room.location)) {
        lng = room.location[0]?.toString(); // Payload stores [Lng, Lat]
        lat = room.location[1]?.toString();
      }

      // Format Time (Payload is full ISO date, Frontend wants "7:30 PM" usually)
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
        Day: room.day, // Matches 'Monday', 'Tuesday' etc.
        Neighbourhood: room.city?.name || 'Melbourne', // Use City relationship
        Address: room.venue, // Contains the Maps Link now
        Start: timeStr,
        Frequency: room.frequency,
        Type: room.type,
        'Ticket Price': room.ticketPrice === 0 ? 'Free' : `$${room.ticketPrice}`,
        'Venue (Insta)': '', // Deprecated, mapped to externalLink below
        FB: '', // Payload merged these into externalLink
        Insta: room.externalLink || '',
        'Room Runner (Insta)': room.roomRunners?.map((runner: any) => ({
          name: runner.name,
          url: runner.url
        })) || [],
        Info: extractTextFromLexical(room.info?.root), // Flatten Rich Text
        Latitude: lat,
        Longitude: lng
      };
    });

    console.log(`✅ Loaded ${events.length} rooms from Payload CMS`);
    return events;

  } catch (error) {
    console.error('Error fetching comedy events from Payload:', error);
    return [];
  }
}