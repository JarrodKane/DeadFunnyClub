import type { Table } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import type { ComedyEvent } from "../../types";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const COLUMN_LABELS: Record<string, string> = {
  name: "Name",
  day: "Day",
  frequency: "Frequency",
  location: "Location",
  start: "Start Time",
  type: "Show Type",
  details: "Details",
  info: "Info",
};


interface ColumnDropdownsProps {
  table: Table<ComedyEvent>;
  // selectedDays: string[];
  // setSelectedDays: (days: string[]) => void;
}


export const ColumnDropdowns = ({ table }: ColumnDropdownsProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" className="ml-auto">
        Columns <ChevronDown className="ml-2 h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuCheckboxItem
        checked={table.getAllColumns().filter(c => c.getCanHide()).every(c => c.getIsVisible())}
        onCheckedChange={(value) => {
          table.getAllColumns().filter(c => c.getCanHide()).forEach(c => c.toggleVisibility(!!value));
        }}
        className="font-bold"
      >
        Select All
      </DropdownMenuCheckboxItem>
      {table
        .getAllColumns()
        .filter((column) => column.getCanHide())
        .map((column) => {
          return (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={column.getIsVisible()}
              onCheckedChange={(value) =>
                column.toggleVisibility(!!value)
              }
            >
              {COLUMN_LABELS[column.id] || column.id}
            </DropdownMenuCheckboxItem>
          )
        })}
    </DropdownMenuContent>
  </DropdownMenu>
);