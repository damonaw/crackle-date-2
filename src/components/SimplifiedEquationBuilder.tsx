import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Alert,
  Chip,
  Grid,
} from '@mui/material';
import { Clear, Calculate, CheckCircle, Info } from '@mui/icons-material';
import { useGameStore } from '../stores/gameStore';
import { getDateDigits, getDigitsArray } from '../utils/dateUtils';
import { validateEquation, type ValidationResult } from '../utils/mathValidator';
import { calculateScore, getScoreDescription } from '../utils/scoring';
import { MATH_OPERATIONS } from '../utils/mathOperations';
import { validateEquationInput, getInputHint, filterInput } from '../utils/inputValidator';

const SimplifiedEquationBuilder: React.FC = () => {
  const { currentDate, equation, setEquation, isValid, setValid, addSolution } = useGameStore();
  const [validationMessage, setValidationMessage] = useState<string>('');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);

  const dateDigits = getDateDigits(currentDate);
  const digitsArray = getDigitsArray(dateDigits);

  const addToEquation = (value: string) => {
    const validation = validateEquationInput(equation, value, currentDate);
    if (validation.isValid) {
      setEquation(equation + value);
      setShowHint(false); // Hide hint on successful input
    } else {
      // Show hint when user tries wrong digit
      if (/^\d$/.test(value)) {
        setShowHint(true);
        setTimeout(() => setShowHint(false), 4000); // Show for 4 seconds
      }
      // Show brief error feedback
      setValidationMessage(validation.error || 'Invalid input');
      setTimeout(() => setValidationMessage(''), 2000);
    }
  };

  const handleTextFieldChange = (newValue: string) => {
    // Filter the input to only allow valid characters
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

  return (
    <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
      {/* Input Hint - Only show when user tries wrong digit */}
      {showHint && (
        <Alert
          severity="info"
          icon={<Info />}
          sx={{ mb: 2, fontSize: '0.875rem' }}
        >
          {getInputHint(equation, currentDate)}
        </Alert>
      )}

      {/* Equation Display */}
      <TextField
        fullWidth
        label="Your Equation"
        value={equation}
        onChange={(e) => handleTextFieldChange(e.target.value)}
        variant="outlined"
        sx={{ mb: 2 }}
        placeholder="Start with digit 9..."
        multiline={false}
        helperText="Type freely - invalid characters will be filtered out"
      />

      {/* Action Buttons */}
      <Box display="flex" gap={1} mb={2} justifyContent="space-between">
        <Button
          variant="outlined"
          size="small"
          onClick={clearEquation}
          startIcon={<Clear />}
        >
          Clear
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={removeLastChar}
          disabled={!equation}
        >
          ⌫
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={validateEquationHandler}
          startIcon={<Calculate />}
        >
          Validate
        </Button>
      </Box>

      {/* Validation Message */}
      {validationMessage && (
        <Alert
          severity={isValid ? 'success' : 'warning'}
          icon={isValid ? <CheckCircle /> : undefined}
          sx={{ mb: 2 }}
        >
          {validationMessage}
          {validationResult && isValid && (
            <Typography variant="caption" display="block" sx={{ mt: 1, opacity: 0.8 }}>
              Complexity: {validationResult.complexity}
            </Typography>
          )}
        </Alert>
      )}

      {/* Digits */}
      <Typography variant="subtitle2" color="text.secondary" mb={1}>
        Digits (tap to add):
      </Typography>
      <Box display="flex" gap={0.5} mb={2} flexWrap="wrap">
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
            <Chip
              key={index}
              label={digit}
              onClick={() => addToEquation(digit.toString())}
              variant={isAllowed ? "outlined" : "filled"}
              color={isAllowed ? "secondary" : "default"}
              size="small"
              sx={{
                minWidth: 36,
                cursor: isAllowed ? 'pointer' : 'not-allowed',
                opacity: isAllowed ? 1 : 0.5,
                transform: isAllowed ? 'scale(1)' : 'scale(0.95)',
                transition: 'all 0.2s ease',
                border: isThisPositionNext && validation.isValid ? '2px solid #667eea' : undefined,
              }}
              disabled={!isAllowed}
            />
          );
        })}
      </Box>

      {/* Basic Operators */}
      <Typography variant="subtitle2" color="text.secondary" mb={1}>
        Basic Math:
      </Typography>
      <Box display="flex" gap={0.5} mb={2} flexWrap="wrap">
        {['+', '-', '*', '/', '='].map((symbol) => {
          const isEqualsAlreadyUsed = symbol === '=' && equation.includes('=');
          const isDisabled = isEqualsAlreadyUsed;

          return (
            <Chip
              key={symbol}
              label={symbol}
              onClick={() => addToEquation(symbol)}
              variant={isDisabled ? "filled" : "outlined"}
              color={isDisabled ? "default" : "primary"}
              size="small"
              sx={{
                minWidth: 36,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                opacity: isDisabled ? 0.5 : 1,
                transform: isDisabled ? 'scale(0.95)' : 'scale(1)',
                transition: 'all 0.2s ease'
              }}
              disabled={isDisabled}
            />
          );
        })}
      </Box>

      {/* Advanced Operators */}
      <Typography variant="subtitle2" color="text.secondary" mb={1}>
        Advanced:
      </Typography>
      <Box display="flex" gap={0.5} mb={2} flexWrap="wrap">
        {['^', '√', '!', '%', '|'].map((symbol) => (
          <Chip
            key={symbol}
            label={symbol}
            onClick={() => addToEquation(symbol)}
            variant="outlined"
            color="secondary"
            size="small"
            sx={{ minWidth: 36, cursor: 'pointer', fontSize: '1rem' }}
            title={symbol === '^' ? 'Power' : symbol === '√' ? 'Square Root' : symbol === '!' ? 'Factorial' : symbol === '%' ? 'Modulo' : 'Absolute Value'}
          />
        ))}
      </Box>

      {/* Grouping */}
      <Typography variant="subtitle2" color="text.secondary" mb={1}>
        Grouping & Other:
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
              minWidth: 36,
              cursor: 'pointer',
              fontSize: symbol === ' ' ? '0.75rem' : '1rem',
              fontWeight: symbol === ' ' ? 'normal' : 'bold'
            }}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default SimplifiedEquationBuilder;