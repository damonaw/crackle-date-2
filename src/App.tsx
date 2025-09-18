import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { GlobalStyles } from '@mui/material';
import { useTheme } from './hooks/useTheme';
import CrackleDateCard from './components/CrackleDateCard';

function App() {
  const { theme } = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={{
        ':root': {
          '--cd-logo-shadow': theme.palette.mode === 'dark'
            ? 'rgba(100,108,255,0.67)'
            : 'rgba(100,108,255,0.67)',
          '--cd-react-shadow': theme.palette.mode === 'dark'
            ? 'rgba(97,218,251,0.67)'
            : 'rgba(97,218,251,0.67)',
          '--cd-muted-text': theme.palette.text.secondary,
        },
      }} />
      <Box sx={{
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        margin: 0,
        padding: 0,
        width: '100%',
        overflowX: 'hidden',
      }}>
        <CrackleDateCard />
      </Box>
    </ThemeProvider>
  );
}

export default App;