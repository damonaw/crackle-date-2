import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Alert,
  Chip,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import { CalendarToday, Star, TrendingUp, Clear, Calculate, CheckCircle, Info } from '@mui/icons-material';
import { useGameStore } from '../stores/gameStore';
import { getDateDigits, getDigitsArray } from '../utils/dateUtils';
import { validateEquationInput, filterInput, getInputHint } from '../utils/inputValidator';
import { validateEquation, type ValidationResult } from '../utils/mathValidator';
import { calculateScore, getScoreDescription } from '../utils/scoring';

const UnifiedGameCard: React.FC = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const {
    currentDate,
    equation,
    setEquation,
    isValid,
    setValid,
    addSolution,
    score,
    streak,
    solutions
  } = useGameStore();

  const [validationMessage, setValidationMessage] = useState<string>('');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);

  const dateDigits = getDateDigits(currentDate);
  const digitsArray = getDigitsArray(dateDigits);

  const addToEquation = (value: string) => {
    const validation = validateEquationInput(equation, value, currentDate);
    if (validation.isValid) {
      setEquation(equation + value);
      setShowHint(false);
    } else {
      if (/^\d$/.test(value)) {
        setShowHint(true);
        setTimeout(() => setShowHint(false), 4000);
      }
      setValidationMessage(validation.error || 'Invalid input');
      setTimeout(() => setValidationMessage(''), 2000);
    }
  };

  const handleTextFieldChange = (newValue: string) => {
    const filteredValue = filterInput(newValue, '', currentDate);
    setEquation(filteredValue);
  };

  const clearEquation = () => {
    setEquation('');
    setValidationMessage('');
    setValidationResult(null);
    setShowHint(false);
  };

  const removeLastChar = () => {
    setEquation(equation.slice(0, -1));
  };

  const validateEquationHandler = () => {
    if (!equation) {
      setValidationMessage('Please build an equation first');
      setValid(false);
      return;
    }

    const result = validateEquation(equation, currentDate);
    setValidationResult(result);
    setValid(result.isValid);

    if (result.isValid) {
      const score = calculateScore(result);
      const description = getScoreDescription(score, result.complexity);
      setValidationMessage(description);
      addSolution(equation, score);
    } else {
      setValidationMessage(result.error || 'Invalid equation');
    }
  };

  // Dynamic gradients based on theme
  const gradient = isDarkMode
    ? `linear-gradient(145deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`
    : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`;

  const glassEffect = {
    backgroundColor: alpha(theme.palette.background.paper, isDarkMode ? 0.1 : 0.05),
    backdropFilter: 'blur(10px)',
    border: `1px solid ${alpha(theme.palette.common.white, isDarkMode ? 0.1 : 0.2)}`,
  };

  return (
    <Paper
      elevation={isDarkMode ? 8 : 3}
      sx={{
        p: 1.5,
        background: gradient,
        borderRadius: 2,
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDarkMode
            ? 'radial-gradient(circle at top right, rgba(236, 72, 153, 0.1), transparent 50%)'
            : 'radial-gradient(circle at top right, rgba(255, 255, 255, 0.1), transparent 50%)',
          pointerEvents: 'none',
        },
      }}
    >
      {/* Header Section */}
      <Box sx={{ color: 'white', mb: 1.5 }}>
        {/* Date and Stats Row */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <CalendarToday fontSize="small" />
            <Typography variant="h6" fontWeight="bold">
              {currentDate}
            </Typography>
          </Box>

          <Box display="flex" gap={1.5} alignItems="center">
            <Box display="flex" alignItems="center" gap={0.5}>
              <Star fontSize="small" />
              <Typography variant="body2" fontWeight="bold">
                {score}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={0.5}>
              <TrendingUp fontSize="small" />
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
                height: 22
              }}
            />
          </Box>
        </Box>

        {/* Clickable Digits */}
        <Box>
          <Typography variant="body2" mb={0.5} sx={{ opacity: 0.9 }}>
            Use these digits in order:
          </Typography>
          <Box display="flex" justifyContent="center" gap={0.5} flexWrap="wrap">
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

              return (
                <Box
                  key={index}
                  onClick={() => isAllowed && addToEquation(digit.toString())}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 40,
                    height: 32,
                    px: 1,
                    backgroundColor: isAllowed
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 1,
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    cursor: isAllowed ? 'pointer' : 'not-allowed',
                    opacity: isAllowed ? 1 : 0.4,
                    border: isThisPositionNext && validation.isValid
                      ? '2px solid rgba(255, 255, 255, 0.7)'
                      : '1px solid rgba(255, 255, 255, 0.3)',
                    transition: 'all 0.15s ease',
                    '&:hover': isAllowed ? {
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
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
      </Box>

      {/* Main Content Section */}
      <Box sx={{ color: 'white' }}>
        {/* Input Hint */}
        {showHint && (
          <Alert
            severity="info"
            icon={<Info />}
            sx={{
              mb: 1,
              py: 0.5,
              fontSize: '0.85rem',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: 'white',
              '& .MuiAlert-icon': { color: 'white' }
            }}
          >
            {getInputHint(equation, currentDate)}
          </Alert>
        )}

        {/* Equation Input */}
        <TextField
          fullWidth
          label="Your Equation"
          value={equation}
          onChange={(e) => handleTextFieldChange(e.target.value)}
          variant="outlined"
          size="small"
          sx={{
            mb: 1,
            '& .MuiInputLabel-root': { color: alpha(theme.palette.common.white, 0.7) },
            '& .MuiOutlinedInput-root': {
              color: 'white',
              ...glassEffect,
              backgroundColor: alpha(theme.palette.common.white, 0.08),
              '& fieldset': { borderColor: alpha(theme.palette.common.white, 0.3) },
              '&:hover fieldset': { borderColor: alpha(theme.palette.common.white, 0.5) },
              '&.Mui-focused fieldset': { borderColor: alpha(theme.palette.common.white, 0.7) },
            },
            '& .MuiFormHelperText-root': { color: alpha(theme.palette.common.white, 0.7) }
          }}
          placeholder={`Start with digit ${digitsArray[0]}...`}
          helperText="Type freely - invalid characters will be filtered out"
        />

        {/* Action Buttons */}
        <Box display="flex" gap={1} mb={1} justifyContent="space-between">
          <Button
            variant="outlined"
            size="small"
            onClick={clearEquation}
            startIcon={<Clear />}
            sx={{
              minWidth: 80,
              height: 32,
              fontSize: '0.8rem',
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
                backgroundColor: 'rgba(255, 255, 255, 0.15)'
              }
            }}
          >
            Clear
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={removeLastChar}
            disabled={!equation}
            sx={{
              minWidth: 50,
              height: 32,
              fontSize: '0.9rem',
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
                backgroundColor: 'rgba(255, 255, 255, 0.15)'
              },
              '&.Mui-disabled': {
                color: 'rgba(255, 255, 255, 0.2)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                backgroundColor: 'transparent'
              }
            }}
          >
            ⌫
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={validateEquationHandler}
            startIcon={<Calculate />}
            sx={{
              minWidth: 90,
              height: 32,
              fontSize: '0.8rem',
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
              color: 'white',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.35)',
                boxShadow: 'none'
              }
            }}
          >
            Validate
          </Button>
        </Box>

        {/* Validation Message */}
        {validationMessage && (
          <Alert
            severity={isValid ? 'success' : 'warning'}
            icon={isValid ? <CheckCircle /> : undefined}
            sx={{
              mb: 1,
              py: 0.5,
              backgroundColor: isValid ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 193, 7, 0.2)',
              color: 'white',
              '& .MuiAlert-icon': { color: 'white' }
            }}
          >
            {validationMessage}
            {validationResult && isValid && (
              <Typography variant="caption" display="block" sx={{ mt: 0.5, opacity: 0.9 }}>
                Complexity: {validationResult.complexity}
              </Typography>
            )}
          </Alert>
        )}

        <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

        {/* Operators Section */}
        {/* Basic Math */}
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Basic Math:
        </Typography>
        <Box display="flex" gap={0.5} mb={1} flexWrap="wrap">
          {['+', '-', '*', '/', '='].map((symbol) => {
            const isEqualsAlreadyUsed = symbol === '=' && equation.includes('=');
            const isDisabled = isEqualsAlreadyUsed;

            return (
              <Chip
                key={symbol}
                label={symbol}
                onClick={() => addToEquation(symbol)}
                variant="outlined"
                color="default"
                size="small"
                sx={{
                  minWidth: 40,
                  height: 32,
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  opacity: isDisabled ? 0.4 : 1,
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  backgroundColor: isDisabled ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.15)',
                  transition: 'all 0.15s ease',
                  '&:hover': isDisabled ? {} : {
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    borderColor: 'rgba(255, 255, 255, 0.5)'
                  },
                  '& .MuiChip-label': { px: 1 }
                }}
                disabled={isDisabled}
              />
            );
          })}
        </Box>

        {/* Advanced */}
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Advanced:
        </Typography>
        <Box display="flex" gap={0.5} mb={1} flexWrap="wrap">
          {['^', '√', '!', '%', '|'].map((symbol) => (
            <Chip
              key={symbol}
              label={symbol}
              onClick={() => addToEquation(symbol)}
              variant="outlined"
              color="default"
              size="small"
              sx={{
                minWidth: 40,
                height: 32,
                cursor: 'pointer',
                fontSize: '0.9rem',
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                transition: 'all 0.15s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  borderColor: 'rgba(255, 255, 255, 0.5)'
                },
                '& .MuiChip-label': { px: 1 }
              }}
              title={
                symbol === '^' ? 'Power' :
                symbol === '√' ? 'Square Root' :
                symbol === '!' ? 'Factorial' :
                symbol === '%' ? 'Modulo' :
                'Absolute Value'
              }
            />
          ))}
        </Box>

        {/* Grouping */}
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Grouping:
        </Typography>
        <Box display="flex" gap={0.5} flexWrap="wrap">
          {['(', ')', ' '].map((symbol) => (
            <Chip
              key={symbol}
              label={symbol === ' ' ? 'space' : symbol}
              onClick={() => addToEquation(symbol)}
              variant="outlined"
              color="default"
              size="small"
              sx={{
                minWidth: 40,
                height: 32,
                cursor: 'pointer',
                fontSize: symbol === ' ' ? '0.7rem' : '0.9rem',
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                transition: 'all 0.15s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  borderColor: 'rgba(255, 255, 255, 0.5)'
                },
                '& .MuiChip-label': { px: 1 }
              }}
            />
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default UnifiedGameCard;