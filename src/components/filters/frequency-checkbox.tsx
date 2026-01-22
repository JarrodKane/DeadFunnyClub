import type { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import type { ComedyEvent } from "../../types";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";

interface FrequencyCheckboxProps {
  table: Table<ComedyEvent>;
  selectedFrequencies: string[];
  setSelectedFrequencies: (frequencies: string[]) => void;
}

// TODO: Move this into types
const FREQUENCY = ["Weekly", "Fortnightly", "Monthly", "Bi-Monthly", "Irregular", "???"];

export const FrequencyCheckbox = ({ table, selectedFrequencies, setSelectedFrequencies }: FrequencyCheckboxProps) => {
  const handleFrequencyToggle = (frequency: string) => {
    const newSelectedFrequencies = selectedFrequencies.includes(frequency)
      ? selectedFrequencies.filter(f => f !== frequency)
      : [...selectedFrequencies, frequency];

    setSelectedFrequencies(newSelectedFrequencies);

    if (newSelectedFrequencies.length === 0) {
      table.getColumn("Frequency")?.setFilterValue("");
    } else {
      table.getColumn("Frequency")?.setFilterValue(newSelectedFrequencies);
    }
  };

  const clearFrequencyFilters = () => {
    setSelectedFrequencies([]);
    table.getColumn("Frequency")?.setFilterValue("");
  };

  return (
    <div className="flex flex-wrap items-center gap-2 border rounded-md px-3 py-2">
      <span className="text-sm text-muted-foreground whitespace-nowrap">Frequency:</span>
      {FREQUENCY.map((frequency) => (
        <label key={frequency} className="flex items-center gap-1 cursor-pointer">
          <Checkbox
            checked={selectedFrequencies.includes(frequency)}
            onCheckedChange={() => handleFrequencyToggle(frequency)}
          />
          <span className="text-sm whitespace-nowrap">{frequency}</span>
        </label>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={clearFrequencyFilters}
        className="h-6 px-2 ml-auto"
        disabled={selectedFrequencies.length === 0}
        style={{ visibility: selectedFrequencies.length === 0 ? 'hidden' : 'visible' }}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  )
}