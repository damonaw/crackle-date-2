import { create } from 'zustand';
import type { GameState } from '../types/game';
import { getTodaysGameDate } from '../utils/dateUtils';

interface GameStore extends GameState {
  setEquation: (equation: string) => void;
  setValid: (isValid: boolean) => void;
  addSolution: (equation: string, score: number) => void;
  resetGame: () => void;
  setScore: (score: number) => void;
}

const initialState: GameState = {
  currentDate: getTodaysGameDate(),
  equation: '',
  isValid: false,
  score: 0,
  streak: 0,
  solutions: [],
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  setEquation: (equation: string) => {
    set({ equation });
  },

  setValid: (isValid: boolean) => {
    set({ isValid });
  },

  addSolution: (equation: string, score: number) => {
    const currentSolutions = get().solutions;
    const newSolution = {
      equation,
      score,
      timestamp: new Date(),
      complexity: 'simple' as const, // Will be calculated by validator
    };

    set({
      solutions: [...currentSolutions, newSolution],
      score: get().score + score,
    });
  },

  setScore: (score: number) => {
    set({ score });
  },

  resetGame: () => {
    set({
      ...initialState,
      currentDate: getTodaysGameDate(),
    });
  },
}));