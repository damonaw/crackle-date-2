import type { ComplexityLevel, ValidationResult } from '../types';

export const calculateScore = (validationResult: ValidationResult): number => {
  if (!validationResult.isValid) {
    return 0;
  }

  // Base score for a valid solution
  let score = 10;

  // Complexity multipliers
  const complexityMultipliers: Record<ComplexityLevel, number> = {
    trivial: 0.5, // Basic solutions get half points
    simple: 1,
    moderate: 2,
    complex: 4,
    advanced: 8,
  };

  const multiplier = complexityMultipliers[validationResult.complexity];
  score *= multiplier;

  // Bonus for mathematical correctness
  if (validationResult.mathematicallyCorrect) {
    score += 5;
  }

  // Bonus for using all digits correctly
  if (validationResult.usesAllDigits && validationResult.digitsInOrder) {
    score += 10;
  }

  return Math.max(0, score);
};

export const getScoreDescription = (score: number, complexity: ComplexityLevel): string => {
  if (score === 0) {
    return 'No points - invalid solution';
  }

  const descriptions: Record<ComplexityLevel, string> = {
    trivial: 'Basic solution - every start counts!',
    simple: 'Good basic solution!',
    moderate: 'Nice work with moderate complexity!',
    complex: 'Excellent complex solution!',
    advanced: 'Outstanding advanced mathematics!',
  };

  return `${score} points - ${descriptions[complexity]}`;
};

export const getBonusPoints = (
  isFirstSolution: boolean,
  streakCount: number,
  timeBonus: boolean = false
): number => {
  let bonus = 0;

  // First solution bonus
  if (isFirstSolution) {
    bonus += 5;
  }

  // Streak bonus
  if (streakCount > 1) {
    bonus += Math.min(streakCount - 1, 10); // Max 10 bonus points for streaks
  }

  // Time bonus (if solved quickly)
  if (timeBonus) {
    bonus += 5;
  }

  return bonus;
};
