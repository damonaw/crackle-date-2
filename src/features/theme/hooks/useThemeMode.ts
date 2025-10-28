import { useEffect, useMemo, useState } from 'react';
import { useGameStore } from '../../game/state/game-store';
import type { ThemeMode } from '../../game/lib/localStorage';

const THEME_SEQUENCE: ThemeMode[] = ['system', 'light', 'dark'];

const getSystemPrefersDark = () => {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export function useThemeMode() {
  const themeMode = useGameStore((state) => state.themeMode);
  const setThemeMode = useGameStore((state) => state.setThemeMode);
  const cycleThemeMode = useGameStore((state) => state.cycleThemeMode);
  const [systemPrefersDark, setSystemPrefersDark] = useState(getSystemPrefersDark);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (event: MediaQueryListEvent) => setSystemPrefersDark(event.matches);

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const resolvedMode: Exclude<ThemeMode, 'system'> =
    themeMode === 'system' ? (systemPrefersDark ? 'dark' : 'light') : themeMode;

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }
    const root = document.documentElement;
    root.dataset.theme = resolvedMode;
    root.style.colorScheme = resolvedMode;
  }, [resolvedMode]);

  const nextThemeMode = useMemo(() => {
    const currentIndex = THEME_SEQUENCE.indexOf(themeMode);
    return THEME_SEQUENCE[(currentIndex + 1) % THEME_SEQUENCE.length];
  }, [themeMode]);

  return {
    themeMode,
    resolvedMode,
    setThemeMode,
    cycleThemeMode,
    nextThemeMode,
  };
}
