import { getDateDigits, getDigitsArray } from './dateUtils';

interface ValidationState {
  isValid: boolean;
  error?: string;
  expectedNext?: string[];
}

export const validateEquationInput = (
  currentEquation: string,
  newInput: string,
  currentDate: string
): ValidationState => {
  const requiredDigits = getDigitsArray(getDateDigits(currentDate));

  // Extract digits from current equation
  const usedDigits: number[] = [];
  const digitMatches = currentEquation.match(/\d/g);
  if (digitMatches) {
    usedDigits.push(...digitMatches.map((d) => parseInt(d)));
  }

  // Check if adding a new digit
  if (/^\d$/.test(newInput)) {
    const newDigit = parseInt(newInput);
    const nextExpectedDigitIndex = usedDigits.length;

    // Check if we've used all digits already
    if (nextExpectedDigitIndex >= requiredDigits.length) {
      return {
        isValid: false,
        error: 'All required digits have been used',
      };
    }

    // Check if this is the correct next digit
    const expectedDigit = requiredDigits[nextExpectedDigitIndex];
    if (newDigit !== expectedDigit) {
      return {
        isValid: false,
        error: `Expected digit ${expectedDigit}, got ${newDigit}`,
      };
    }

    return { isValid: true };
  }

  // Check if adding an operator
  const allowedOperators = ['+', '-', '*', '/', '^', '√', '!', '%', '|', '(', ')', '=', ' '];
  if (allowedOperators.includes(newInput)) {
    return { isValid: true };
  }

  // Check for special sequences like absolute value
  if (newInput === '|' && currentEquation.endsWith('|')) {
    return { isValid: true }; // Closing absolute value
  }

  return {
    isValid: false,
    error: `Invalid character: ${newInput}`,
  };
};

export const getNextAllowedInputs = (currentEquation: string, currentDate: string): string[] => {
  const requiredDigits = getDigitsArray(getDateDigits(currentDate));
  const usedDigits: number[] = [];
  const digitMatches = currentEquation.match(/\d/g);
  if (digitMatches) {
    usedDigits.push(...digitMatches.map((d) => parseInt(d)));
  }

  const allowedInputs: string[] = [];

  // Add next required digit if available
  if (usedDigits.length < requiredDigits.length) {
    const nextDigit = requiredDigits[usedDigits.length];
    allowedInputs.push(nextDigit.toString());
  }

  // Always allow operators and special characters
  allowedInputs.push('+', '-', '*', '/', '^', '√', '!', '%', '|', '(', ')', '=', ' ');

  return allowedInputs;
};

export const filterInput = (
  input: string,
  currentEquation: string,
  currentDate: string
): string => {
  const allowedInputs = getNextAllowedInputs(currentEquation, currentDate);

  // Filter input to only include allowed characters
  return input
    .split('')
    .filter((char) => allowedInputs.includes(char))
    .join('');
};

export const getInputHint = (currentEquation: string, currentDate: string): string => {
  const requiredDigits = getDigitsArray(getDateDigits(currentDate));
  const usedDigits: number[] = [];
  const digitMatches = currentEquation.match(/\d/g);
  if (digitMatches) {
    usedDigits.push(...digitMatches.map((d) => parseInt(d)));
  }

  if (usedDigits.length < requiredDigits.length) {
    const nextDigit = requiredDigits[usedDigits.length];
    const remainingDigits = requiredDigits.slice(usedDigits.length);
    return `Next digit: ${nextDigit} (remaining: ${remainingDigits.join(', ')})`;
  }

  return 'All digits used! Add operators and = to complete equation';
};
