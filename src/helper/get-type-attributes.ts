import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface TypeAttributes {
  abbreviation: string;
  badgeClass: string;
  pin: {
    background: string;
    borderColor: string;
    glyphColor: string;
  };
}

export function getTypeAttributes(type: string = ''): TypeAttributes {
  const t = type.toLowerCase();

  // 1. OPEN MIC (Green)
  if (t.includes('open')) {
    return {
      abbreviation: 'O',
      badgeClass: 'border-green-500 text-green-700 dark:text-green-400',
      pin: {
        background: '#22c55e', // green-500
        borderColor: '#15803d', // green-700
        glyphColor: '#ffffff',
      },
    };
  }

  // 2. MIXED (Blue)
  if (t.includes('mixed')) {
    return {
      abbreviation: 'M',
      badgeClass: 'border-blue-500 text-blue-700 dark:text-blue-400',
      pin: {
        background: '#3b82f6', // blue-500
        borderColor: '#1d4ed8', // blue-700
        glyphColor: '#ffffff',
      },
    };
  }

  // 3. CURATED / PRO (Dark Orange / Red-Orange)
  if (t.includes('curated') || t.includes('pro')) {
    return {
      abbreviation: 'C',
      badgeClass: 'border-orange-600 text-orange-800 dark:text-orange-400',
      pin: {
        background: '#ea580c', // orange-600
        borderColor: '#7c2d12', // orange-900
        glyphColor: '#ffffff',
      },
    };
  }

  // 4. BOOKED (Orange)
  if (t.includes('booked')) {
    return {
      abbreviation: 'B',
      badgeClass: 'border-orange-500 text-orange-700 dark:text-orange-400',
      pin: {
        background: '#f97316', // orange-500
        borderColor: '#c2410c', // orange-700
        glyphColor: '#ffffff',
      },
    };
  }

  // 5. DEFAULT (Grey)
  return {
    abbreviation: '—',
    badgeClass: 'border-gray-500 text-gray-700 dark:text-gray-400',
    pin: {
      background: '#9ca3af', // gray-400
      borderColor: '#4b5563', // gray-600
      glyphColor: '#ffffff',
    },
  };
}
