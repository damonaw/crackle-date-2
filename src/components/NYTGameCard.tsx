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
import { Backspace, Close, Menu, BarChart, Brightness4, Brightness7, Calculate } from '@mui/icons-material';
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
    loadGameState,
    toggleDarkMode: storeToggleDarkMode,
  } = useGameStore();

  // Load game state on component mount
  React.useEffect(() => {
    loadGameState();
  }, [loadGameState]);

  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'game' | 'stats'>('game');

  const dateDigits = getDateDigits(currentDate);
  const digitsArray = getDigitsArray(dateDigits);

  // NYT-style colors
  // Operator button configuration
  const operatorRows = [
    { operators: ['+', '-', '*', '/'], labels: ['+', '-', 'x', '/'], buttonsPerRow: 4 },
    { operators: ['^', '%', 'sqrt(', 'abs('], labels: ['^', '%', '√', '||'], buttonsPerRow: 4 },
    { operators: ['(', ')', '!', '='], buttonsPerRow: 4 },
  ];

  // Calculate dynamic button sizes for perfect alignment
  const clearSubmitWidth = 304; // 2 × 140px + 24px gap
  const standardGap = 8; // gap={1} = 8px
  
  const getButtonWidth = (buttonsPerRow: number) => {
    const totalGapWidth = (buttonsPerRow - 1) * standardGap;
    return (clearSubmitWidth - totalGapWidth) / buttonsPerRow;
  };

  // Standard operator button styles
  const getOperatorButtonStyles = (buttonsPerRow: number, isDisabled: boolean = false) => ({
    minWidth: getButtonWidth(buttonsPerRow),
    minHeight: 64,
    fontSize: '24px',
    fontWeight: 700,
    letterSpacing: '0.5px',
    backgroundColor: isDisabled ? (isDarkMode ? '#3A3A3C' : '#E4E4E7') : colors.keyBackground,
    color: isDisabled ? (isDarkMode ? '#9CA3AF' : '#6B7280') : colors.text,
    border: 'none',
    borderRadius: '8px',
    boxShadow: 'none',
    opacity: isDisabled ? 0.5 : 1,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    '&:hover': !isDisabled ? {
      backgroundColor: colors.keyBackgroundHover,
      boxShadow: `0 2px 8px ${alpha(colors.text, 0.15)}`,
      transform: 'translateY(-1px)',
    } : {},
    '&:active': !isDisabled ? {
      transform: 'translateY(0px)',
      boxShadow: `0 1px 4px ${alpha(colors.text, 0.1)}`,
    } : {},
    '&.Mui-disabled': {
      color: isDarkMode ? alpha(colors.text, 0.5) : alpha(colors.text, 0.4),
      backgroundColor: isDarkMode ? '#3A3A3C' : '#E4E4E7',
    },
    textTransform: 'none',
    transition: 'all 0.2s ease',
  });

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
    // Handle multi-character operations (sqrt, abs) directly
    if (value === 'sqrt(' || value === 'abs(') {
      setEquation(equation + value);
      return;
    }
    
    // For single characters, use the existing validation
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

  // Check if equation is ready for submission (all date digits used + equals sign + digits on both sides)
  const isEquationReadyForSubmission = () => {
    if (!equation.includes('=') || !equation.trim()) {
      return false;
    }

    // Split equation by equals sign
    const parts = equation.split('=');
    if (parts.length !== 2) {
      return false; // Should have exactly one equals sign
    }

    const leftSide = parts[0].trim();
    const rightSide = parts[1].trim();

    // Check if both sides have digits
    const leftDigits = leftSide.match(/\d/g) || [];
    const rightDigits = rightSide.match(/\d/g) || [];

    if (leftDigits.length === 0 || rightDigits.length === 0) {
      return false; // Must have digits on both sides
    }

    // Extract all digits from the equation
    const usedDigits = equation.match(/\d/g) || [];
    
    // Check if all date digits are used exactly once in order
    if (usedDigits.length !== digitsArray.length) {
      return false;
    }

    // Verify each digit matches the expected order
    for (let i = 0; i < digitsArray.length; i++) {
      if (parseInt(usedDigits[i]) !== digitsArray[i]) {
        return false;
      }
    }

    return true;
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
    <React.Fragment>
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
          tabIndex={0}
          onKeyDown={e => {
            // Handle keyboard input for typing directly into equation
            if (e.key === 'Enter') {
              e.preventDefault();
              if (isEquationReadyForSubmission()) {
                validateEquationHandler();
              } else {
                setSnackbarMessage('Equation is not ready for submission.');
                setSnackbarOpen(true);
              }
              return;
            }
            
            if (e.key === 'Backspace') {
              e.preventDefault();
              if (equation.length > 0) {
                setEquation(equation.slice(0, -1));
              }
              return;
            }
            
            // Ignore modifier keys
            if (['Shift', 'Control', 'Alt', 'Meta', 'Tab', 'CapsLock', 'Escape'].includes(e.key)) {
              return;
            }
            
            // Allow only valid characters
            const allowedRegex = /^[0-9+\-*/^%()= x!sqrtab]$/;
            if (!allowedRegex.test(e.key)) {
              setSnackbarMessage('Only digits and math operators are allowed.');
              setSnackbarOpen(true);
              return;
            }
            
            e.preventDefault();
            const newValue = equation + e.key;
            
            // Allow only digits and math operators (no letters)
            const fullAllowedRegex = /^[0-9+\-*/^%()= x!sqrtab]*$/;
            if (!fullAllowedRegex.test(newValue)) {
              setSnackbarMessage('Only use digits and math operators.');
              setSnackbarOpen(true);
              return;
            }
            
            // Enforce digit order and only allow each digit once
            const usedDigits = newValue.match(/\d/g) || [];
            for (let i = 0; i < usedDigits.length; i++) {
              if (usedDigits[i] !== digitsArray[i].toString()) {
                setSnackbarMessage('Use the date digits in order.');
                setSnackbarOpen(true);
                return;
              }
            }
            if (usedDigits.length > digitsArray.length) {
              setSnackbarMessage('You have used too many digits.');
              setSnackbarOpen(true);
              return;
            }
            
            setEquation(newValue);
          }}
        >
          {/* Header - NYT Style */}
          <Box sx={{ position: 'relative', mb: 4 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ position: 'fixed', top: 0, left: 0, width: '100vw', zIndex: 100, mb: 0.5, px: 2, py: 1, borderRadius: 0, backgroundColor: theme.palette.mode === 'dark' ? '#222' : '#e3e6ee' }}>
              <Box display="flex" alignItems="center">
                <Calculate sx={{ fontSize: 36, mr: 1 }} />
                <Typography variant="h5" component="h1" fontWeight={700} letterSpacing={2} sx={{ fontSize: 32 }}>
                  Crackle Date
                </Typography>
              </Box>
              <IconButton onClick={() => setMenuOpen(true)} sx={{ ml: 2 }}>
                <Menu sx={{ fontSize: 32 }} />
              </IconButton>
            </Box>
          </Box>

          {/* Main Body Section */}
          <Box sx={{ mt: 8 }}>
            <Typography variant="subtitle1" sx={{ textAlign: 'center', width: '100%', fontSize: 24, fontWeight: 600, mb: 1 }}>
              {currentDate.replace(/-/g, '/')}
            </Typography>



            {/* Required Digits Display */}
            <Box sx={{ mb: 3 }}>
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

                  // Dynamic button sizing for mobile-first design
                  const totalButtons = digitsArray.length;

                  return (
                    <Button
                      key={index}
                      onClick={() => isAllowed && addToEquation(digit.toString())}
                      disabled={isUsed || !isAllowed}
                      sx={{
                        flex: `1 1 0%`,
                        maxWidth: 64,
                        minWidth: 32,
                        width: '100%',
                        minHeight: 64,
                        fontSize: totalButtons > 7 ? '18px' : '20px', // Smaller font for longer dates
                        fontWeight: 700,
                        letterSpacing: '0.5px',
                        backgroundColor: isUsed ? colors.success :
                                         isAllowed ? colors.keyBackground :
                                         isDarkMode ? '#3A3A3C' : '#E4E4E7',
                        color: isUsed ? '#FFFFFF' :
                               isAllowed ? colors.text :
                               isDarkMode ? '#9CA3AF' : '#6B7280',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: isUsed ? `0 2px 8px ${alpha(colors.success, 0.3)}` :
                                   isAllowed ? 'none' :
                                   'none',
                        opacity: isUsed ? 1 : isAllowed ? 1 : 0.5,
                        cursor: isUsed ? 'default' : isAllowed ? 'pointer' : 'not-allowed',
                        '&:hover': isAllowed && !isUsed ? {
                          backgroundColor: colors.keyBackgroundHover,
                          boxShadow: `0 2px 8px ${alpha(colors.text, 0.15)}`,
                          transform: 'translateY(-1px)',
                        } : {},
                        '&:active': isAllowed && !isUsed ? {
                          transform: 'translateY(0px)',
                          boxShadow: `0 1px 4px ${alpha(colors.text, 0.1)}`,
                        } : {},
                        textTransform: 'none',
                        transition: 'all 0.2s ease',
                        '&.Mui-disabled': {
                          color: isUsed ? '#FFFFFF' : isDarkMode ? '#9CA3AF' : '#6B7280',
                          backgroundColor: isUsed ? colors.success : isDarkMode ? '#3A3A3C' : '#E4E4E7',
                        },
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
                  backgroundColor: colors.surfaceLight,
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
                    <span style={{ color: colors.textLight, fontSize: '24px' }}>
                      Input your equation
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
              {/* Dynamic Operator Rows */}
              {operatorRows.map((row, rowIndex) => (
                <Box key={rowIndex} display="flex" justifyContent="center" gap={1} mb={1}>
                  {row.operators.map((operator, opIndex) => {
                    const label = row.labels ? row.labels[opIndex] : operator;
                    const isEqualsButton = operator === '=';
                    const isDisabled = isEqualsButton && equation.includes('=');
                    
                    return (
                      <Button
                        key={operator}
                        onClick={() => addToEquation(operator)}
                        disabled={isDisabled}
                        sx={getOperatorButtonStyles(row.buttonsPerRow, isDisabled)}
                      >
                        {label}
                      </Button>
                    );
                  })}
                </Box>
              ))}

              {/* Row 4: clear submit */}
              <Box display="flex" justifyContent="center" gap={3} sx={{ mt: 3 }}>
                <Button
                  onClick={clearEquation}
                  sx={{
                    minWidth: 140,
                    minHeight: 64,
                    fontSize: '16px',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    backgroundColor: colors.keyBackground,
                    color: colors.text,
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: colors.keyBackgroundHover,
                      boxShadow: `0 2px 8px ${alpha(colors.text, 0.15)}`,
                      transform: 'translateY(-1px)',
                    },
                    '&:active': {
                      transform: 'translateY(0px)',
                      boxShadow: `0 1px 4px ${alpha(colors.text, 0.1)}`,
                    },
                    textTransform: 'uppercase',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Clear
                </Button>
                <Button
                  onClick={validateEquationHandler}
                  disabled={!isEquationReadyForSubmission()}
                  sx={{
                    minWidth: 140,
                    minHeight: 64,
                    fontSize: '16px',
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                    backgroundColor: colors.success,
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: `0 2px 8px ${alpha(colors.success, 0.3)}`,
                    '&:hover': {
                      backgroundColor: alpha(colors.success, 0.9),
                      boxShadow: `0 4px 12px ${alpha(colors.success, 0.4)}`,
                      transform: 'translateY(-2px)',
                    },
                    '&:active': {
                      transform: 'translateY(-1px)',
                      boxShadow: `0 2px 8px ${alpha(colors.success, 0.3)}`,
                    },
                    '&.Mui-disabled': {
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? alpha(colors.surfaceLight, 0.6) 
                        : alpha(colors.text, 0.1),
                      color: theme.palette.mode === 'dark' 
                        ? alpha(colors.text, 0.5) 
                        : alpha(colors.text, 0.4),
                      boxShadow: 'none',
                    },
                    textTransform: 'uppercase',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Submit
                </Button>
              </Box>
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
                storeToggleDarkMode();
                toggleDarkMode?.(); // Call parent toggle if provided
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
    </React.Fragment>
  );
};

export default NYTGameCard;