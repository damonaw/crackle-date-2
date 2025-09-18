import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { useTheme } from './hooks/useTheme';
import GameHeader from './components/GameHeader';
import GameArea from './components/GameArea';

function App() {
  const { theme, isDarkMode, toggleDarkMode } = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
        margin: 0,
        padding: 0,
        width: '100%',
        overflowX: 'hidden'
      }}>
        <GameHeader isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

        <Box sx={{
          px: 2,
          py: 2,
          maxWidth: 'sm',
          mx: 'auto',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <GameArea />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;