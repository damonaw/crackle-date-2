import { evaluate, parse } from 'mathjs';
import type { ValidationResult, ComplexityLevel } from '../types/game';
import { getDateDigits, getDigitsArray } from './dateUtils';
import { getOperationBySymbol } from './mathOperations';

export type { ValidationResult };

export const validateEquation = (equation: string, currentDate: string): ValidationResult => {
  try {
    // Basic checks
    if (!equation.trim()) {
      return {
        isValid: false,
        error: 'Equation cannot be empty',
        usesAllDigits: false,
        digitsInOrder: false,
        mathematicallyCorrect: false,
        complexity: 'trivial',
      };
    }

    if (!equation.includes('=')) {
      return {
        isValid: false,
        error: 'Equation must contain an equals sign (=)',
        usesAllDigits: false,
        digitsInOrder: false,
        mathematicallyCorrect: false,
        complexity: 'trivial',
      };
    }

    // Split equation at equals sign
    const [leftSide, rightSide] = equation.split('=');
    if (!leftSide.trim() || !rightSide.trim()) {
      return {
        isValid: false,
        error: 'Both sides of the equation must have content',
        usesAllDigits: false,
        digitsInOrder: false,
        mathematicallyCorrect: false,
        complexity: 'trivial',
      };
    }

    // Check if digits are used correctly
    const digitValidation = validateDigitUsage(equation, currentDate);
    if (!digitValidation.usesAllDigits || !digitValidation.digitsInOrder) {
      return {
        isValid: false,
        error: digitValidation.error || 'Invalid digit usage',
        usesAllDigits: digitValidation.usesAllDigits,
        digitsInOrder: digitValidation.digitsInOrder,
        mathematicallyCorrect: false,
        complexity: 'trivial',
      };
    }

    // Evaluate mathematical correctness
    const mathValidation = validateMathematically(leftSide.trim(), rightSide.trim());
    if (!mathValidation.isCorrect) {
      return {
        isValid: false,
        error: mathValidation.error,
        usesAllDigits: true,
        digitsInOrder: true,
        mathematicallyCorrect: false,
        complexity: 'simple',
      };
    }

    // Calculate complexity
    const complexity = calculateComplexity(equation);

    // Check for trivial solutions
    if (isTrivialSolution(equation)) {
      return {
        isValid: false,
        error: 'Trivial solutions (like multiplying by zero) are not allowed',
        usesAllDigits: true,
        digitsInOrder: true,
        mathematicallyCorrect: true,
        complexity: 'trivial',
      };
    }

    return {
      isValid: true,
      usesAllDigits: true,
      digitsInOrder: true,
      mathematicallyCorrect: true,
      complexity,
    };
  } catch (error) {
    return {
      isValid: false,
      error: `Invalid mathematical expression: ${error instanceof Error ? error.message : 'Unknown error'}`,
      usesAllDigits: false,
      digitsInOrder: false,
      mathematicallyCorrect: false,
      complexity: 'trivial',
    };
  }
};

const validateDigitUsage = (equation: string, currentDate: string) => {
  const requiredDigits = getDigitsArray(getDateDigits(currentDate));

  // Extract all digits from the equation in order
  const usedDigits: number[] = [];
  const digitRegex = /\d/g;
  let match;

  while ((match = digitRegex.exec(equation)) !== null) {
    usedDigits.push(parseInt(match[0]));
  }

  // Check if all required digits are used
  const usesAllDigits = requiredDigits.length === usedDigits.length &&
    requiredDigits.every((digit, index) => digit === usedDigits[index]);

  // Check if digits appear in correct order
  const digitsInOrder = requiredDigits.every((digit, index) =>
    index < usedDigits.length && digit === usedDigits[index]
  );

  let error = '';
  if (!usesAllDigits) {
    error = `Must use all digits: ${requiredDigits.join(', ')}`;
  } else if (!digitsInOrder) {
    error = `Digits must appear in order: ${requiredDigits.join(', ')}`;
  }

  return {
    usesAllDigits,
    digitsInOrder,
    error: error || undefined,
  };
};

const validateMathematically = (leftSide: string, rightSide: string) => {
  try {
    // Replace special symbols with mathjs-compatible ones
    const normalizedLeft = normalizeExpression(leftSide);
    const normalizedRight = normalizeExpression(rightSide);

    // Parse expressions to check syntax
    parse(normalizedLeft);
    parse(normalizedRight);

    // Evaluate both sides
    const leftValue = evaluate(normalizedLeft);
    const rightValue = evaluate(normalizedRight);

    // Check for equality (with floating point tolerance)
    const tolerance = 1e-10;
    const isEqual = Math.abs(leftValue - rightValue) < tolerance;

    if (!isEqual) {
      return {
        isCorrect: false,
        error: `Left side (${leftValue}) does not equal right side (${rightValue})`,
      };
    }

    return {
      isCorrect: true,
      leftValue,
      rightValue,
    };
  } catch (error) {
    return {
      isCorrect: false,
      error: `Mathematical evaluation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

const normalizeExpression = (expression: string): string => {
  return expression
    .replace(/√/g, 'sqrt')
    .replace(/\^/g, '^')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/\|([^|]+)\|/g, 'abs($1)'); // Convert |x| to abs(x)
};

const calculateComplexity = (equation: string): ComplexityLevel => {
  const operations: string[] = [];

  // Extract operations from equation
  const operatorRegex = /[+\-*/^√!%()]/g;
  let match;

  while ((match = operatorRegex.exec(equation)) !== null) {
    operations.push(match[0]);
  }

  // Calculate complexity score
  const complexityScore = operations.reduce((total, op) => {
    const operation = getOperationBySymbol(op);
    return total + (operation?.complexity || 1);
  }, 0);

  // Determine complexity level
  if (complexityScore <= 2) return 'trivial';
  if (complexityScore <= 5) return 'simple';
  if (complexityScore <= 10) return 'moderate';
  if (complexityScore <= 15) return 'complex';
  return 'advanced';
};

const isTrivialSolution = (equation: string): boolean => {
  // Check for common trivial patterns that make the equation too easy
  const trivialPatterns = [
    /.*\*\s*0\s*=\s*0.*/, // Multiplying by zero equals zero
    /.*0\s*\*.*=\s*0.*/, // Zero multiplication equals zero
    /(\d+)\s*=\s*\1/, // Identity (same number on both sides)
    /^\s*\d+\s*\+\s*0\s*=\s*\d+\s*$/, // Simple adding zero (like "5 + 0 = 5")
    /^\s*\d+\s*-\s*0\s*=\s*\d+\s*$/, // Simple subtracting zero (like "5 - 0 = 5")
    /^\s*\d+\s*\/\s*1\s*=\s*\d+\s*$/, // Simple dividing by one (like "5 / 1 = 5")
    /^\s*\d+\s*\*\s*1\s*=\s*\d+\s*$/, // Simple multiplying by one (like "5 * 1 = 5")
  ];

  return trivialPatterns.some(pattern => pattern.test(equation));
};