import { useQuery } from '@tanstack/react-query';
import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnFiltersState,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { Columns } from '../components/table/columns';
import { DaysSelect } from '../components/filters/days-select';
import { FilterModal } from '../components/filters/filter-modal';
import { FrequencyCheckbox } from '../components/filters/frequency-checkbox';
import { TypeCheckbox } from '../components/filters/type-checkbox';
import { Input } from '../components/ui/input';
import { VenueMap } from '../components/map/venue-map';
import { fetchMelbourneComedy } from '../data/fetchComedy';
import { Helmet } from 'react-helmet-async';


export function MapPage() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedFrequencies, setSelectedFrequencies] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // 2. Fetch Data (Same as Melbourne route)
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['melbourne-comedy'],
    queryFn: fetchMelbourneComedy,
    staleTime: 1000 * 60 * 60 * 24,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // 3. Initialize Headless Table
  // We use this ONLY for its filtering logic, not to render a table.
  const table = useReactTable({
    data: events,
    columns: Columns,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // 4. Extract Filtered Data for the Map
  const filteredEvents = table.getFilteredRowModel().rows.map((row) => row.original);

  useEffect(() => {
    document.title = 'Map Search - Melbourne Comedy';
  }, []);

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <>
      <Helmet>
        <title>Comedy Map | Melbourne Stand-up Venues - Dead Funny Club</title>
        <meta
          name="description"
          content="Explore Melbourne's stand-up comedy venues on an interactive map. Filter by day, type, and more with Dead Funny Club."
        />
        <link rel="canonical" href="https://deadfunny.club/melbourne/map" />

        {/* Open Graph */}
        <meta property="og:title" content="Comedy Map | Melbourne Stand-up Venues - Dead Funny Club" />
        <meta property="og:description" content="Explore Melbourne's stand-up comedy venues on an interactive map. Filter by day, type, and more with Dead Funny Club." />
        <meta property="og:url" content="https://deadfunny.club/melbourne/map" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Dead Funny Club" />
        <meta property="og:image" content="https://deadfunny.club/dfc.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Comedy Map | Melbourne Stand-up Venues - Dead Funny Club" />
        <meta name="twitter:description" content="Explore Melbourne's stand-up comedy venues on an interactive map. Filter by day, type, and more with Dead Funny Club." />
        <meta name="twitter:image" content="https://deadfunny.club/dfc.png" />
      </Helmet>
      <div className="flex flex-col min-h-[calc(100vh-64px)]">
        <div className="w-full h-[60vh] sm:h-[65vh] relative bg-gray-100">
          <VenueMap events={filteredEvents} />
          <div className="absolute bottom-4 left-4 z-10 bg-background backdrop-blur px-4 py-2 rounded-md shadow-sm border border-gray-200 text-sm font-medium">
            {filteredEvents.length} venues found
          </div>
        </div>
        <div className="flex-1 bg-background border-t border-border shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.05)] z-20">
          <div className="container max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold tracking-tight">Filter Map</h1>
              <p className="text-muted-foreground">
                Adjust the filters below to update the venues shown on the map.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                <Input
                  placeholder="Filter by name..."
                  value={(table.getColumn('Name')?.getFilterValue() as string) ?? ''}
                  onChange={(event) => table.getColumn('Name')?.setFilterValue(event.target.value)}
                  className="flex-1 sm:max-w-sm"
                />
                <div className="flex items-center gap-2">
                  <DaysSelect
                    table={table}
                    selectedDays={selectedDays}
                    setSelectedDays={setSelectedDays}
                  />
                </div>
              </div>
              <FilterModal>
                <TypeCheckbox
                  table={table}
                  selectedTypes={selectedTypes}
                  setSelectedTypes={setSelectedTypes}
                />
                <FrequencyCheckbox
                  table={table}
                  selectedFrequencies={selectedFrequencies}
                  setSelectedFrequencies={setSelectedFrequencies}
                />
              </FilterModal>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
