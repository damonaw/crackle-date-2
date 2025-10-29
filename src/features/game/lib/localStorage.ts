import type { ComplexityLevel } from '../types';
import { differenceInDays, parseGameDate } from './dateUtils';
import { recordAchievementDates } from './achievements';

/**
 * Local Storage utilities for Crackle Date game
 * Handles saving and loading game data, statistics, and user preferences
 */

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  winPercentage: number;
  averageScore: number;
  scoreDistribution: { [score: string]: number };
  lastPlayedDate: string;
  dailyBestScores: Record<string, number>;
  daysPlayed: number;
  achievementDates?: Record<string, string>;
}

export interface StoredSolutionData {
  equation: string;
  score: number;
  timestamp: string;
  complexity?: ComplexityLevel;
}

export interface StoredDayState {
  equation: string;
  solutions: StoredSolutionData[];
  isValid: boolean;
  completed: boolean;
  hintsUsed: number;
}

export interface GameData {
  lastSelectedDate: string;
  history: Record<string, StoredDayState>;
}

interface LegacyGameData {
  currentDate: string;
  equation: string;
  solutions: StoredSolutionData[];
  isValid: boolean;
  completedToday: boolean;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface UserPreferences {
  darkMode: boolean; // legacy; kept for backward compatibility
  soundEnabled: boolean;
  themeMode?: ThemeMode; // new preferred field
  tutorialSeen?: boolean;
  dragAndDropBeta?: boolean;
}

const STORAGE_KEYS = {
  GAME_STATS: 'crackle-date-stats',
  GAME_DATA: 'crackle-date-game',
  USER_PREFS: 'crackle-date-prefs',
} as const;

const normalizeSolutions = (solutions: StoredSolutionData[] = []): StoredSolutionData[] =>
  solutions.map((solution) => ({
    equation: solution.equation,
    score: solution.score,
    timestamp: solution.timestamp,
    complexity: solution.complexity,
  }));

const normalizeDayState = (state?: Partial<StoredDayState>): StoredDayState => {
  const normalizedSolutions = normalizeSolutions(state?.solutions ?? []);

  return {
    equation: state?.equation ?? '',
    solutions: normalizedSolutions,
    isValid: state?.isValid ?? false,
    completed: state?.completed ?? normalizedSolutions.length > 0,
    hintsUsed: typeof state?.hintsUsed === 'number' ? state.hintsUsed : 0,
  };
};

const convertLegacyGameData = (legacy: LegacyGameData): GameData => {
  if (!legacy.currentDate) {
    return { lastSelectedDate: '', history: {} };
  }

  return {
    lastSelectedDate: legacy.currentDate,
    history: {
      [legacy.currentDate]: normalizeDayState({
        equation: legacy.equation,
        solutions: legacy.solutions,
        isValid: legacy.isValid,
        completed: legacy.completedToday,
        hintsUsed: 0,
      }),
    },
  };
};

const normalizeImportedStats = (incoming: Partial<GameStats>): GameStats => {
  const current = getGameStats();
  const merged: GameStats = {
    ...current,
    ...incoming,
    scoreDistribution: incoming.scoreDistribution ?? current.scoreDistribution,
    dailyBestScores: incoming.dailyBestScores ?? current.dailyBestScores,
    achievementDates: incoming.achievementDates ?? current.achievementDates,
  } as GameStats;

  if (!merged.dailyBestScores) {
    merged.dailyBestScores = {};
  }
  if (!merged.achievementDates) {
    merged.achievementDates = {};
  }

  return merged;
};

/**
 * Check if localStorage is available
 */
export const isLocalStorageAvailable = (): boolean => {
  try {
    const test = 'localStorage-test';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

/**
 * Save data to localStorage with error handling
 */
const saveToStorage = <T>(key: string, data: T): boolean => {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available');
    return false;
  }

  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Failed to save to localStorage (${key}):`, error);
    return false;
  }
};

/**
 * Load data from localStorage with error handling
 */
const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  if (!isLocalStorageAvailable()) {
    return defaultValue;
  }

  try {
    const stored = localStorage.getItem(key);
    if (stored === null) {
      return defaultValue;
    }
    return JSON.parse(stored) as T;
  } catch (error) {
    console.error(`Failed to load from localStorage (${key}):`, error);
    return defaultValue;
  }
};

/**
 * Game Statistics Management
 */
export const getGameStats = (): GameStats => {
  const defaultStats: GameStats = {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    winPercentage: 0,
    averageScore: 0,
    scoreDistribution: {},
    lastPlayedDate: '',
    dailyBestScores: {},
    daysPlayed: 0,
    achievementDates: {},
  };

  const stats = loadFromStorage<GameStats>(STORAGE_KEYS.GAME_STATS, defaultStats);

  if (!stats.dailyBestScores || Object.keys(stats.dailyBestScores).length === 0) {
    stats.dailyBestScores = {};
    const entries = Object.entries(stats.scoreDistribution);
    let index = 0;
    entries.forEach(([scoreStr, count]) => {
      const scoreValue = Number.parseInt(scoreStr, 10);
      for (let i = 0; i < count; i += 1) {
        stats.dailyBestScores[`legacy-${index}`] = scoreValue;
        index += 1;
      }
    });
  }

  if (!stats.achievementDates) {
    stats.achievementDates = {};
  }

  stats.daysPlayed = Object.keys(stats.dailyBestScores).length;
  if (stats.daysPlayed > stats.gamesPlayed) {
    stats.gamesPlayed = stats.daysPlayed;
  }
  if (stats.daysPlayed > stats.gamesWon) {
    stats.gamesWon = stats.daysPlayed;
  }

  const bestScores = Object.values(stats.dailyBestScores);
  if (bestScores.length > 0) {
    const totalScore = bestScores.reduce((sum, value) => sum + value, 0);
    stats.averageScore = totalScore / bestScores.length;
  } else {
    stats.averageScore = 0;
  }

  return stats;
};

export const saveGameStats = (stats: GameStats): boolean => {
  stats.daysPlayed = Object.keys(stats.dailyBestScores ?? {}).length;
  stats.gamesPlayed = stats.daysPlayed;
  stats.gamesWon = stats.daysPlayed;
  if (!stats.achievementDates) {
    stats.achievementDates = {};
  }

  const bestScores = Object.values(stats.dailyBestScores ?? {});
  if (bestScores.length > 0) {
    const totalScore = bestScores.reduce((sum, value) => sum + value, 0);
    stats.averageScore = totalScore / bestScores.length;
  } else {
    stats.averageScore = 0;
  }

  // Recalculate win percentage
  stats.winPercentage = stats.gamesPlayed > 0 ? (stats.gamesWon / stats.gamesPlayed) * 100 : 0;

  return saveToStorage(STORAGE_KEYS.GAME_STATS, stats);
};

export const updateGameStats = (
  won: boolean,
  score: number,
  date: string,
  isFirstSolutionOfDay: boolean
): GameStats => {
  const stats = getGameStats();

  if (!stats.dailyBestScores) {
    stats.dailyBestScores = {};
  }

  const today = parseGameDate(date);
  const lastPlayed = stats.lastPlayedDate ? parseGameDate(stats.lastPlayedDate) : null;
  const isBackfill = lastPlayed ? today.getTime() < lastPlayed.getTime() : false;

  if (!won) {
    if (isFirstSolutionOfDay && !isBackfill) {
      stats.currentStreak = 0;
    }
    if (!lastPlayed || today.getTime() >= lastPlayed.getTime()) {
      stats.lastPlayedDate = date;
    }
    recordAchievementDates(stats, date);
    saveGameStats(stats);
    return stats;
  }

  if (isFirstSolutionOfDay && !isBackfill) {
    if (lastPlayed) {
      const delta = differenceInDays(today, lastPlayed);
      if (delta === 1) {
        stats.currentStreak += 1;
      } else if (delta === 0) {
        stats.currentStreak = Math.max(stats.currentStreak, 1);
      } else {
        stats.currentStreak = 1;
      }
    } else {
      stats.currentStreak = 1;
    }
  }

  if (stats.currentStreak < 0) {
    stats.currentStreak = 0;
  }

  stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);

  const previousBest = stats.dailyBestScores[date];
  const newBest = previousBest !== undefined ? Math.max(previousBest, score) : score;

  if (previousBest === undefined) {
    stats.dailyBestScores[date] = newBest;
    const scoreKey = newBest.toString();
    stats.scoreDistribution[scoreKey] = (stats.scoreDistribution[scoreKey] || 0) + 1;
  } else if (newBest !== previousBest) {
    const previousKey = previousBest.toString();
    const previousCount = stats.scoreDistribution[previousKey] || 0;
    if (previousCount <= 1) {
      delete stats.scoreDistribution[previousKey];
    } else {
      stats.scoreDistribution[previousKey] = previousCount - 1;
    }

    const newKey = newBest.toString();
    stats.scoreDistribution[newKey] = (stats.scoreDistribution[newKey] || 0) + 1;
    stats.dailyBestScores[date] = newBest;
  }

  const bestScores = Object.values(stats.dailyBestScores);
  const totalScore = bestScores.reduce((sum, value) => sum + value, 0);
  stats.daysPlayed = bestScores.length;
  stats.gamesPlayed = stats.daysPlayed;
  stats.gamesWon = stats.daysPlayed;
  stats.averageScore = stats.daysPlayed > 0 ? totalScore / stats.daysPlayed : 0;

  if (!lastPlayed || today.getTime() >= lastPlayed.getTime()) {
    stats.lastPlayedDate = date;
  }

  recordAchievementDates(stats, date);

  saveGameStats(stats);

  return stats;
};

/**
 * Game Data Management
 */
export const getGameData = (): GameData | null => {
  const raw = loadFromStorage<GameData | LegacyGameData | null>(STORAGE_KEYS.GAME_DATA, null);

  if (!raw) {
    return null;
  }

  if ('history' in raw && raw.history) {
    const history: Record<string, StoredDayState> = {};
    Object.entries(raw.history).forEach(([date, state]) => {
      history[date] = normalizeDayState(state);
    });

    return {
      lastSelectedDate: raw.lastSelectedDate ?? '',
      history,
    };
  }

  const legacy = raw as LegacyGameData;
  const converted = convertLegacyGameData(legacy);

  if (!converted.lastSelectedDate) {
    return null;
  }

  return converted;
};

export const saveGameData = (gameData: GameData): boolean => {
  const history: Record<string, StoredDayState> = {};
  Object.entries(gameData.history).forEach(([date, state]) => {
    history[date] = normalizeDayState(state);
  });

  const dataToSave: GameData = {
    lastSelectedDate: gameData.lastSelectedDate,
    history,
  };

  return saveToStorage(STORAGE_KEYS.GAME_DATA, dataToSave);
};

/**
 * User Preferences Management
 */
export const getUserPreferences = (): UserPreferences => {
  const defaultPrefs: UserPreferences = {
    darkMode: false,
    soundEnabled: true,
    themeMode: 'system',
    tutorialSeen: false,
    dragAndDropBeta: false,
  };

  const prefs = loadFromStorage(STORAGE_KEYS.USER_PREFS, defaultPrefs);
  if (!prefs.themeMode) {
    // Derive themeMode from legacy darkMode if missing
    prefs.themeMode = prefs.darkMode ? 'dark' : 'light';
  }
  if (typeof prefs.tutorialSeen !== 'boolean') {
    prefs.tutorialSeen = false;
  }
  if (typeof prefs.dragAndDropBeta !== 'boolean') {
    prefs.dragAndDropBeta = false;
  }
  return prefs;
};

export const saveUserPreferences = (prefs: UserPreferences): boolean => {
  // Keep legacy darkMode flag in sync for older versions
  const toSave = {
    ...prefs,
    darkMode: prefs.themeMode ? prefs.themeMode === 'dark' : prefs.darkMode,
    dragAndDropBeta: prefs.dragAndDropBeta ?? false,
  };
  return saveToStorage(STORAGE_KEYS.USER_PREFS, toSave);
};

/**
 * Clear all game data (for reset functionality)
 */
export const clearAllGameData = (): boolean => {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    localStorage.removeItem(STORAGE_KEYS.GAME_STATS);
    localStorage.removeItem(STORAGE_KEYS.GAME_DATA);
    return true;
  } catch (error) {
    console.error('Failed to clear game data:', error);
    return false;
  }
};

/**
 * Export game data for sharing/backup
 */
export const exportGameData = (): string => {
  const stats = getGameStats();
  const gameData = getGameData();
  const prefs = getUserPreferences();

  const exportData = {
    stats,
    gameData,
    prefs,
    exportDate: new Date().toISOString(),
    version: '2.0',
  };

  return JSON.stringify(exportData, null, 2);
};

/**
 * Import game data from backup
 */
export const importGameData = (jsonData: string): boolean => {
  try {
    const importData = JSON.parse(jsonData);

    if (importData.stats) {
      const stats = normalizeImportedStats(importData.stats);
      saveGameStats(stats);
    }

    if (importData.gameData) {
      if ('history' in importData.gameData) {
        const incoming = importData.gameData as Partial<GameData>;
        saveGameData({
          lastSelectedDate: incoming.lastSelectedDate ?? '',
          history: incoming.history ?? {},
        });
      } else {
        const converted = convertLegacyGameData(importData.gameData as LegacyGameData);
        if (converted.lastSelectedDate || Object.keys(converted.history).length > 0) {
          saveGameData(converted);
        }
      }
    }

    if (importData.prefs) {
      saveUserPreferences(importData.prefs);
    }

    return true;
  } catch (error) {
    console.error('Failed to import game data:', error);
    return false;
  }
};
