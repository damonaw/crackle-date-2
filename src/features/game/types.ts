export interface GameState {
  currentDate: string;
  equation: string;
  isValid: boolean;
  score: number;
  streak: number;
  solutions: Solution[];
  availableDates: string[];
  achievements: AchievementStatus[];
  wrongAttempts: number;
  startTime: number | null;
  easyMode: boolean;
  inputClicks: number;
}

export interface Solution {
  equation: string;
  score: number;
  timestamp: Date;
  complexity: ComplexityLevel;
  timeToSolve?: number;
  wrongAttempts?: number;
  inputClicks?: number;
}

export type ComplexityLevel = 'trivial' | 'simple' | 'moderate' | 'complex' | 'advanced';

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
}

export interface AchievementStatus extends AchievementDefinition {
  unlocked: boolean;
  unlockedOn?: string;
  progress?: string;
  category?: string;
}

export interface DateDigits {
  month: number;
  day1: number;
  day2: number;
  year1: number;
  year2: number;
  year3: number;
  year4: number;
}

export interface MathOperation {
  symbol: string;
  name: string;
  complexity: number;
  precedence: number;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  usesAllDigits: boolean;
  digitsInOrder: boolean;
  mathematicallyCorrect: boolean;
  complexity: ComplexityLevel;
}
