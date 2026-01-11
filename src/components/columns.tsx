import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DayBadge } from "../components/day-badge";
import { type ComedyEvent } from '../types';
import { CellType } from './cell-type';
import { Button } from "./ui/button";

export const Columns: ColumnDef<ComedyEvent>[] = [
  {
    accessorKey: "Name",
    header: "Name",
    size: 200,
    cell: ({ row }) => {
      const name = row.getValue("Name") as string;
      const insta = row.original.Insta;

      if (insta) {
        return (
          <a
            href={insta}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-normal break-words text-primary hover:underline"
          >
            {name || '—'}
          </a>
        );
      }

      return (
        <div className="whitespace-normal break-words">
          {name || '—'}
        </div>
      );
    },
  },
  {
    accessorKey: "Day",
    header: "Day",
    cell: ({ row }) => <DayBadge day={row.getValue("Day")} />,
  },
  {
    accessorKey: "Frequency",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Frequency
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    size: 120,
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
    accessorKey: "Neighbourhood",
    header: "Neighbourhood",
    size: 150,
  },
  {
    accessorKey: "Start",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Start
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    size: 100,
    cell: ({ row }) => {
      const start = row.getValue("Start") as string;

      if (!start || start === '???' || start === '—') {
        return '—';
      }

      // Try to parse 24hr format (e.g., "19:30" or "7:30 PM")
      const match = start.match(/^(\d{1,2}):(\d{2})/);
      if (match) {
        const hours = parseInt(match[1], 10);
        const minutes = match[2];
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours}:${minutes} ${period}`;
      }

      return start;
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
    accessorKey: "Ticket Price",
    header: "Price",
    size: 100,
    cell: ({ row }) => (
      <div className="whitespace-normal break-words">
        {row.getValue("Ticket Price") || '—'}
      </div>
    ),
  },
  {
    accessorKey: "Room Runner (Insta)",
    header: "Room Runners",
    size: 150,
    cell: ({ row }) => {
      const runners = row.getValue("Room Runner (Insta)") as { name: string; url?: string }[];

      if (!runners || runners.length === 0) {
        return '—';
      }

      return (
        <div className="whitespace-normal break-words space-y-1">
          {runners.map((runner, index) => (
            runner.url ? (
              <a
                key={index}
                href={runner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline block"
              >
                {runner.name}
              </a>
            ) : (
              <div key={index}>{runner.name}</div>
            )
          ))}
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