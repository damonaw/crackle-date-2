
import { createTheme, type Theme } from '@mui/material/styles';
import { useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';

export const useTheme = () => {
  const themeMode = useGameStore((s) => s.themeMode);
  const setThemeMode = useGameStore((s) => s.setThemeMode);
  const toggleDarkMode = useGameStore((s) => s.toggleDarkMode);

  // Resolve system preference if needed
  const prefersDark = typeof window !== 'undefined'
    ? window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    : false;
  const isDarkMode = themeMode === 'system' ? prefersDark : themeMode === 'dark';

  // Keep reacting to system changes when in system mode
  useEffect(() => {
    if (themeMode !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => setThemeMode('system');
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, [themeMode, setThemeMode]);

  const theme: Theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: isDarkMode ? '#BB86FC' : '#6200EE',
        light: isDarkMode ? '#E1BEE7' : '#B388FF',
        dark: isDarkMode ? '#9C64E8' : '#3700B3',
      },
      secondary: {
        main: isDarkMode ? '#03DAC6' : '#018786',
        light: isDarkMode ? '#66FFF9' : '#03DAC5',
        dark: isDarkMode ? '#00A896' : '#00574B',
      },
      background: {
        default: isDarkMode ? '#121212' : '#FAFAFA',
        paper: isDarkMode ? '#1E1E1E' : '#FFFFFF',
      },
      success: {
        main: isDarkMode ? '#4CAF50' : '#00C853',
      },
      warning: {
        main: isDarkMode ? '#FF9800' : '#FF6D00',
      },
      error: {
        main: '#CF6679',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica Neue", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 600,
      },
      h3: {
        fontWeight: 600,
      },
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
            fontWeight: 600,
            padding: '8px 16px',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  });

  return {
    theme,
    isDarkMode,
    toggleDarkMode,
    themeMode,
    setThemeMode,
  };
};