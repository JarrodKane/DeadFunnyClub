import type { ComedyEvent } from '../types';

const PUBLISHED_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT_ZzHGQ5ZhUcbI2aghCM4es_4YT5nDQtcBJnpEHkvtUAEb0BrvijEnNjoJZoCYtx62eTSTpyFNZuTB/pub?output=csv';

export async function fetchMelbourneComedy(): Promise<ComedyEvent[]> {
  const response = await fetch(PUBLISHED_CSV_URL);
  const csvText = await response.text();

  const allData = parseCSV(csvText);

  // Filter out invalid rows and log them
  const invalidRows: ComedyEvent[] = [];
  const validData = allData.filter((event, index) => {
    const isValid = event.Name && event.Name.trim() !== '' && event.Name !== '???';
    if (!isValid) {
      console.log(`Invalid row ${index + 2}:`, event); // +2 because of header and 0-index
      invalidRows.push(event);
    }
    return isValid;
  });

  return validData;
}


function parseCSV(csv: string): ComedyEvent[] {
  const lines = csv.split('\n');
  const headers = parseCSVLine(lines[0]);

  return lines.slice(1)
    .filter(line => line.trim())
    .map(line => {
      const values = parseCSVLine(line);
      const obj: Record<string, string> = {};
      headers.forEach((header, i) => {
        obj[header.trim()] = values[i]?.trim() || '';
      });
      return obj as unknown as ComedyEvent;
    });
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  // Push last field
  result.push(current);

  return result;
}