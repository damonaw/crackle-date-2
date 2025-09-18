import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useGameStore } from '../stores/gameStore';
import { validateEquationInput, filterInput } from '../utils/inputValidator';
import { validateEquation, type ValidationResult } from '../utils/mathValidator';
import { calculateScore, getScoreDescription } from '../utils/scoring';
import CompactGameView from './CompactGameView';
import SimplifiedEquationBuilder from './SimplifiedEquationBuilder';

const GameArea: React.FC = () => {
  const { currentDate, equation, setEquation, isValid, setValid, addSolution } = useGameStore();
  const [validationMessage, setValidationMessage] = useState<string>('');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);

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
    <Box display="flex" flexDirection="column" gap={2}>
      <CompactGameView addToEquation={addToEquation} equation={equation} />
      <SimplifiedEquationBuilder
        addToEquation={addToEquation}
        handleTextFieldChange={handleTextFieldChange}
        clearEquation={clearEquation}
        removeLastChar={removeLastChar}
        validateEquationHandler={validateEquationHandler}
        validationMessage={validationMessage}
        validationResult={validationResult}
        showHint={showHint}
        equation={equation}
        isValid={isValid}
      />
    </Box>
  );
};

export default GameArea;