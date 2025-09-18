import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Alert,
  Chip,
} from '@mui/material';
import { Clear, Calculate, CheckCircle, Info } from '@mui/icons-material';
import { useGameStore } from '../stores/gameStore';
import { getInputHint } from '../utils/inputValidator';
import { type ValidationResult } from '../utils/mathValidator';

interface SimplifiedEquationBuilderProps {
  addToEquation: (value: string) => void;
  handleTextFieldChange: (newValue: string) => void;
  clearEquation: () => void;
  removeLastChar: () => void;
  validateEquationHandler: () => void;
  validationMessage: string;
  validationResult: ValidationResult | null;
  showHint: boolean;
  equation: string;
  isValid: boolean;
}

const SimplifiedEquationBuilder: React.FC<SimplifiedEquationBuilderProps> = ({
  addToEquation,
  handleTextFieldChange,
  clearEquation,
  removeLastChar,
  validateEquationHandler,
  validationMessage,
  validationResult,
  showHint,
  equation,
  isValid,
}) => {
  const { currentDate } = useGameStore();

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