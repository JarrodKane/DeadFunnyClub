import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnSizingState
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Map, X } from "lucide-react"; // Import Icons
import { type ComedyEvent } from '../types';
import { ColumnDropdowns } from './column-dropdown';
import { Columns } from './columns';
import { DaysSelect } from './days-select';
import { FilterModal } from './filter-modal';
import { FrequencyCheckbox } from './frequency-checkbox';
import { TypeCheckbox } from './type-checkbox';
import { VenueMap } from './venue-map'; // Import the Map
import { Input } from "./ui/input";
import {
  Table as ShadTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button"; // Assuming you have a Button component

interface TableProps {
  data: ComedyEvent[];
  selectedDays: string[];
  setSelectedDays: (days: string[]) => void;
  selectedFrequencies: string[];
  setSelectedFrequencies: (frequencies: string[]) => void;
  selectedTypes: string[];
  setSelectedTypes: (types: string[]) => void;
}

export function Table({
  data,
  selectedDays,
  setSelectedDays,
  selectedFrequencies,
  setSelectedFrequencies,
  selectedTypes,
  setSelectedTypes
}: TableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({
    Name: window.innerWidth < 640 ? 100 : 200,
  });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const [showMap, setShowMap] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setColumnSizing({
        Name: window.innerWidth < 640 ? 100 : 200,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const table = useReactTable({
    data,
    columns: Columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnSizingChange: setColumnSizing,
    onColumnVisibilityChange: setColumnVisibility,
    columnResizeMode: "onChange",
    state: {
      sorting,
      columnFilters,
      columnSizing,
      columnVisibility,
    },
  });

  if (data.length === 0) {
    return <p className="text-muted-foreground">No data available</p>;
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <Input
            placeholder="Filter by name..."
            value={(table.getColumn("Name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("Name")?.setFilterValue(event.target.value)
            }
            className="flex-1 min-w-[150px] sm:max-w-sm"
          />
          <div className="flex items-center gap-2">
            <DaysSelect
              table={table}
              selectedDays={selectedDays}
              setSelectedDays={setSelectedDays}
            />
            <Button
              variant="outline"
              onClick={() => setShowMap(true)}
              className="gap-2 hidden sm:flex cursor-pointer"
            >
              <Map className="h-4 w-4" />
              Show Map
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowMap(true)}
              className="sm:hidden"
            >
              <Map className="h-4 w-4" />
            </Button>
            <ColumnDropdowns
              table={table}
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
      <div className="w-full overflow-x-auto rounded-md border">
        <ShadTable style={{ width: '100%', minWidth: table.getTotalSize() }}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="relative"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    <div
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className={`absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none bg-border opacity-0 hover:opacity-100 ${header.column.getIsResizing() ? 'opacity-100 bg-primary' : ''
                        }`}
                    />
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={Columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </ShadTable>
      </div>
      {showMap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl h-[80vh] rounded-xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between  bg-background   px-4 py-3 border-b  z-10">
              <h3 className="font-bold text-lg">Map View ({data.length} shows)</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowMap(false)} className="cursor-pointer">
                <X className="h-5 w-5 cursor-pointer" />
              </Button>
            </div>
            <div className="flex-1 w-full relative">
              <VenueMap events={data} />
            </div>
          </div>
        </div>
      )}
    </div >
  );
}