import { useNavigate } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import type { ComedyEvent } from "../types";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface NeighbourhoodSelectProps {
  events: ComedyEvent[];
}

export function NeighbourhoodSelect({ events }: NeighbourhoodSelectProps) {
  const navigate = useNavigate();

  // Get unique neighbourhoods from events
  const neighbourhoods = Array.from(
    new Set(events.map((event) => event.Neighbourhood).filter(Boolean))
  ).sort();

  const handleNeighbourhoodClick = (neighbourhood: string) => {
    navigate({ to: `/melbourne/${neighbourhood.toLowerCase().replace(/\s+/g, '-')}` });
  };

  return (
    <div>
      <DropdownMenu >
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <MapPin className="h-4 w-4" />
            Neighbourhoods
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="max-h-[400px] overflow-y-auto">
          {neighbourhoods.map((neighbourhood) => (
            <DropdownMenuItem
              key={neighbourhood}
              onClick={() => handleNeighbourhoodClick(neighbourhood)}
              className="cursor-pointer"
            >
              {neighbourhood}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

  );
}