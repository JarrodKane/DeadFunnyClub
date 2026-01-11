import type { Table } from "@tanstack/react-table";
import type { ComedyEvent } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface DaysSelectProps {
  table: Table<ComedyEvent>;
}

export const DaysSelect = ({ table }: DaysSelectProps) => (
  <Select
    value={(table.getColumn("Day")?.getFilterValue() as string) ?? "all"}
    onValueChange={(value) =>
      table.getColumn("Day")?.setFilterValue(value === "all" ? "" : value)
    }
  >
    <SelectTrigger className="max-w-sm">
      <SelectValue placeholder="Filter by day..." />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Days</SelectItem>
      <SelectItem value="Monday">Monday</SelectItem>
      <SelectItem value="Tuesday">Tuesday</SelectItem>
      <SelectItem value="Wednesday">Wednesday</SelectItem>
      <SelectItem value="Thursday">Thursday</SelectItem>
      <SelectItem value="Friday">Friday</SelectItem>
      <SelectItem value="Saturday">Saturday</SelectItem>
      <SelectItem value="Sunday">Sunday</SelectItem>
      <SelectItem value="Other">Other</SelectItem>
    </SelectContent>
  </Select>
)