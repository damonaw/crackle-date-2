import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Alert,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import { Clear, Backspace, CheckCircle, Info, AutoAwesome } from '@mui/icons-material';
import { useGameStore } from '../stores/gameStore';
import { getDateDigits, getDigitsArray } from '../utils/dateUtils';
import { validateEquationInput, filterInput, getInputHint } from '../utils/inputValidator';
import { validateEquation, type ValidationResult } from '../utils/mathValidator';
import { calculateScore, getScoreDescription } from '../utils/scoring';

const MaterialGameCard: React.FC = () => {
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

  // Material design color scheme
  const colors = {
    primary: isDarkMode ? '#BB86FC' : '#6200EE',
    primaryLight: isDarkMode ? '#E1BEE7' : '#B388FF',
    secondary: isDarkMode ? '#03DAC6' : '#018786',
    surface: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    surfaceVariant: isDarkMode ? '#2C2C2C' : '#F5F5F5',
    onSurface: isDarkMode ? '#E0E0E0' : '#212121',
    onSurfaceVariant: isDarkMode ? '#BDBDBD' : '#757575',
    error: '#CF6679',
    success: isDarkMode ? '#4CAF50' : '#00C853',
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Header Card */}
      <Paper
        elevation={isDarkMode ? 4 : 1}
        sx={{
          p: 2,
          backgroundColor: colors.surface,
          borderRadius: 2,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="subtitle2" color={colors.onSurfaceVariant} gutterBottom>
              Today's Challenge
            </Typography>
            <Typography variant="h5" fontWeight="600" color={colors.onSurface}>
              {currentDate}
            </Typography>
          </Box>

          <Box display="flex" gap={2}>
            <Box textAlign="center">
              <Typography variant="caption" color={colors.onSurfaceVariant}>
                Score
              </Typography>
              <Typography variant="h6" fontWeight="bold" color={colors.primary}>
                {score}
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="caption" color={colors.onSurfaceVariant}>
                Streak
              </Typography>
              <Typography variant="h6" fontWeight="bold" color={colors.secondary}>
                {streak}
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="caption" color={colors.onSurfaceVariant}>
                Solutions
              </Typography>
              <Typography variant="h6" fontWeight="bold" color={colors.onSurface}>
                {solutions.length}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Digit Pills */}
        <Box>
          <Typography variant="body2" color={colors.onSurfaceVariant} mb={1.5}>
            Use these digits in order:
          </Typography>
          <Box display="flex" justifyContent="center" gap={1} flexWrap="wrap">
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
                <Button
                  key={index}
                  onClick={() => isAllowed && addToEquation(digit.toString())}
                  variant={isUsed ? "outlined" : isAllowed ? "contained" : "text"}
                  disabled={isUsed || !isAllowed}
                  sx={{
                    minWidth: 48,
                    height: 48,
                    fontSize: '1.125rem',
                    fontWeight: 'bold',
                    borderRadius: '12px',
                    backgroundColor: isUsed ? colors.surfaceVariant : isAllowed ? colors.primary : 'transparent',
                    color: isUsed ? colors.onSurfaceVariant : isAllowed ? '#FFFFFF' : colors.onSurfaceVariant,
                    borderColor: isUsed ? colors.onSurfaceVariant : 'transparent',
                    opacity: isUsed ? 0.6 : 1,
                    '&:hover': isAllowed ? {
                      backgroundColor: colors.primaryLight,
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[4],
                    } : {},
                    '&.Mui-disabled': {
                      color: isUsed ? colors.onSurfaceVariant : alpha(colors.onSurfaceVariant, 0.4),
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  {digit}
                </Button>
              );
            })}
          </Box>
        </Box>
      </Paper>

      {/* Equation Builder Card */}
      <Paper
        elevation={isDarkMode ? 4 : 1}
        sx={{
          p: 2,
          backgroundColor: colors.surface,
          borderRadius: 2,
        }}
      >
        {/* Hint Alert */}
        {showHint && (
          <Alert
            severity="info"
            icon={<Info />}
            sx={{
              mb: 2,
              backgroundColor: alpha(colors.primary, 0.1),
              color: colors.onSurface,
              '& .MuiAlert-icon': { color: colors.primary }
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
          variant="filled"
          sx={{
            mb: 2,
            '& .MuiFilledInput-root': {
              backgroundColor: colors.surfaceVariant,
              fontSize: '1.25rem',
              fontFamily: 'monospace',
              '&:hover': {
                backgroundColor: alpha(colors.surfaceVariant, 0.8),
              },
              '&.Mui-focused': {
                backgroundColor: colors.surfaceVariant,
              },
            },
            '& .MuiInputLabel-root': {
              color: colors.onSurfaceVariant,
            },
            '& .MuiFormHelperText-root': {
              color: colors.onSurfaceVariant,
            }
          }}
          placeholder={`Start with ${digitsArray[0]}...`}
          helperText="Type freely - invalid characters will be filtered"
        />

        {/* Action Buttons */}
        <Box display="flex" gap={1} mb={2}>
          <Button
            variant="outlined"
            onClick={clearEquation}
            startIcon={<Clear />}
            sx={{
              flex: 1,
              borderColor: colors.onSurfaceVariant,
              color: colors.onSurface,
              '&:hover': {
                borderColor: colors.onSurface,
                backgroundColor: alpha(colors.onSurface, 0.04),
              }
            }}
          >
            Clear
          </Button>
          <Button
            variant="outlined"
            onClick={removeLastChar}
            disabled={!equation}
            sx={{
              minWidth: 56,
              borderColor: colors.onSurfaceVariant,
              color: colors.onSurface,
              '&:hover': {
                borderColor: colors.onSurface,
                backgroundColor: alpha(colors.onSurface, 0.04),
              }
            }}
          >
            <Backspace />
          </Button>
          <Button
            variant="contained"
            onClick={validateEquationHandler}
            startIcon={<AutoAwesome />}
            sx={{
              flex: 1.5,
              backgroundColor: colors.primary,
              '&:hover': {
                backgroundColor: colors.primaryLight,
              }
            }}
          >
            Check
          </Button>
        </Box>

        {/* Validation Message */}
        {validationMessage && (
          <Alert
            severity={isValid ? 'success' : 'error'}
            icon={isValid ? <CheckCircle /> : undefined}
            sx={{
              mb: 2,
              backgroundColor: alpha(isValid ? colors.success : colors.error, 0.1),
              color: colors.onSurface,
              '& .MuiAlert-icon': {
                color: isValid ? colors.success : colors.error
              }
            }}
          >
            {validationMessage}
            {validationResult && isValid && (
              <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                Complexity: {validationResult.complexity}
              </Typography>
            )}
          </Alert>
        )}

        {/* Operator Groups */}
        <Box>
          {/* Basic Operators */}
          <Typography variant="caption" color={colors.onSurfaceVariant} sx={{ fontWeight: 500 }}>
            BASIC
          </Typography>
          <Box display="flex" gap={0.5} mb={2} mt={0.5} flexWrap="wrap">
            {['+', '-', '*', '/', '='].map((op) => {
              const isEquals = op === '=';
              const isDisabled = isEquals && equation.includes('=');

              return (
                <Chip
                  key={op}
                  label={op}
                  onClick={() => addToEquation(op)}
                  disabled={isDisabled}
                  sx={{
                    minWidth: 44,
                    height: 36,
                    fontSize: '1rem',
                    fontWeight: '500',
                    backgroundColor: colors.surfaceVariant,
                    color: isDisabled ? alpha(colors.onSurfaceVariant, 0.4) : colors.onSurface,
                    '&:hover': {
                      backgroundColor: isDisabled ? colors.surfaceVariant : alpha(colors.primary, 0.1),
                      color: isDisabled ? alpha(colors.onSurfaceVariant, 0.4) : colors.primary,
                    },
                    '& .MuiChip-label': { px: 1.5 },
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                  }}
                />
              );
            })}
          </Box>

          {/* Advanced Operators */}
          <Typography variant="caption" color={colors.onSurfaceVariant} sx={{ fontWeight: 500 }}>
            ADVANCED
          </Typography>
          <Box display="flex" gap={0.5} mb={2} mt={0.5} flexWrap="wrap">
            {['^', '√', '!', '%', '|'].map((op) => (
              <Chip
                key={op}
                label={op}
                onClick={() => addToEquation(op)}
                sx={{
                  minWidth: 44,
                  height: 36,
                  fontSize: '1rem',
                  fontWeight: '500',
                  backgroundColor: colors.surfaceVariant,
                  color: colors.onSurface,
                  '&:hover': {
                    backgroundColor: alpha(colors.secondary, 0.1),
                    color: colors.secondary,
                  },
                  '& .MuiChip-label': { px: 1.5 },
                }}
                title={
                  op === '^' ? 'Power' :
                  op === '√' ? 'Square Root' :
                  op === '!' ? 'Factorial' :
                  op === '%' ? 'Modulo' :
                  'Absolute Value'
                }
              />
            ))}
          </Box>

          {/* Grouping */}
          <Typography variant="caption" color={colors.onSurfaceVariant} sx={{ fontWeight: 500 }}>
            GROUPING
          </Typography>
          <Box display="flex" gap={0.5} mt={0.5} flexWrap="wrap">
            {['(', ')', ' '].map((op) => (
              <Chip
                key={op}
                label={op === ' ' ? 'space' : op}
                onClick={() => addToEquation(op)}
                sx={{
                  minWidth: 44,
                  height: 36,
                  fontSize: op === ' ' ? '0.75rem' : '1rem',
                  fontWeight: '500',
                  backgroundColor: colors.surfaceVariant,
                  color: colors.onSurface,
                  '&:hover': {
                    backgroundColor: alpha(colors.onSurface, 0.08),
                  },
                  '& .MuiChip-label': { px: 1.5 },
                }}
              />
            ))}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default MaterialGameCard;