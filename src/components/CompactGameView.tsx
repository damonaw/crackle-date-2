import React from 'react';
import { Box, Paper, Typography, Chip } from '@mui/material';
import { CalendarToday, Star, TrendingUp } from '@mui/icons-material';
import { useGameStore } from '../stores/gameStore';
import { getDateDigits, getDigitsArray } from '../utils/dateUtils';
import { validateEquationInput } from '../utils/inputValidator';

interface CompactGameViewProps {
  addToEquation: (value: string) => void;
  equation: string;
}

const CompactGameView: React.FC<CompactGameViewProps> = ({ addToEquation, equation }) => {
  const { currentDate, score, streak, solutions } = useGameStore();
  const dateDigits = getDateDigits(currentDate);
  const digitsArray = getDigitsArray(dateDigits);

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: 2,
        mb: 2,
      }}
    >
      {/* Header Row */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <CalendarToday fontSize="small" />
          <Typography variant="h6" fontWeight="bold">
            {currentDate}
          </Typography>
        </Box>

        {/* Compact Stats */}
        <Box display="flex" gap={2} alignItems="center">
          <Box display="flex" alignItems="center" gap={0.5}>
            <Star color="inherit" fontSize="small" />
            <Typography variant="body2" fontWeight="bold">
              {score}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            <TrendingUp color="inherit" fontSize="small" />
            <Typography variant="body2" fontWeight="bold">
              {streak}
            </Typography>
          </Box>
          <Chip
            label={solutions.length}
            size="small"
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontSize: '0.75rem',
              height: 24
            }}
          />
        </Box>
      </Box>

      {/* Digits Row */}
      <Box>
        <Typography variant="body2" mb={1} sx={{ opacity: 0.9 }}>
          Use these digits in order:
        </Typography>
        <Box display="flex" justifyContent="center" gap={1} flexWrap="wrap">
          {digitsArray.map((digit, index) => {
            // Get how many digits have been used so far
            const usedDigits: number[] = [];
            const digitMatches = equation.match(/\d/g);
            if (digitMatches) {
              usedDigits.push(...digitMatches.map(d => parseInt(d)));
            }

            // Check if this specific position is the next one expected
            const nextExpectedIndex = usedDigits.length;
            const isThisPositionNext = index === nextExpectedIndex;
            const validation = validateEquationInput(equation, digit.toString(), currentDate);
            const isAllowed = validation.isValid && isThisPositionNext;

            return (
              <Box
                key={index}
                onClick={() => isAllowed && addToEquation(digit.toString())}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  backgroundColor: isAllowed
                    ? 'rgba(255, 255, 255, 0.3)'
                    : 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 1,
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  cursor: isAllowed ? 'pointer' : 'not-allowed',
                  opacity: isAllowed ? 1 : 0.5,
                  transform: isAllowed ? 'scale(1)' : 'scale(0.9)',
                  border: isThisPositionNext && validation.isValid ? '2px solid rgba(255, 255, 255, 0.8)' : '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.2s ease',
                  '&:hover': isAllowed ? {
                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                    transform: 'scale(1.05)',
                  } : {},
                  '&:active': isAllowed ? {
                    transform: 'scale(0.95)',
                  } : {},
                }}
              >
                {digit}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
};

export default CompactGameView;