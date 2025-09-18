import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  useTheme,
  alpha,
  Snackbar,
} from '@mui/material';
import { Backspace, Close, DarkMode, LightMode } from '@mui/icons-material';
import { useGameStore } from '../stores/gameStore';
import { getDateDigits, getDigitsArray } from '../utils/dateUtils';
import { validateEquationInput, getInputHint } from '../utils/inputValidator';
import { validateEquation, type ValidationResult } from '../utils/mathValidator';
import { calculateScore, getScoreDescription } from '../utils/scoring';

interface NYTGameCardProps {
  toggleDarkMode?: () => void;
}

const NYTGameCard: React.FC<NYTGameCardProps> = ({ toggleDarkMode }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const {
    currentDate,
    equation,
    setEquation,
    setValid,
    addSolution,
    score,
    streak,
    solutions
  } = useGameStore();

  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const dateDigits = getDateDigits(currentDate);
  const digitsArray = getDigitsArray(dateDigits);

  // NYT-style colors
  const colors = {
    text: isDarkMode ? '#FFFFFF' : '#121213',
    textLight: isDarkMode ? '#818384' : '#787C7E',
    border: isDarkMode ? '#3A3A3C' : '#D3D6DA',
    borderLight: isDarkMode ? '#3A3A3C' : '#E4E4E7',
    success: '#6AAA64',
    warning: '#C9B458',
    error: '#787C7E',
    background: isDarkMode ? '#121213' : '#FFFFFF',
    surfaceLight: isDarkMode ? '#1A1A1B' : '#F7F7F7',
    hover: isDarkMode ? '#2C2C2E' : '#F0F0F0',
    keyBackground: isDarkMode ? '#818384' : '#D3D6DA',
    keyBackgroundHover: isDarkMode ? '#565758' : '#C5C8CE',
  };

  const addToEquation = (value: string) => {
    const validation = validateEquationInput(equation, value, currentDate);
    if (validation.isValid) {
      setEquation(equation + value);
    } else {
      if (/^\d$/.test(value)) {
        setSnackbarMessage(getInputHint(equation, currentDate));
        setSnackbarOpen(true);
      }
    }
  };

  const clearEquation = () => {
    setEquation('');
    setValidationResult(null);
  };

  const removeLastChar = () => {
    setEquation(equation.slice(0, -1));
  };

  const validateEquationHandler = () => {
    if (!equation) {
      setSnackbarMessage('Please build an equation first');
      setSnackbarOpen(true);
      return;
    }

    const result = validateEquation(equation, currentDate);
    setValidationResult(result);
    setValid(result.isValid);

    if (result.isValid) {
      const scoreValue = calculateScore(result);
      const description = getScoreDescription(scoreValue, result.complexity);
      addSolution(equation, scoreValue);
      setSnackbarMessage('🎉 ' + description);
      setSnackbarOpen(true);
    } else {
      setSnackbarMessage(result.error || 'Invalid equation');
      setSnackbarOpen(true);
    }
  };


  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: 'auto',
        px: 2,
        py: 3,
        backgroundColor: colors.background,
        minHeight: '100vh',
      }}
    >
      {/* Header - NYT Style */}
      <Box sx={{ position: 'relative', mb: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"NYT-Franklin", "Helvetica Neue", Arial, sans-serif',
              fontWeight: 700,
              letterSpacing: '-0.01em',
              color: colors.text,
              mb: 0.5,
            }}
          >
            Equation Builder
          </Typography>
          <Typography
            sx={{
              fontSize: '14px',
              color: colors.textLight,
              fontWeight: 400,
            }}
          >
            {currentDate}
          </Typography>
        </Box>
        {toggleDarkMode && (
          <IconButton
            onClick={toggleDarkMode}
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              color: colors.text,
            }}
            aria-label="toggle theme"
          >
            {isDarkMode ? <LightMode /> : <DarkMode />}
          </IconButton>
        )}
      </Box>

      {/* Stats Bar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 4,
          mb: 3,
          pb: 2,
          borderBottom: `1px solid ${colors.borderLight}`,
        }}
      >
        <Box textAlign="center">
          <Typography sx={{ fontSize: '20px', fontWeight: 600, color: colors.text }}>
            {solutions.length}
          </Typography>
          <Typography sx={{ fontSize: '12px', color: colors.textLight, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Solved
          </Typography>
        </Box>
        <Box textAlign="center">
          <Typography sx={{ fontSize: '20px', fontWeight: 600, color: colors.text }}>
            {score}
          </Typography>
          <Typography sx={{ fontSize: '12px', color: colors.textLight, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Score
          </Typography>
        </Box>
        <Box textAlign="center">
          <Typography sx={{ fontSize: '20px', fontWeight: 600, color: colors.text }}>
            {streak}
          </Typography>
          <Typography sx={{ fontSize: '12px', color: colors.textLight, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Streak
          </Typography>
        </Box>
      </Box>

      {/* Required Digits Display */}
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontSize: '11px',
            fontWeight: 600,
            color: colors.textLight,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            mb: 1,
            textAlign: 'center',
          }}
        >
          Use these digits in order
        </Typography>
        <Box display="flex" justifyContent="center" gap={1}>
          {digitsArray.map((digit, index) => {
            const usedDigits: number[] = [];
            const digitMatches = equation.match(/\d/g);
            if (digitMatches) {
              usedDigits.push(...digitMatches.map(d => parseInt(d)));
            }

            const nextExpectedIndex = usedDigits.length;
            const isThisPositionNext = index === nextExpectedIndex;
            const validation = validateEquationInput(equation, digit.toString(), currentDate);
            const isAllowed = validation.isValid && isThisPositionNext;
            const isUsed = index < nextExpectedIndex;

            return (
              <Box
                key={index}
                onClick={() => isAllowed && addToEquation(digit.toString())}
                sx={{
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `2px solid ${
                    isUsed ? colors.success :
                    isAllowed ? colors.text :
                    colors.border
                  }`,
                  borderRadius: '4px',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: isUsed ? colors.success : colors.text,
                  backgroundColor: isUsed ? alpha(colors.success, 0.1) :
                                   isAllowed ? colors.hover :
                                   'transparent',
                  cursor: isAllowed ? 'pointer' : 'default',
                  opacity: !isUsed && !isAllowed ? 0.4 : 1,
                  transition: 'all 0.15s ease',
                  '&:hover': isAllowed ? {
                    backgroundColor: colors.hover,
                    transform: 'scale(1.05)',
                  } : {},
                }}
              >
                {digit}
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Equation Display */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            border: `2px solid ${colors.text}`,
            borderRadius: '4px',
            p: 2,
            minHeight: 56,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: colors.background,
            position: 'relative',
          }}
        >
          <Typography
            sx={{
              fontSize: '24px',
              fontWeight: 600,
              fontFamily: 'monospace',
              color: colors.text,
              flexGrow: 1,
              minHeight: '1.5em',
            }}
          >
            {equation || (
              <span style={{ color: colors.textLight, fontSize: '16px' }}>
                Start with {digitsArray[0]}...
              </span>
            )}
          </Typography>
          {equation && (
            <IconButton
              onClick={removeLastChar}
              size="small"
              sx={{
                color: colors.text,
                '&:hover': {
                  backgroundColor: colors.hover,
                },
              }}
            >
              <Backspace fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Keyboard Layout - NYT Style */}
      <Box sx={{ mb: 2 }}>
        {/* Row 1 - Numbers */}
        <Box display="flex" justifyContent="center" gap={0.5} mb={0.5}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((key) => (
            <Button
              key={key}
              onClick={() => addToEquation(key)}
              disabled
              sx={{
                minWidth: 43,
                height: 58,
                fontSize: '20px',
                fontWeight: 600,
                backgroundColor: colors.keyBackground,
                color: colors.textLight,
                border: 'none',
                borderRadius: '4px',
                opacity: 0.5,
                cursor: 'not-allowed',
                '&:hover': {
                  backgroundColor: colors.keyBackground,
                },
                textTransform: 'none',
              }}
            >
              {key}
            </Button>
          ))}
        </Box>

        {/* Row 2 - Basic Operations */}
        <Box display="flex" justifyContent="center" gap={0.5} mb={0.5}>
          {['+', '-', '*', '/', '=', '(', ')', '^', '%', '!'].map((key) => {
            const isDisabled = key === '=' && equation.includes('=');

            return (
              <Button
                key={key}
                onClick={() => addToEquation(key)}
                disabled={isDisabled}
                sx={{
                  minWidth: 43,
                  height: 58,
                  fontSize: '20px',
                  fontWeight: 600,
                  backgroundColor: colors.keyBackground,
                  color: colors.text,
                  border: 'none',
                  borderRadius: '4px',
                  opacity: isDisabled ? 0.5 : 1,
                  '&:hover': {
                    backgroundColor: isDisabled ? colors.keyBackground : colors.keyBackgroundHover,
                  },
                  textTransform: 'none',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                }}
              >
                {key}
              </Button>
            );
          })}
        </Box>

        {/* Row 3 - Special Keys */}
        <Box display="flex" justifyContent="center" gap={0.5} mb={0.5}>
          <Button
            onClick={() => addToEquation('√')}
            sx={{
              minWidth: 43,
              height: 58,
              fontSize: '20px',
              fontWeight: 600,
              backgroundColor: colors.keyBackground,
              color: colors.text,
              border: 'none',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: colors.keyBackgroundHover,
              },
              textTransform: 'none',
            }}
          >
            √
          </Button>
          <Button
            onClick={() => addToEquation('|')}
            sx={{
              minWidth: 43,
              height: 58,
              fontSize: '20px',
              fontWeight: 600,
              backgroundColor: colors.keyBackground,
              color: colors.text,
              border: 'none',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: colors.keyBackgroundHover,
              },
              textTransform: 'none',
            }}
          >
            | |
          </Button>
          <Button
            onClick={() => addToEquation(' ')}
            sx={{
              minWidth: 65.5,
              height: 58,
              fontSize: '14px',
              fontWeight: 600,
              backgroundColor: colors.keyBackground,
              color: colors.text,
              border: 'none',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: colors.keyBackgroundHover,
              },
              textTransform: 'none',
            }}
          >
            space
          </Button>
          <Button
            onClick={clearEquation}
            sx={{
              minWidth: 65.5,
              height: 58,
              fontSize: '14px',
              fontWeight: 600,
              backgroundColor: colors.keyBackground,
              color: colors.text,
              border: 'none',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: colors.keyBackgroundHover,
              },
              textTransform: 'none',
            }}
          >
            Clear
          </Button>
          <Button
            onClick={validateEquationHandler}
            sx={{
              minWidth: 65.5,
              height: 58,
              fontSize: '14px',
              fontWeight: 700,
              backgroundColor: colors.success,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: alpha(colors.success, 0.9),
              },
              textTransform: 'uppercase',
            }}
          >
            Enter
          </Button>
        </Box>
      </Box>

      {/* Help Text */}
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography sx={{ fontSize: '12px', color: colors.textLight }}>
          Type freely • Invalid characters filtered • Press Enter to check
        </Typography>
      </Box>

      {/* Snackbar for messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          '& .MuiSnackbarContent-root': {
            backgroundColor: validationResult?.isValid ? colors.success : colors.error,
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: 500,
            borderRadius: '4px',
          }
        }}
        message={snackbarMessage}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setSnackbarOpen(false)}
          >
            <Close fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
};

export default NYTGameCard;