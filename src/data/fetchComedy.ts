import type { ComedyEvent, RoomRunner } from '../types';

// Use the SOURCE spreadsheet ID where the links actually exist
const SPREADSHEET_ID = '1MEXRL83oZ72PONC6k5yhqJb1EkGYADJ3TlMxkmDVaW8';
const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;

interface TextFormatRun {
  startIndex?: number;
  format?: {
    link?: {
      uri?: string;
    };
  };
}

interface CellData {
  hyperlink?: string;
  textFormatRuns?: TextFormatRun[];
}

function parseRoomRunnerWithLinks(value: string, cell?: CellData): RoomRunner[] {
  if (!value || value === '—' || value === '???') return [];

  const runners = value.split(/\n/).filter(r => r.trim());

  // Check if the cell has textFormatRuns (which contains individual link info)
  if (cell?.textFormatRuns && cell.textFormatRuns.length > 0) {
    const links: RoomRunner[] = [];

    for (let i = 0; i < cell.textFormatRuns.length; i++) {
      const run = cell.textFormatRuns[i];
      const nextRun = cell.textFormatRuns[i + 1];

      const startIndex = run.startIndex || 0;
      const endIndex = nextRun ? nextRun.startIndex : value.length;
      const text = value.substring(startIndex, endIndex).trim();

      if (text && text !== '\n') {
        links.push({
          name: text,
          url: run.format?.link?.uri
        });
      }
    }

    return links.filter(link => link.name);
  }

  // Fallback: single hyperlink on the whole cell
  if (cell?.hyperlink) {
    return runners.map(name => ({
      name: name.trim(),
      url: cell.hyperlink
    }));
  }

  // No links
  return runners.map(name => ({
    name: name.trim()
  }));
}

function isValidEventRow(row: string[], headers: string[]): boolean {
  // Must have at least a Name value
  const nameIndex = headers.findIndex(h => h === 'Name');
  if (nameIndex === -1) return false;

  const name = row[nameIndex];
  if (!name || name.trim() === '' || name === '???') return false;

  // Check if row has reasonable amount of data (not just one or two cells filled)
  const filledCells = row.filter(cell => cell && cell.trim() !== '').length;
  if (filledCells < 3) return false;

  return true;
}

export async function fetchMelbourneComedy(): Promise<ComedyEvent[]> {
  // console.log('API_KEY:', API_KEY ? 'exists' : 'missing');

  try {
    // First get spreadsheet metadata to find sheets
    const metadataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?key=${API_KEY}`;
    const metadataResponse = await fetch(metadataUrl);
    const metadata = await metadataResponse.json();

    if (metadata.error) {
      throw new Error(`Cannot access spreadsheet: ${metadata.error.message}`);
    }

    // console.log('Available sheets:', metadata.sheets.map((s: any) => s.properties.title));

    // Look for the Table sheet
    const tableSheet = metadata.sheets.find((s: any) => s.properties.title === 'Table');
    const SHEET_NAME = tableSheet ? 'Table' : metadata.sheets[0].properties.title;

    // console.log('Using sheet:', SHEET_NAME);

    // Get the values
    const valuesUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;
    // console.log('Fetching values...');

    const valuesResponse = await fetch(valuesUrl);
    const valuesData = await valuesResponse.json();

    if (valuesData.error) {
      throw new Error(`Cannot access spreadsheet: ${valuesData.error.message}`);
    }

    console.log('Total rows:', valuesData.values.length);

    // Get the rows we can and their venues for the get-cords.js
    // const rawHeaders = valuesData.values.find((row: string[]) => row.includes('Name')); // Find header row dynamically
    // if (rawHeaders) {
    //   const venueIndex = rawHeaders.indexOf('Venue (Insta)');
    //   const addressIndex = rawHeaders.indexOf('Address');

    //   let dump = "";
    //   // Start from the row after headers
    //   const startRow = valuesData.values.indexOf(rawHeaders) + 1;

    //   valuesData.values.slice(startRow).forEach((row: string[]) => {
    //     const v = row[venueIndex];
    //     const a = row[addressIndex];
    //     // Only log if we have a venue name
    //     if (v) {
    //       dump += `${v}\t${a || ''}\n`;
    //     }
    //   });

    //   console.log("%c👇 COPY DATA BELOW 👇", "color: lime; font-size: 14px; font-weight: bold;");
    //   console.log(dump);
    //   console.log("%c👆 COPY DATA ABOVE 👆", "color: lime; font-size: 14px; font-weight: bold;");
    // }

    // Find the header row (look for "Name" column)
    const headerRowIndex = valuesData.values.findIndex((row: string[]) =>
      row.some(cell => cell === 'Name')
    );

    if (headerRowIndex === -1) {
      throw new Error('Could not find header row with "Name" column');
    }

    // console.log('Header row index:', headerRowIndex);

    const headers = valuesData.values[headerRowIndex];
    // console.log('Headers:', headers);

    // Get metadata with hyperlinks and text formatting
    const rangeUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?includeGridData=true&ranges=${SHEET_NAME}&fields=sheets(data(rowData(values(formattedValue,hyperlink,textFormatRuns))))&key=${API_KEY}`;
    // console.log('Fetching cell metadata...');

    const rangeResponse = await fetch(rangeUrl);
    const rangeData = await rangeResponse.json();

    if (rangeData.error) {
      throw new Error(rangeData.error.message);
    }

    const allRows = valuesData.values.slice(headerRowIndex + 1);
    const cellData = rangeData.sheets?.[0]?.data?.[0]?.rowData?.slice(headerRowIndex + 1) || [];

    // Find where the table ends (look for consecutive empty rows or invalid data)
    let tableEndIndex = allRows.length;
    let emptyRowCount = 0;

    for (let i = 0; i < allRows.length; i++) {
      if (!isValidEventRow(allRows[i], headers)) {
        emptyRowCount++;
        // If we hit 2 consecutive invalid rows, assume table has ended
        if (emptyRowCount >= 2) {
          tableEndIndex = i - 1;
          break;
        }
      } else {
        emptyRowCount = 0;
      }
    }

    // console.log('Table ends at row:', headerRowIndex + tableEndIndex + 1);

    const rows = allRows.slice(0, tableEndIndex);

    const events = rows.map((row: string[], rowIndex: number) => {
      const obj: Record<string, any> = {};

      headers.forEach((header: string, colIndex: number) => {
        const value = row[colIndex] || '';
        const cell = cellData[rowIndex]?.values?.[colIndex];

        if (header && header.trim() === 'Room Runner (Insta)') {
          obj[header.trim()] = parseRoomRunnerWithLinks(value, cell);
        } else if (header) {
          obj[header.trim()] = value;
        }
      });

      return obj as ComedyEvent;
    }).filter((event: ComedyEvent) => event.Name && event.Name.trim() !== '' && event.Name !== '???');

    // console.log('Parsed events:', events.length);
    // console.log('First event:', events[0]);
    return events;
  } catch (error) {
    console.error('Error fetching comedy events:', error);
    throw error;
  }
}