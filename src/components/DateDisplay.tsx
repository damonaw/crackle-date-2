import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { CalendarToday } from '@mui/icons-material';
import { useGameStore } from '../stores/gameStore';
import { getDateDigits, getDigitsArray } from '../utils/dateUtils';

const DateDisplay: React.FC = () => {
  const currentDate = useGameStore((state) => state.currentDate);
  const dateDigits = getDateDigits(currentDate);
  const digitsArray = getDigitsArray(dateDigits);

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        textAlign: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: 2,
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={2}>
        <CalendarToday />
        <Typography variant="h6" component="h1">
          Today's Puzzle
        </Typography>
      </Box>

      <Typography variant="h4" component="h2" fontWeight="bold" mb={2}>
        {currentDate}
      </Typography>

      <Box display="flex" justifyContent="center" gap={1} flexWrap="wrap">
        <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
          Use these digits in order:
        </Typography>
      </Box>

      <Box display="flex" justifyContent="center" gap={1} mt={1} flexWrap="wrap">
        {digitsArray.map((digit, index) => (
          <Box
            key={index}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 1,
              fontWeight: 'bold',
              fontSize: '1.2rem',
            }}
          >
            {digit}
          </Box>
        ))}
      </Box>

      <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" mt={2}>
        Create a mathematical equation using all digits in order
      </Typography>
    </Paper>
  );
};

export default DateDisplay;