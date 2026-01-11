import type { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import type { ComedyEvent } from "../types";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { useState } from 'react';

interface DaysSelectProps {
  table: Table<ComedyEvent>;
}

// TODO: Move this into types
const TYPES = ["Open", "Booked", "Mixed"];

export const TypeCheckbox = ({ table }: DaysSelectProps) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const handleTypeToggle = (type: string) => {
    const newSelectedTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];

    setSelectedTypes(newSelectedTypes);

    if (newSelectedTypes.length === 0) {
      table.getColumn("Type")?.setFilterValue("");
    } else {
      table.getColumn("Type")?.setFilterValue(newSelectedTypes);
    }
  };

  const clearTypeFilters = () => {
    setSelectedTypes([]);
    table.getColumn("Type")?.setFilterValue("");
  };

  return (
    <div className="flex items-center gap-2 border rounded-md px-3 py-2 max-w-sm">
      <span className="text-sm text-muted-foreground">Type:</span>
      {TYPES.map((type) => (
        <label key={type} className="flex items-center gap-1 cursor-pointer">
          <Checkbox
            checked={selectedTypes.includes(type)}
            onCheckedChange={() => handleTypeToggle(type)}
          />
          <span className="text-sm">{type}</span>
        </label>
      ))}
      {selectedTypes.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearTypeFilters}
          className="h-6 px-2"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}