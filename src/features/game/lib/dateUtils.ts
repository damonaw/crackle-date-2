import type { DateDigits } from '../types';

export const getCurrentDateEST = (): Date => {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  const parts = formatter.formatToParts(now);
  const getPart = (type: 'year' | 'month' | 'day') =>
    parts.find((part) => part.type === type)?.value ?? '0';

  const year = Number.parseInt(getPart('year'), 10);
  const month = Number.parseInt(getPart('month'), 10);
  const day = Number.parseInt(getPart('day'), 10);

  return new Date(year, month - 1, day);
};

export const formatDateForGame = (date: Date): string => {
  const month = date.getMonth() + 1; // 0-indexed, so add 1
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month}-${day.toString().padStart(2, '0')}-${year}`;
};

export const getDateDigits = (dateString: string): DateDigits => {
  // Format: M-DD-YYYY (e.g., "9-17-2025")
  const [monthStr, dayStr, yearStr] = dateString.split('-');

  const month = Number.parseInt(monthStr, 10);
  const day = Number.parseInt(dayStr, 10);
  const year = Number.parseInt(yearStr, 10);

  return {
    month,
    day1: Math.floor(day / 10),
    day2: day % 10,
    year1: Math.floor(year / 1000),
    year2: Math.floor((year % 1000) / 100),
    year3: Math.floor((year % 100) / 10),
    year4: year % 10,
  };
};

export const getDigitsArray = (dateDigits: DateDigits): number[] => {
  const digits: number[] = [];

  // Add month digit(s)
  if (dateDigits.month >= 10) {
    digits.push(Math.floor(dateDigits.month / 10));
  }
  digits.push(dateDigits.month % 10);

  // Add day digits (always 2 digits in our format)
  digits.push(dateDigits.day1, dateDigits.day2);

  // Add year digits (always 4 digits)
  digits.push(dateDigits.year1, dateDigits.year2, dateDigits.year3, dateDigits.year4);

  return digits;
};

export const getTodaysGameDate = (): string => {
  const estDate = getCurrentDateEST();
  return formatDateForGame(estDate);
};
