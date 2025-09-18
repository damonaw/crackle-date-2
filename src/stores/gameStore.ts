import { create } from 'zustand';
import type { GameState } from '../types/game';
import { getTodaysGameDate } from '../utils/dateUtils';
import { 
  getGameData, 
  saveGameData, 
  getGameStats, 
  updateGameStats,
  getUserPreferences,
  saveUserPreferences,
  type GameStats 
} from '../utils/localStorage';

interface GameStore extends GameState {
  // Game state actions
  setEquation: (equation: string) => void;
  setValid: (isValid: boolean) => void;
  addSolution: (equation: string, score: number) => void;
  resetGame: () => void;
  setScore: (score: number) => void;
  
  // Statistics
  gameStats: GameStats;
  updateStats: (won: boolean, score: number) => void;
  
  // Persistence
  loadGameState: () => void;
  saveGameState: () => void;
  
  // User preferences
  darkMode: boolean;
  toggleDarkMode: () => void;
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
  
  // Initialize stats and preferences
  gameStats: getGameStats(),
  darkMode: getUserPreferences().darkMode,

  setEquation: (equation: string) => {
    set({ equation });
    // Auto-save game state when equation changes
    setTimeout(() => get().saveGameState(), 100);
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
    
    // Update statistics when solution is added
    get().updateStats(true, score);
    
    // Save game state
    get().saveGameState();
  },

  setScore: (score: number) => {
    set({ score });
  },

  updateStats: (won: boolean, score: number) => {
    const currentDate = get().currentDate;
    const updatedStats = updateGameStats(won, score, currentDate);
    set({ gameStats: updatedStats });
  },

  resetGame: () => {
    set({
      ...initialState,
      currentDate: getTodaysGameDate(),
      gameStats: get().gameStats, // Preserve stats
      darkMode: get().darkMode, // Preserve preferences
    });
    get().saveGameState();
  },

  loadGameState: () => {
    const savedGame = getGameData();
    const todaysDate = getTodaysGameDate();
    
    if (savedGame && savedGame.currentDate === todaysDate) {
      // Load today's game if it exists, converting stored solutions to proper Solution type
      const convertedSolutions = savedGame.solutions.map(sol => ({
        equation: sol.equation,
        score: sol.score,
        timestamp: new Date(sol.timestamp),
        complexity: 'simple' as const, // Default complexity for loaded solutions
      }));
      
      set({
        currentDate: savedGame.currentDate,
        equation: savedGame.equation,
        solutions: convertedSolutions,
        isValid: savedGame.isValid,
        score: convertedSolutions.reduce((total, sol) => total + sol.score, 0),
      });
    } else {
      // Start fresh game for today
      set({
        ...initialState,
        currentDate: todaysDate,
        gameStats: get().gameStats,
        darkMode: get().darkMode,
      });
      get().saveGameState();
    }
    
    // Load stats and preferences
    set({ 
      gameStats: getGameStats(),
      darkMode: getUserPreferences().darkMode,
    });
  },

  saveGameState: () => {
    const state = get();
    // Convert solutions to storage format (Date to string)
    const storageSolutions = state.solutions.map(sol => ({
      equation: sol.equation,
      score: sol.score,
      timestamp: sol.timestamp.toISOString(),
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

  toggleDarkMode: () => {
    const newDarkMode = !get().darkMode;
    set({ darkMode: newDarkMode });
    
    // Save preference
    const prefs = getUserPreferences();
    saveUserPreferences({ ...prefs, darkMode: newDarkMode });
  },
}));