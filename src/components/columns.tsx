import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Day
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    size: 120,
    cell: ({ row }) => {
      const day = row.getValue("Day") as string;
      return day?.replace(/^\d+\.\s*/, '') || '—';
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
    header: "Start",
    size: 100,
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
    header: "Room Runner",
    size: 150,
    cell: ({ row }) => {
      const insta = row.getValue("Room Runner (Insta)") as string;
      return insta ? (
        <a
          href={insta}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline whitespace-normal break-words inline-block"
        >
          {insta}
        </a>
      ) : '—';
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