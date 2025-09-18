import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Alert,
  Chip,
  IconButton,
} from '@mui/material';
import { Clear, Calculate, CheckCircle } from '@mui/icons-material';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { useDroppable } from '@dnd-kit/core';
import { useGameStore } from '../stores/gameStore';
import { getDateDigits, getDigitsArray } from '../utils/dateUtils';
import { validateEquation, type ValidationResult } from '../utils/mathValidator';
import { calculateScore, getScoreDescription } from '../utils/scoring';
import OperatorPalette from './OperatorPalette';

interface DropZoneProps {
  id: string;
  children: React.ReactNode;
}

const DropZone: React.FC<DropZoneProps> = ({ id, children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        minHeight: 80,
        p: 2,
        border: '2px dashed',
        borderColor: isOver ? 'primary.main' : 'divider',
        borderRadius: 2,
        backgroundColor: isOver ? 'primary.light' : 'background.paper',
        transition: 'all 0.2s ease-in-out',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 1,
      }}
    >
      {children}
    </Box>
  );
};

const EquationBuilder: React.FC = () => {
  const { currentDate, equation, setEquation, isValid, setValid, addSolution } = useGameStore();
  const [equationParts, setEquationParts] = useState<string[]>([]);
  const [validationMessage, setValidationMessage] = useState<string>('');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  const dateDigits = getDateDigits(currentDate);
  const digitsArray = getDigitsArray(dateDigits);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && over.id === 'equation-builder') {
      const draggedItem = active.id as string;

      if (draggedItem.startsWith('operator-')) {
        const operator = draggedItem.replace('operator-', '');
        setEquationParts((prev) => [...prev, operator]);
      }
    }
  };

  const addDigit = (digit: number) => {
    setEquationParts((prev) => [...prev, digit.toString()]);
  };

  const removeLastItem = () => {
    setEquationParts((prev) => prev.slice(0, -1));
  };

  const clearEquation = () => {
    setEquationParts([]);
    setEquation('');
    setValidationMessage('');
  };

  const buildEquationString = () => {
    const equationString = equationParts.join(' ');
    setEquation(equationString);
    return equationString;
  };

  const validateEquationHandler = () => {
    const equationString = equation || buildEquationString();

    if (!equationString) {
      setValidationMessage('Please build an equation first');
      setValid(false);
      return;
    }

    const result = validateEquation(equationString, currentDate);
    setValidationResult(result);
    setValid(result.isValid);

    if (result.isValid) {
      const score = calculateScore(result);
      const description = getScoreDescription(score, result.complexity);
      setValidationMessage(description);

      // Add solution to store
      addSolution(equationString, score);
    } else {
      setValidationMessage(result.error || 'Invalid equation');
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" color="primary">
            Crackle Date
          </Typography>
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              size="small"
              onClick={clearEquation}
              startIcon={<Clear />}
            >
              Clear
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
        </Box>

        {/* Available Digits */}
        <Box mb={3}>
          <Typography variant="subtitle2" color="text.secondary" mb={1}>
            Available Digits (click to add):
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            {digitsArray.map((digit, index) => (
              <Chip
                key={index}
                label={digit}
                onClick={() => addDigit(digit)}
                variant="outlined"
                color="secondary"
                sx={{
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  height: 40,
                  minWidth: 40,
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'secondary.light',
                    color: 'white',
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Equation Display */}
        <Box mb={3}>
          <Typography variant="subtitle2" color="text.secondary" mb={1}>
            Your Equation:
          </Typography>
          <DropZone id="equation-builder">
            {equationParts.length === 0 ? (
              <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                Drop operators here or click digits above
              </Typography>
            ) : (
              <>
                {equationParts.map((part, index) => (
                  <Chip
                    key={index}
                    label={part}
                    color="primary"
                    variant="filled"
                    sx={{
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      height: 40,
                      margin: '2px',
                    }}
                  />
                ))}
                <IconButton
                  size="small"
                  onClick={removeLastItem}
                  color="error"
                  sx={{ ml: 1 }}
                >
                  <Clear />
                </IconButton>
              </>
            )}
          </DropZone>
        </Box>

        {/* Equation Text Input */}
        <TextField
          fullWidth
          label="Equation (you can also type directly)"
          value={equation}
          onChange={(e) => setEquation(e.target.value)}
          variant="outlined"
          sx={{ mb: 2 }}
          placeholder="e.g., 9 * 1 + 7 * 2 + 0 = 2^5"
        />

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

        {/* Operator Palette */}
        <OperatorPalette />
      </Paper>
    </DndContext>
  );
};

export default EquationBuilder;