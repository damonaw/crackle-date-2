import type { MathOperation } from '../types';

export const MATH_OPERATIONS: MathOperation[] = [
  { symbol: '+', name: 'Add', complexity: 1, precedence: 1 },
  { symbol: '-', name: 'Subtract', complexity: 1, precedence: 1 },
  { symbol: '*', name: 'Multiply', complexity: 2, precedence: 2 },
  { symbol: '/', name: 'Divide', complexity: 2, precedence: 2 },
  { symbol: '^', name: 'Power', complexity: 4, precedence: 4 },
  { symbol: '√', name: 'Square Root', complexity: 3, precedence: 5 },
  { symbol: '!', name: 'Factorial', complexity: 3, precedence: 5 },
  { symbol: '|', name: 'Absolute Value', complexity: 2, precedence: 5 },
  { symbol: '%', name: 'Modulo', complexity: 3, precedence: 2 },
  { symbol: '(', name: 'Open Parenthesis', complexity: 1, precedence: 0 },
  { symbol: ')', name: 'Close Parenthesis', complexity: 1, precedence: 0 },
  { symbol: '=', name: 'Equals', complexity: 0, precedence: 0 },
];

export const getOperationBySymbol = (symbol: string): MathOperation | undefined => {
  return MATH_OPERATIONS.find((op) => op.symbol === symbol);
};

export const getComplexityScore = (operations: MathOperation[]): number => {
  return operations.reduce((total, op) => total + op.complexity, 0);
};
