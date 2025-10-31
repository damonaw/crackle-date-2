import { create } from 'zustand';
import type { ComplexityLevel, GameState } from '../types';
import { getTodaysGameDate, getRecentGameDates, parseGameDate } from '../lib/dateUtils';
import {
  getGameData,
  saveGameData,
  getGameStats,
  updateGameStats,
  getUserPreferences,
  saveUserPreferences,
  type GameStats,
  type ThemeMode,
  type StoredDayState,
} from '../lib/localStorage';
import { evaluateAchievements } from '../lib/achievements';

interface GameStore extends GameState {
  setEquation: (equation: string) => void;
  setValid: (isValid: boolean) => void;
  addSolution: (equation: string, score: number, complexity: ComplexityLevel) => void;
  resetGame: () => void;
  setScore: (score: number) => void;
  gameStats: GameStats;
  updateStats: (won: boolean, score: number, isFirstSolutionOfDay: boolean) => void;
  loadGameState: () => void;
  saveGameState: () => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  cycleThemeMode: () => void;
  selectDate: (date: string) => void;
  tutorialSeen: boolean;
  markTutorialComplete: () => void;
  incrementWrongAttempts: () => void;
  startTimer: () => void;
  setEasyMode: (enabled: boolean) => void;
}

const RECENT_DATES_TO_SHOW = 7;

const initialDate = getTodaysGameDate();

const initialState: GameState = {
  currentDate: initialDate,
  equation: '',
  isValid: false,
  score: 0,
  streak: 0,
  solutions: [],
  availableDates: [initialDate],
  achievements: [],
  wrongAttempts: 0,
  startTime: null,
  easyMode: false,
};

const sortDatesDesc = (dates: string[]): string[] =>
  Array.from(new Set(dates)).sort(
    (a, b) => parseGameDate(b).getTime() - parseGameDate(a).getTime()
  );

const buildAvailableDates = (
  history: Record<string, StoredDayState>,
  currentDate: string
): string[] =>
  sortDatesDesc([
    ...getRecentGameDates(RECENT_DATES_TO_SHOW),
    ...Object.keys(history),
    currentDate,
  ]);

const hydrateDayState = (dayState?: StoredDayState) => {
  const solutions = dayState
    ? dayState.solutions.map((stored) => ({
        equation: stored.equation,
        score: stored.score,
        timestamp: new Date(stored.timestamp),
        complexity: stored.complexity ?? 'simple',
        timeToSolve: stored.timeToSolve,
        wrongAttempts: stored.wrongAttempts,
      }))
    : [];

  const score = solutions.reduce((total, sol) => total + sol.score, 0);

  return {
    equation: dayState?.equation ?? '',
    solutions,
    isValid: dayState?.isValid ?? false,
    wrongAttempts: dayState?.wrongAttempts ?? 0,
    startTime: dayState?.startTime ?? null,
    score,
  };
};

const THEME_SEQUENCE: ThemeMode[] = ['system', 'light', 'dark'];

export const useGameStore = create<GameStore>((set, get) => {
  const stats = getGameStats();
  const prefs = getUserPreferences();

  return {
    ...initialState,
    availableDates: buildAvailableDates({}, initialState.currentDate),
    achievements: evaluateAchievements(stats),
    gameStats: stats,
    themeMode: prefs.themeMode ?? 'system',
    tutorialSeen: prefs.tutorialSeen ?? false,
    easyMode: prefs.easyMode ?? false,
    streak: stats.currentStreak,

    setEquation: (equation: string) => {
      set({ equation });
      // Start timer on first equation input
      const state = get();
      if (!state.startTime && equation.length > 0) {
        set({ startTime: Date.now() });
      }
      setTimeout(() => get().saveGameState(), 100);
    },

    setValid: (isValid: boolean) => {
      set({ isValid });
    },

    addSolution: (equation: string, score: number, complexity: ComplexityLevel) => {
      const state = get();
      const wasEmpty = state.solutions.length === 0;
      const timeToSolve = state.startTime
        ? Math.floor((Date.now() - state.startTime) / 1000)
        : undefined;
      const newSolution = {
        equation,
        score,
        timestamp: new Date(),
        complexity,
        timeToSolve,
        wrongAttempts: state.wrongAttempts,
      };

      set((currentState) => ({
        solutions: [...currentState.solutions, newSolution],
        score: currentState.score + score,
        availableDates: sortDatesDesc([...currentState.availableDates, currentState.currentDate]),
        wrongAttempts: 0,
        startTime: null,
      }));

      get().updateStats(true, score, wasEmpty);
      get().saveGameState();
    },

    setScore: (score: number) => {
      set({ score });
    },

    updateStats: (won: boolean, score: number, isFirstSolutionOfDay: boolean) => {
      const updatedStats = updateGameStats(won, score, get().currentDate, isFirstSolutionOfDay);
      set({
        gameStats: updatedStats,
        streak: updatedStats.currentStreak,
        achievements: evaluateAchievements(updatedStats),
      });
    },

    resetGame: () => {
      const todaysDate = getTodaysGameDate();
      set((state) => ({
        ...state,
        currentDate: todaysDate,
        equation: '',
        isValid: false,
        score: 0,
        solutions: [],
        wrongAttempts: 0,
        startTime: null,
        availableDates: sortDatesDesc([...state.availableDates, todaysDate]),
        streak: state.gameStats.currentStreak,
      }));
      get().saveGameState();
    },

    loadGameState: () => {
      const statsSnapshot = getGameStats();
      const prefsSnapshot = getUserPreferences();
      const todaysDate = getTodaysGameDate();
      const savedGame = getGameData();
      const history = savedGame?.history ?? {};
      const desiredDate = savedGame?.lastSelectedDate || todaysDate;
      const currentDate = history[desiredDate] ? desiredDate : todaysDate;
      const hydrated = hydrateDayState(history[currentDate]);

      set({
        currentDate,
        equation: hydrated.equation,
        solutions: hydrated.solutions,
        isValid: hydrated.isValid,
        score: hydrated.score,
        wrongAttempts: hydrated.wrongAttempts,
        startTime: hydrated.startTime,
        availableDates: buildAvailableDates(history, currentDate),
        gameStats: statsSnapshot,
        streak: statsSnapshot.currentStreak,
        achievements: evaluateAchievements(statsSnapshot),
        themeMode: prefsSnapshot.themeMode ?? 'system',
        tutorialSeen: prefsSnapshot.tutorialSeen ?? false,
        easyMode: prefsSnapshot.easyMode ?? false,
      });

      get().saveGameState();
    },

    saveGameState: () => {
      const state = get();
      const existing = getGameData() ?? { lastSelectedDate: state.currentDate, history: {} };
      const history = { ...existing.history };

      history[state.currentDate] = {
        equation: state.equation,
        solutions: state.solutions.map((sol) => ({
          equation: sol.equation,
          score: sol.score,
          timestamp: sol.timestamp.toISOString(),
          complexity: sol.complexity,
          timeToSolve: sol.timeToSolve,
          wrongAttempts: sol.wrongAttempts,
        })),
        isValid: state.isValid,
        completed: state.solutions.length > 0,
        wrongAttempts: state.wrongAttempts,
        startTime: state.startTime,
      };

      saveGameData({
        lastSelectedDate: state.currentDate,
        history,
      });
    },

    setThemeMode: (mode: ThemeMode) => {
      set({ themeMode: mode });
      const prefsSnapshot = getUserPreferences();
      saveUserPreferences({ ...prefsSnapshot, themeMode: mode });
    },

    cycleThemeMode: () => {
      const current = get().themeMode;
      const index = THEME_SEQUENCE.indexOf(current);
      const next = THEME_SEQUENCE[(index + 1) % THEME_SEQUENCE.length];
      get().setThemeMode(next);
    },

    selectDate: (date: string) => {
      const savedGame = getGameData();
      const history = savedGame?.history ?? {};
      const hydrated = hydrateDayState(history[date]);

      set({
        currentDate: date,
        equation: hydrated.equation,
        solutions: hydrated.solutions,
        isValid: hydrated.isValid,
        score: hydrated.score,
        wrongAttempts: hydrated.wrongAttempts,
        startTime: hydrated.startTime,
        availableDates: buildAvailableDates(history, date),
      });

      get().saveGameState();
    },

    markTutorialComplete: () => {
      if (get().tutorialSeen) {
        return;
      }
      set({ tutorialSeen: true });
      const prefsSnapshot = getUserPreferences();
      saveUserPreferences({ ...prefsSnapshot, tutorialSeen: true });
    },

    incrementWrongAttempts: () => {
      set((state) => ({ wrongAttempts: state.wrongAttempts + 1 }));
      get().saveGameState();
    },

    startTimer: () => {
      const state = get();
      if (!state.startTime) {
        set({ startTime: Date.now() });
        get().saveGameState();
      }
    },

    setEasyMode: (enabled: boolean) => {
      set({ easyMode: enabled });
      const prefsSnapshot = getUserPreferences();
      saveUserPreferences({ ...prefsSnapshot, easyMode: enabled });
    },
  };
});
