import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  useTheme,
  alpha,
  Snackbar,
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
} from '@mui/material';
import { Backspace, Close, Menu, BarChart, Brightness4, Brightness7 } from '@mui/icons-material';
import { useGameStore } from '../stores/gameStore';
import { getDateDigits, getDigitsArray } from '../utils/dateUtils';
import { validateEquationInput, getInputHint } from '../utils/inputValidator';
import { validateEquation, type ValidationResult } from '../utils/mathValidator';
import { calculateScore, getScoreDescription } from '../utils/scoring';
import Stats from './Stats';

interface NYTGameCardProps {
  toggleDarkMode?: () => void;
}

const NYTGameCard: React.FC<NYTGameCardProps> = ({ toggleDarkMode }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const {
    currentDate,
    equation,
    setEquation,
    setValid,
    addSolution,
  } = useGameStore();

  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'game' | 'stats'>('game');

  const dateDigits = getDateDigits(currentDate);
  const digitsArray = getDigitsArray(dateDigits);

  // NYT-style colors
  const colors = {
    text: isDarkMode ? '#FFFFFF' : '#121213',
    textLight: isDarkMode ? '#818384' : '#787C7E',
    border: isDarkMode ? '#3A3A3C' : '#D3D6DA',
    borderLight: isDarkMode ? '#3A3A3C' : '#E4E4E7',
    success: '#6AAA64',
    warning: '#C9B458',
    error: '#787C7E',
    background: isDarkMode ? '#121213' : '#FFFFFF',
    surfaceLight: isDarkMode ? '#1A1A1B' : '#F7F7F7',
    hover: isDarkMode ? '#2C2C2E' : '#F0F0F0',
    keyBackground: isDarkMode ? '#818384' : '#D3D6DA',
    keyBackgroundHover: isDarkMode ? '#565758' : '#C5C8CE',
  };

  const addToEquation = (value: string) => {
    const validation = validateEquationInput(equation, value, currentDate);
    if (validation.isValid) {
      setEquation(equation + value);
    } else {
      if (/^\d$/.test(value)) {
        setSnackbarMessage(getInputHint(equation, currentDate));
        setSnackbarOpen(true);
      }
    }
  };

  const clearEquation = () => {
    setEquation('');
    setValidationResult(null);
  };

  const removeLastChar = () => {
    setEquation(equation.slice(0, -1));
  };

  const validateEquationHandler = () => {
    if (!equation) {
      setSnackbarMessage('Please build an equation first');
      setSnackbarOpen(true);
      return;
    }

    const result = validateEquation(equation, currentDate);
    setValidationResult(result);
    setValid(result.isValid);

    if (result.isValid) {
      const scoreValue = calculateScore(result);
      const description = getScoreDescription(scoreValue, result.complexity);
      addSolution(equation, scoreValue);
      setSnackbarMessage('🎉 ' + description);
      setSnackbarOpen(true);
    } else {
      setSnackbarMessage(result.error || 'Invalid equation');
      setSnackbarOpen(true);
    }
  };


  return (
    <>
      {currentPage === 'game' ? (
        <Box
      sx={{
        maxWidth: 500,
        mx: 'auto',
        px: 2,
        py: 3,
        backgroundColor: colors.background,
        minHeight: '100vh',
      }}
    >
      {/* Header - NYT Style */}
      <Box sx={{ position: 'relative', mb: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"NYT-Franklin", "Helvetica Neue", Arial, sans-serif',
              fontWeight: 700,
              letterSpacing: '-0.01em',
              color: colors.text,
              mb: 0.5,
            }}
          >
            Crackle Date
          </Typography>
          <Typography
            sx={{
              fontSize: '14px',
              color: colors.textLight,
              fontWeight: 400,
            }}
          >
            {currentDate}
          </Typography>
        </Box>
        <IconButton
          onClick={() => setMenuOpen(true)}
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            color: colors.text,
          }}
          aria-label="open menu"
        >
          <Menu />
        </IconButton>
      </Box>



      {/* Required Digits Display */}
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontSize: '11px',
            fontWeight: 600,
            color: colors.textLight,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            mb: 1,
            textAlign: 'center',
          }}
        >
          Use these digits in order
        </Typography>
        <Box display="flex" justifyContent="center" gap={0.5}>
          {digitsArray.map((digit, index) => {
            const usedDigits: number[] = [];
            const digitMatches = equation.match(/\d/g);
            if (digitMatches) {
              usedDigits.push(...digitMatches.map(d => parseInt(d)));
            }

            const nextExpectedIndex = usedDigits.length;
            const isThisPositionNext = index === nextExpectedIndex;
            const validation = validateEquationInput(equation, digit.toString(), currentDate);
            const isAllowed = validation.isValid && isThisPositionNext;
            const isUsed = index < nextExpectedIndex;

            return (
              <Button
                key={index}
                onClick={() => isAllowed && addToEquation(digit.toString())}
                disabled={isUsed || !isAllowed}
                sx={{
                  minWidth: 43,
                  height: 58,
                  fontSize: '20px',
                  fontWeight: 600,
                  backgroundColor: isUsed ? colors.success :
                                   isAllowed ? colors.keyBackground :
                                   colors.keyBackground,
                  color: isUsed ? '#FFFFFF' :
                         isAllowed ? colors.text :
                         colors.textLight,
                  border: 'none',
                  borderRadius: '4px',
                  opacity: isUsed ? 1 : isAllowed ? 1 : 0.5,
                  cursor: isUsed ? 'default' : isAllowed ? 'pointer' : 'not-allowed',
                  '&:hover': isAllowed && !isUsed ? {
                    backgroundColor: colors.keyBackgroundHover,
                  } : {},
                  textTransform: 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                {digit}
              </Button>
            );
          })}
        </Box>
      </Box>

      {/* Equation Display */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            border: `2px solid ${colors.text}`,
            borderRadius: '4px',
            p: 2,
            minHeight: 56,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: colors.background,
            position: 'relative',
          }}
        >
          <Typography
            sx={{
              fontSize: '24px',
              fontWeight: 600,
              fontFamily: 'monospace',
              color: colors.text,
              flexGrow: 1,
              minHeight: '1.5em',
            }}
          >
            {equation || (
              <span style={{ color: colors.textLight, fontSize: '16px' }}>
                Start with {digitsArray[0]}...
              </span>
            )}
          </Typography>
          {equation && (
            <IconButton
              onClick={removeLastChar}
              size="small"
              sx={{
                color: colors.text,
                '&:hover': {
                  backgroundColor: colors.hover,
                },
              }}
            >
              <Backspace fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Keyboard Layout - NYT Style */}
      <Box sx={{ mb: 2 }}>
        {/* Row 1: + - * / */}
        <Box display="flex" justifyContent="center" gap={0.5} mb={0.5}>
          {['+', '-', '*', '/'].map((key) => (
            <Button
              key={key}
              onClick={() => addToEquation(key)}
              sx={{
                minWidth: 60,
                height: 58,
                fontSize: '20px',
                fontWeight: 600,
                backgroundColor: colors.keyBackground,
                color: colors.text,
                border: 'none',
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: colors.keyBackgroundHover,
                },
                textTransform: 'none',
              }}
            >
              {key}
            </Button>
          ))}
        </Box>

        {/* Row 2: ^ % √ || */}
        <Box display="flex" justifyContent="center" gap={0.5} mb={0.5}>
          <Button
            onClick={() => addToEquation('^')}
            sx={{
              minWidth: 60,
              height: 58,
              fontSize: '20px',
              fontWeight: 600,
              backgroundColor: colors.keyBackground,
              color: colors.text,
              border: 'none',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: colors.keyBackgroundHover,
              },
              textTransform: 'none',
            }}
          >
            ^
          </Button>
          <Button
            onClick={() => addToEquation('%')}
            sx={{
              minWidth: 60,
              height: 58,
              fontSize: '20px',
              fontWeight: 600,
              backgroundColor: colors.keyBackground,
              color: colors.text,
              border: 'none',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: colors.keyBackgroundHover,
              },
              textTransform: 'none',
            }}
          >
            %
          </Button>
          <Button
            onClick={() => addToEquation('√')}
            sx={{
              minWidth: 60,
              height: 58,
              fontSize: '20px',
              fontWeight: 600,
              backgroundColor: colors.keyBackground,
              color: colors.text,
              border: 'none',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: colors.keyBackgroundHover,
              },
              textTransform: 'none',
            }}
          >
            √
          </Button>
          <Button
            onClick={() => addToEquation('|')}
            sx={{
              minWidth: 60,
              height: 58,
              fontSize: '20px',
              fontWeight: 600,
              backgroundColor: colors.keyBackground,
              color: colors.text,
              border: 'none',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: colors.keyBackgroundHover,
              },
              textTransform: 'none',
            }}
          >
            | |
          </Button>
        </Box>

        {/* Row 3: ( ) = */}
        <Box display="flex" justifyContent="center" gap={0.5} mb={0.5}>
          <Button
            onClick={() => addToEquation('(')}
            sx={{
              minWidth: 80,
              height: 58,
              fontSize: '20px',
              fontWeight: 600,
              backgroundColor: colors.keyBackground,
              color: colors.text,
              border: 'none',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: colors.keyBackgroundHover,
              },
              textTransform: 'none',
            }}
          >
            (
          </Button>
          <Button
            onClick={() => addToEquation(')')}
            sx={{
              minWidth: 80,
              height: 58,
              fontSize: '20px',
              fontWeight: 600,
              backgroundColor: colors.keyBackground,
              color: colors.text,
              border: 'none',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: colors.keyBackgroundHover,
              },
              textTransform: 'none',
            }}
          >
            )
          </Button>
          <Button
            onClick={() => addToEquation('=')}
            disabled={equation.includes('=')}
            sx={{
              minWidth: 80,
              height: 58,
              fontSize: '20px',
              fontWeight: 600,
              backgroundColor: colors.keyBackground,
              color: colors.text,
              border: 'none',
              borderRadius: '4px',
              opacity: equation.includes('=') ? 0.5 : 1,
              '&:hover': {
                backgroundColor: equation.includes('=') ? colors.keyBackground : colors.keyBackgroundHover,
              },
              textTransform: 'none',
              cursor: equation.includes('=') ? 'not-allowed' : 'pointer',
            }}
          >
            =
          </Button>
        </Box>

        {/* Row 4: space clear enter */}
        <Box display="flex" justifyContent="center" gap={0.5}>
          <Button
            onClick={() => addToEquation(' ')}
            sx={{
              minWidth: 80,
              height: 58,
              fontSize: '12px',
              fontWeight: 600,
              backgroundColor: colors.keyBackground,
              color: colors.text,
              border: 'none',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: colors.keyBackgroundHover,
              },
              textTransform: 'none',
            }}
          >
            space
          </Button>
          <Button
            onClick={clearEquation}
            sx={{
              minWidth: 80,
              height: 58,
              fontSize: '12px',
              fontWeight: 600,
              backgroundColor: colors.keyBackground,
              color: colors.text,
              border: 'none',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: colors.keyBackgroundHover,
              },
              textTransform: 'none',
            }}
          >
            clear
          </Button>
          <Button
            onClick={validateEquationHandler}
            sx={{
              minWidth: 80,
              height: 58,
              fontSize: '12px',
              fontWeight: 700,
              backgroundColor: colors.success,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: alpha(colors.success, 0.9),
              },
              textTransform: 'lowercase',
            }}
          >
            enter
          </Button>
        </Box>
      </Box>

      {/* Help Text */}
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography sx={{ fontSize: '12px', color: colors.textLight }}>
          Type freely • Invalid characters filtered • Press Enter to check
        </Typography>
      </Box>

      {/* Snackbar for messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          '& .MuiSnackbarContent-root': {
            backgroundColor: validationResult?.isValid ? colors.success : colors.error,
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: 500,
            borderRadius: '4px',
          }
        }}
        message={snackbarMessage}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setSnackbarOpen(false)}
          >
            <Close fontSize="small" />
          </IconButton>
        }
          />
        </Box>
      ) : (
        <Stats onBack={() => setCurrentPage('game')} />
      )}

      {/* Hamburger Menu Drawer */}
      <Drawer
        anchor="right"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            backgroundColor: colors.background,
            borderLeft: `1px solid ${colors.borderLight}`,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: colors.text,
              mb: 2,
            }}
          >
            Menu
          </Typography>
          
          <List sx={{ p: 0 }}>
            <ListItemButton
              onClick={() => {
                setCurrentPage('game');
                setMenuOpen(false);
              }}
              sx={{
                borderRadius: '8px',
                mb: 1,
                backgroundColor: currentPage === 'game' ? colors.hover : 'transparent',
              }}
            >
              <ListItemIcon>
                <Menu sx={{ color: colors.text }} />
              </ListItemIcon>
              <ListItemText 
                primary="Game" 
                sx={{ 
                  '& .MuiListItemText-primary': { 
                    color: colors.text,
                    fontWeight: currentPage === 'game' ? 600 : 400,
                  } 
                }} 
              />
            </ListItemButton>
            
            <ListItemButton
              onClick={() => {
                setCurrentPage('stats');
                setMenuOpen(false);
              }}
              sx={{
                borderRadius: '8px',
                mb: 1,
                backgroundColor: currentPage === 'stats' ? colors.hover : 'transparent',
              }}
            >
              <ListItemIcon>
                <BarChart sx={{ color: colors.text }} />
              </ListItemIcon>
              <ListItemText 
                primary="Stats" 
                sx={{ 
                  '& .MuiListItemText-primary': { 
                    color: colors.text,
                    fontWeight: currentPage === 'stats' ? 600 : 400,
                  } 
                }} 
              />
            </ListItemButton>
            
            <Divider sx={{ my: 2, borderColor: colors.borderLight }} />
            
            <ListItemButton
              onClick={() => {
                toggleDarkMode?.();
              }}
              sx={{
                borderRadius: '8px',
              }}
            >
              <ListItemIcon>
                {isDarkMode ? (
                  <Brightness7 sx={{ color: colors.text }} />
                ) : (
                  <Brightness4 sx={{ color: colors.text }} />
                )}
              </ListItemIcon>
              <ListItemText 
                primary={isDarkMode ? 'Light Mode' : 'Dark Mode'}
                sx={{ 
                  '& .MuiListItemText-primary': { 
                    color: colors.text,
                  } 
                }} 
              />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default NYTGameCard;