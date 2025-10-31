import { useCallback } from 'react';
import { formatDateForGame, parseGameDate } from '../lib/dateUtils';
import './date-picker.css';

interface DatePickerProps {
  currentDate: string;
  minDate?: string;
  maxDate?: string;
  onDateSelect: (date: string) => void;
}

export default function DatePicker({
  currentDate,
  minDate,
  maxDate,
  onDateSelect,
}: DatePickerProps) {
  // Convert game date format (M-DD-YYYY) to ISO format (YYYY-MM-DD)
  const gameToISO = (gameDate: string): string => {
    const date = parseGameDate(gameDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Convert ISO format (YYYY-MM-DD) to game date format (M-DD-YYYY)
  const isoToGame = (isoDate: string): string => {
    const [year, month, day] = isoDate.split('-');
    return formatDateForGame(
      new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10))
    );
  };

  const handleDateChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const isoDate = event.target.value;
      if (isoDate) {
        const gameDate = isoToGame(isoDate);
        onDateSelect(gameDate);
      }
    },
    [onDateSelect]
  );

  const currentISODate = gameToISO(currentDate);
  const minISODate = minDate ? gameToISO(minDate) : undefined;
  const maxISODate = maxDate ? gameToISO(maxDate) : undefined;

  return (
    <div className="date-picker">
      <input
        type="date"
        value={currentISODate}
        min={minISODate}
        max={maxISODate}
        onChange={handleDateChange}
        className="date-picker-input"
        aria-label="Select puzzle date"
      />
    </div>
  );
}
