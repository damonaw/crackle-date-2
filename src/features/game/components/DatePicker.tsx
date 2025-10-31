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
    // Validate date is valid
    if (Number.isNaN(date.getTime())) {
      // Return current date as fallback
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const isoDate = event.target.value;
      if (!isoDate) {
        return;
      }

      // Convert ISO format (YYYY-MM-DD) to game date format (M-DD-YYYY)
      const parts = isoDate.split('-');
      // Validate ISO date format has exactly 3 parts
      if (parts.length !== 3) {
        return;
      }
      const [year, month, day] = parts;
      const yearNum = parseInt(year, 10);
      const monthNum = parseInt(month, 10);
      const dayNum = parseInt(day, 10);
      // Validate all parts are valid numbers
      if (Number.isNaN(yearNum) || Number.isNaN(monthNum) || Number.isNaN(dayNum)) {
        return;
      }

      const gameDate = formatDateForGame(new Date(yearNum, monthNum - 1, dayNum));
      onDateSelect(gameDate);
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
