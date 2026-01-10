import { type DayOfWeek } from './day';
import { type Frequency } from './frequency';
import { type ShowType } from './show-type';

export interface ComedyEvent {
  Name: string;
  Day: DayOfWeek;
  Neighbourhood: string;
  Start: string;
  Frequency: Frequency;
  Type: ShowType;
  'Ticket Price': string;
  'Venue (Insta)': string;
  FB: string;
  Insta: string;
  'Room Runner (Insta)': string;
  Info: string;
}