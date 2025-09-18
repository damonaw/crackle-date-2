import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { useTheme } from './hooks/useTheme';
import NYTGameCard from './components/NYTGameCard';

function App() {
  const { theme, isDarkMode, toggleDarkMode } = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        minHeight: '100vh',
        backgroundColor: isDarkMode ? '#121213' : '#FFFFFF',
        margin: 0,
        padding: 0,
        width: '100%',
        overflowX: 'hidden',
      }}>
        <NYTGameCard toggleDarkMode={toggleDarkMode} />
      </Box>
    </ThemeProvider>
  );
}

export default App;