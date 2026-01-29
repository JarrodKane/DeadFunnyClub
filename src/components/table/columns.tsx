import { TypeBadge } from '@/components/badges/type-badge';
import { RichText } from '@payloadcms/richtext-lexical/react';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Clock, MapPin } from 'lucide-react';
import { type ComedyEvent } from '../../types';
import { DayBadge } from '../badges/day-badge';
import { Button } from '../ui/button';

export const Columns: ColumnDef<ComedyEvent>[] = [
  {
    accessorKey: 'Name',
    header: 'Name',
    size: 200,
    minSize: 100,
    cell: ({ row }) => {
      const name = row.getValue('Name') as string;
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
  {
    accessorKey: 'Type',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 sm:px-4"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <span className="hidden sm:inline">Type</span>
          <span className="sm:hidden">T</span>
          <ArrowUpDown className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      );
    },
    size: 60,
    cell: ({ row }) => {
      const type = row.getValue('Type') as string;
      return <TypeBadge type={type} />;
    },
    filterFn: (row, id, filterValue) => {
      if (!filterValue || (Array.isArray(filterValue) && filterValue.length === 0)) {
        return true;
      }
      const value = row.getValue(id) as string;
      if (Array.isArray(filterValue)) {
        return filterValue.some((filter) => value?.includes(filter));
      }
      return value?.includes(filterValue);
    },
  },
  {
    accessorKey: 'Day',
    size: 70,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8 data-[state=open]:bg-accent"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <span>Day</span>
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => <DayBadge day={row.getValue('Day')} />,
  },
  {
    accessorKey: 'Start',
    size: 70,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8 data-[state=open]:bg-accent"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <Clock className="mr-2 h-3.5 w-3.5" />
          <ArrowUpDown className="h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const start = row.getValue('Start') as string;
      if (!start || start === '???' || start === '—')
        return <span className="text-muted-foreground">—</span>;

      const match = start.match(/^(\d{1,2}):(\d{2})/);
      if (match) {
        const hours = parseInt(match[1], 10);
        const displayHours = hours % 12 || 12;
        const period = hours >= 12 ? 'pm' : 'am';
        return (
          <span className="font-medium whitespace-nowrap">{`${displayHours}:${match[2]}${period}`}</span>
        );
      }
      return <span className="text-xs">{start}</span>;
    },
  },
  {
    accessorKey: 'Frequency',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Freq
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    size: 80,
    cell: ({ row }) => {
      const frequency = row.getValue('Frequency') as string;
      return frequency?.replace(/^\d+\.\s*/, '') || '—';
    },
    filterFn: (row, id, filterValue) => {
      if (!filterValue || (Array.isArray(filterValue) && filterValue.length === 0)) {
        return true;
      }
      const value = row.getValue(id) as string;
      if (Array.isArray(filterValue)) {
        return filterValue.some((filter) => value?.includes(filter));
      }
      return value?.includes(filterValue);
    },
  },
  {
    accessorKey: 'Neighbourhood',
    header: 'Location',
    size: 180,
    cell: ({ row }) => {
      // 1. Try to get the specific Venue Name (e.g. "The Exford")
      // 2. Fallback to the City (e.g. "Melbourne")
      // @ts-expect-error - VenueName is new, might not be in the type def yet
      const venueName = row.original.VenueName;
      const neighbourhood = row.getValue('Neighbourhood') as string;
      const displayName = venueName || neighbourhood || '—';

      const addressLink = row.original.Address;

      return (
        <div className="flex flex-col gap-1">
          {/* Display Venue Name (or City) */}
          <span className="font-medium truncate text-foreground" title={displayName}>
            {displayName}
          </span>

          {/* Map Link */}
          {addressLink && addressLink.startsWith('http') ? (
            <a
              href={addressLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-primary hover:underline w-fit"
            >
              <MapPin className="h-3 w-3" />
              View Map
            </a>
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          )}
        </div>
      );
    },
  },
  {
    id: 'details',
    accessorKey: 'Ticket Price',
    header: 'Details',
    size: 120,
    cell: ({ row }) => {
      const price = row.original['Ticket Price'];
      const runners = row.original['Room Runner (Insta)'];
      return (
        <div className="flex flex-col gap-1 w-[120px]">
          <span className="font-medium break-words">🎟️ {price || '—'}</span>
          {runners && runners.length > 0 && (
            <div className="text-xs text-muted-foreground flex flex-col overflow-hidden">
              <span className="opacity-70">Run by: </span>
              {runners.map((runner, i) => (
                <span key={i} className="break-all overflow-wrap-anywhere">
                  {runner.url ? (
                    <a
                      href={runner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary hover:underline"
                    >
                      {runner.name}
                    </a>
                  ) : (
                    runner.name
                  )}
                </span>
              ))}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'Info',
    header: 'Info',
    cell: ({ row }) => {
      const infoData = row.getValue('Info') as ComedyEvent['Info'] | undefined;

      if (!infoData || !infoData.root || !infoData.root.children) {
        return <span className="text-muted-foreground">—</span>;
      }

      return (
        <div className="whitespace-normal break-words prose prose-sm dark:prose-invert max-w-none">
          <RichText data={infoData} />
        </div>
      );
    },
  },
];