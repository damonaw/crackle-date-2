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
}

export interface GameData {
  currentDate: string;
  equation: string;
  solutions: Array<{
    equation: string;
    score: number;
    timestamp: string;
  }>;
  isValid: boolean;
  completedToday: boolean;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface UserPreferences {
  darkMode: boolean; // legacy; kept for backward compatibility
  soundEnabled: boolean;
  themeMode?: ThemeMode; // new preferred field
}

const STORAGE_KEYS = {
  GAME_STATS: 'crackle-date-stats',
  GAME_DATA: 'crackle-date-game',
  USER_PREFS: 'crackle-date-prefs',
} as const;

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
  };

  return loadFromStorage(STORAGE_KEYS.GAME_STATS, defaultStats);
};

export const saveGameStats = (stats: GameStats): boolean => {
  // Recalculate win percentage
  stats.winPercentage = stats.gamesPlayed > 0 ? (stats.gamesWon / stats.gamesPlayed) * 100 : 0;

  return saveToStorage(STORAGE_KEYS.GAME_STATS, stats);
};

export const updateGameStats = (won: boolean, score: number, date: string): GameStats => {
  const stats = getGameStats();

  // Update basic counts
  stats.gamesPlayed += 1;
  if (won) {
    stats.gamesWon += 1;
  }

  // Update streaks
  if (won) {
    stats.currentStreak += 1;
    stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
  } else {
    stats.currentStreak = 0;
  }

  // Update score distribution
  if (won) {
    const scoreKey = score.toString();
    stats.scoreDistribution[scoreKey] = (stats.scoreDistribution[scoreKey] || 0) + 1;

    // Recalculate average score
    const totalScores = Object.entries(stats.scoreDistribution).reduce(
      (sum, [scoreStr, count]) => sum + parseInt(scoreStr) * count,
      0
    );
    stats.averageScore = totalScores / stats.gamesWon;
  }

  // Update last played date
  stats.lastPlayedDate = date;

  // Save updated stats
  saveGameStats(stats);

  return stats;
};

/**
 * Game Data Management
 */
export const getGameData = (): GameData | null => {
  const defaultData: GameData = {
    currentDate: '',
    equation: '',
    solutions: [],
    isValid: false,
    completedToday: false,
  };

  const data = loadFromStorage(STORAGE_KEYS.GAME_DATA, defaultData);

  // Return null if no valid data exists
  if (!data.currentDate) {
    return null;
  }

  return data;
};

export const saveGameData = (gameData: GameData): boolean => {
  return saveToStorage(STORAGE_KEYS.GAME_DATA, gameData);
};

/**
 * User Preferences Management
 */
export const getUserPreferences = (): UserPreferences => {
  const defaultPrefs: UserPreferences = {
    darkMode: false,
    soundEnabled: true,
    themeMode: 'system',
  };

  const prefs = loadFromStorage(STORAGE_KEYS.USER_PREFS, defaultPrefs);
  if (!prefs.themeMode) {
    // Derive themeMode from legacy darkMode if missing
    prefs.themeMode = prefs.darkMode ? 'dark' : 'light';
  }
  return prefs;
};

export const saveUserPreferences = (prefs: UserPreferences): boolean => {
  // Keep legacy darkMode flag in sync for older versions
  const toSave = {
    ...prefs,
    darkMode: prefs.themeMode ? prefs.themeMode === 'dark' : prefs.darkMode,
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
    version: '1.0',
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
      saveGameStats(importData.stats);
    }

    if (importData.gameData) {
      saveGameData(importData.gameData);
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
