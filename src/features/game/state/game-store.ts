import { create } from 'zustand';
import type { ComplexityLevel, GameState } from '../types';
import { getTodaysGameDate } from '../lib/dateUtils';
import {
  getGameData,
  saveGameData,
  getGameStats,
  updateGameStats,
  getUserPreferences,
  saveUserPreferences,
  type GameStats,
  type ThemeMode,
} from '../lib/localStorage';

interface GameStore extends GameState {
  setEquation: (equation: string) => void;
  setValid: (isValid: boolean) => void;
  addSolution: (equation: string, score: number, complexity: ComplexityLevel) => void;
  resetGame: () => void;
  setScore: (score: number) => void;
  gameStats: GameStats;
  updateStats: (won: boolean, score: number) => void;
  loadGameState: () => void;
  saveGameState: () => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  cycleThemeMode: () => void;
}

const initialState: GameState = {
  currentDate: getTodaysGameDate(),
  equation: '',
  isValid: false,
  score: 0,
  streak: 0,
  solutions: [],
};

const THEME_SEQUENCE: ThemeMode[] = ['system', 'light', 'dark'];

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,
  gameStats: getGameStats(),
  themeMode: getUserPreferences().themeMode ?? 'system',

  setEquation: (equation: string) => {
    set({ equation });
    setTimeout(() => get().saveGameState(), 100);
  },

  setValid: (isValid: boolean) => {
    set({ isValid });
  },

  addSolution: (equation: string, score: number, complexity: ComplexityLevel) => {
    const newSolution = {
      equation,
      score,
      timestamp: new Date(),
      complexity,
    };

    set((state) => ({
      solutions: [...state.solutions, newSolution],
      score: state.score + score,
    }));

    get().updateStats(true, score);
    get().saveGameState();
  },

  setScore: (score: number) => {
    set({ score });
  },

  updateStats: (won: boolean, score: number) => {
    const updatedStats = updateGameStats(won, score, get().currentDate);
    set({ gameStats: updatedStats });
  },

  resetGame: () => {
    set({
      ...initialState,
      currentDate: getTodaysGameDate(),
      gameStats: get().gameStats,
      themeMode: get().themeMode,
    });
    get().saveGameState();
  },

  loadGameState: () => {
    const savedGame = getGameData();
    const todaysDate = getTodaysGameDate();

    if (savedGame && savedGame.currentDate === todaysDate) {
      const convertedSolutions = savedGame.solutions.map((sol) => ({
        equation: sol.equation,
        score: sol.score,
        timestamp: new Date(sol.timestamp),
        complexity: sol.complexity ?? 'simple',
      }));

      set({
        currentDate: savedGame.currentDate,
        equation: savedGame.equation,
        solutions: convertedSolutions,
        isValid: savedGame.isValid,
        score: convertedSolutions.reduce((total, sol) => total + sol.score, 0),
      });
    } else {
      set({
        ...initialState,
        currentDate: todaysDate,
        gameStats: get().gameStats,
      });
      get().saveGameState();
    }

    set({
      gameStats: getGameStats(),
      themeMode: getUserPreferences().themeMode ?? 'system',
    });
  },

  saveGameState: () => {
    const state = get();
    const storageSolutions = state.solutions.map((sol) => ({
      equation: sol.equation,
      score: sol.score,
      timestamp: sol.timestamp.toISOString(),
      complexity: sol.complexity,
    }));

    const gameData = {
      currentDate: state.currentDate,
      equation: state.equation,
      solutions: storageSolutions,
      isValid: state.isValid,
      completedToday: state.solutions.length > 0,
    };

    saveGameData(gameData);
  },

  setThemeMode: (mode: ThemeMode) => {
    set({ themeMode: mode });
    const prefs = getUserPreferences();
    saveUserPreferences({ ...prefs, themeMode: mode });
  },

  cycleThemeMode: () => {
    const current = get().themeMode;
    const index = THEME_SEQUENCE.indexOf(current);
    const next = THEME_SEQUENCE[(index + 1) % THEME_SEQUENCE.length];
    get().setThemeMode(next);
  },
}));
