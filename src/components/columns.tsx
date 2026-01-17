import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Clock, MapPin } from "lucide-react";
import { DayBadge } from "../components/day-badge";
import { type ComedyEvent } from '../types';
import { CellType } from './cell-type';
import { Button } from "./ui/button";

export const Columns: ColumnDef<ComedyEvent>[] = [
  {
    accessorKey: "Name",
    header: "Name",
    size: 200,
    minSize: 100,
    cell: ({ row }) => {
      const name = row.getValue("Name") as string;
      const insta = row.original.Insta;

      if (insta) {
        return (
          <a
            href={insta}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-normal break-words text-primary hover:underline max-w-[100px] sm:max-w-[200px]"
          >
            {name || '—'}
          </a>
        );
      }

      return (
        <div className="whitespace-normal break-words max-w-[100px] sm:max-w-[200px]">
          {name || '—'}
        </div>
      );
    },
  },

  // ... inside your Columns array

  {
    accessorKey: "Day",
    // 1. Force a strict small width
    size: 70,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          // 2. Use size="sm" and custom padding to squeeze the header
          size="sm"
          className="-ml-3 h-8 data-[state=open]:bg-accent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span>Day</span>
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => <DayBadge day={row.getValue("Day")} />,
  },
  {
    accessorKey: "Start",
    size: 70,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8 data-[state=open]:bg-accent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <Clock className="mr-2 h-3.5 w-3.5" />
          <ArrowUpDown className="h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const start = row.getValue("Start") as string;
      if (!start || start === '???' || start === '—') return <span className="text-muted-foreground">—</span>;

      const match = start.match(/^(\d{1,2}):(\d{2})/);
      if (match) {
        const hours = parseInt(match[1], 10);
        const displayHours = hours % 12 || 12;
        // The 'p' or 'a' is enough context, no need for " PM"
        const period = hours >= 12 ? 'pm' : 'am';
        return <span className="font-medium whitespace-nowrap">{`${displayHours}:${match[2]}${period}`}</span>;
      }
      return <span className="text-xs">{start}</span>;
    },
  },
  {
    accessorKey: "Frequency",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Freq
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    size: 80,
    cell: ({ row }) => {
      const frequency = row.getValue("Frequency") as string;
      return frequency?.replace(/^\d+\.\s*/, '') || '—';
    },
    filterFn: (row, id, filterValue) => {
      if (!filterValue || (Array.isArray(filterValue) && filterValue.length === 0)) {
        return true;
      }
      const value = row.getValue(id) as string;
      if (Array.isArray(filterValue)) {
        return filterValue.some(filter => value?.includes(filter));
      }
      return value?.includes(filterValue);
    },
  },
  {
    id: 'location',
    accessorKey: "Neighbourhood",
    header: "Location",
    size: 180,
    cell: ({ row }) => {
      const neighbourhood = row.getValue("Neighbourhood") as string;
      const address = row.original.Address;
      const venue = row.original["Venue (Insta)"];

      // Clean venue logic
      let venueDisplay = venue;
      let venueLink = null;
      if (venue?.startsWith('http')) {
        venueDisplay = venue.replace(/^https?:\/\/(www\.)?instagram\.com\//, '@');
        venueLink = venue;
      }

      return (
        <div className="flex flex-col gap-1">
          {venueLink ? (
            <a href={venueLink} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline truncate">
              {venueDisplay}
            </a>
          ) : (
            <span className="font-medium truncate">{venueDisplay || '—'}</span>
          )}

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{neighbourhood}</span>
            {address && (
              <a href={address} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                (Map)
              </a>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "Type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    size: 120,
    cell: ({ row }) => {
      const type = row.getValue("Type") as string;
      return <CellType type={type} />;
    },
    filterFn: (row, id, filterValue) => {
      if (!filterValue || (Array.isArray(filterValue) && filterValue.length === 0)) {
        return true;
      }
      const value = row.getValue(id) as string;
      if (Array.isArray(filterValue)) {
        return filterValue.some(filter => value?.includes(filter));
      }
      return value?.includes(filterValue);
    },
  },
  {
    id: "details",
    accessorKey: "Ticket Price",
    header: "Details",
    size: 120,
    cell: ({ row }) => {
      const price = row.original["Ticket Price"]; // Changed from row.getValue("Ticket Price")
      const runners = row.original["Room Runner (Insta)"];

      return (
        <div className="flex flex-col gap-1 w-[120px]">
          <span className="font-medium break-words">🎟️ {price || '—'}</span>
          {runners && runners.length > 0 && (
            <div className="text-xs text-muted-foreground flex flex-col overflow-hidden">
              <span className="opacity-70">Run by: </span>
              {runners.map((runner, i) => (
                <span key={i} className="break-all overflow-wrap-anywhere">
                  {runner.url ? (
                    <a href={runner.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline">
                      {runner.name}
                    </a>
                  ) : runner.name}
                </span>
              ))}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "Info",
    header: "Info",
    size: 300,
    minSize: 200,
    cell: ({ row }) => (
      <div className="whitespace-normal break-words">
        {row.getValue("Info") || '—'}
      </div>
    ),
  },
];