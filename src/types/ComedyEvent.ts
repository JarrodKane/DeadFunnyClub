import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';
import { type DayOfWeek } from './day';
import { type Frequency } from './frequency';
import { type ShowType } from './show-type';

export interface RoomRunner {
  name: string;
  url?: string;
}

export interface ComedyEvent {
  id: string;
  Name: string;
  Day: DayOfWeek;
  Neighbourhood: string;
  Address: string;
  Start: string;
  Frequency: Frequency;
  Type: ShowType;
  'Ticket Price': string;
  'Venue (Insta)': string;
  FB: string;
  Insta: string;
  'Room Runner (Insta)': RoomRunner[];
  Info?: SerializedEditorState
  Latitude?: string;
  Longitude?: string;
}