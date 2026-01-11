import { Badge } from "./ui/badge";

interface CellTypeProps {
  type: string;
}


export function CellType({ type }: CellTypeProps) {
  if (!type || type === '—') {
    return <>—</>;
  }

  const typeLower = type.toLowerCase();

  let variant: 'default' | 'secondary' | 'outline' | 'destructive' = 'outline';
  let className = '';

  if (typeLower.includes('open')) {
    variant = 'outline';
    className = 'border-green-500 text-green-700 dark:text-green-400';
  } else if (typeLower.includes('booked')) {
    variant = 'outline';
    className = 'border-yellow-500 text-yellow-700 dark:text-yellow-400';
  } else if (typeLower.includes('mixed')) {
    variant = 'outline';
    className = 'border-blue-500 text-blue-700 dark:text-blue-400';
  } else {
    variant = 'outline';
    className = 'border-gray-500 text-gray-700 dark:text-gray-400';
  }

  return <Badge variant={variant} className={className}>{type}</Badge>;
}