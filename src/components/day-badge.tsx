import { Badge } from "./ui/badge";

const DAY_COLORS = {
  Monday: 'bg-blue-100 text-blue-800 border-blue-200',
  Tuesday: 'bg-purple-100 text-purple-800 border-purple-200',
  Wednesday: 'bg-pink-100 text-pink-800 border-pink-200',
  Thursday: 'bg-orange-100 text-orange-800 border-orange-200',
  Friday: 'bg-green-100 text-green-800 border-green-200',
  Saturday: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Sunday: 'bg-red-100 text-red-800 border-red-200',
  Other: 'bg-gray-100 text-gray-800 border-gray-200',
} as const;

export type DayOfWeek = keyof typeof DAY_COLORS;

interface DayBadgeProps {
  day: string;
}

export const DayBadge = ({ day }: DayBadgeProps) => {
  // Remove the number prefix (e.g., "6.Saturday" -> "Saturday")
  const dayName = day.includes('.') ? day.split('.')[1] : day;
  const colorClass = DAY_COLORS[dayName as DayOfWeek] || DAY_COLORS.Other;

  return (
    <Badge variant="outline" className={colorClass}>
      {dayName}
    </Badge>
  );
};