import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  alpha,
  Snackbar,
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import {
  Backspace,
  Close,
  Menu,
  BarChart,
  Calculate,
  LightMode,
  DarkMode,
  SettingsBrightness,
} from '@mui/icons-material';
import { useGameStore } from '../stores/gameStore';
import { useTheme } from '../hooks/useTheme';
import { getDateDigits, getDigitsArray } from '../utils/dateUtils';
import { validateEquationInput, getInputHint } from '../utils/inputValidator';
import { validateEquation } from '../utils/mathValidator';
import { calculateScore, getScoreDescription } from '../utils/scoring';
import Stats from './Stats';

const CrackleDateCard: React.FC = () => {
  const { theme, themeMode, setThemeMode } = useTheme();

  const { currentDate, equation, setEquation, setValid, addSolution, loadGameState } =
    useGameStore();
  const score = useGameStore((s) => s.score);
  const streak = useGameStore((s) => s.streak);
  const solutions = useGameStore((s) => s.solutions);

  // Load game state on component mount
  React.useEffect(() => {
    loadGameState();
  }, [loadGameState]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('info');
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'game' | 'stats'>('game');

  const dateDigits = getDateDigits(currentDate);
  const digitsArray = getDigitsArray(dateDigits);

  // CrackleDate theme colors
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
    backgroundColor: isDisabled ? theme.palette.action.disabled : theme.palette.secondary.subtle,
    color: isDisabled ? theme.palette.text.disabled : theme.palette.text.primary,
    border: 'none',
    borderRadius: '8px',
    boxShadow: 'none',
    opacity: isDisabled ? 0.5 : 1,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    '&:hover': !isDisabled
      ? {
          backgroundColor: theme.palette.secondary.hover,
          boxShadow: `0 2px 8px ${alpha(theme.palette.secondary.main, 0.15)}`,
          transform: 'translateY(-1px)',
        }
      : {},
    '&:active': !isDisabled
      ? {
          transform: 'translateY(0px)',
          boxShadow: `0 1px 4px ${alpha(theme.palette.text.primary, 0.1)}`,
        }
      : {},
    '&.Mui-disabled': {
      color: theme.palette.text.disabled,
      backgroundColor: theme.palette.action.disabled,
    },
    textTransform: 'none',
    transition: 'all 0.2s ease',
  });

  // Use theme colors directly for better reactivity

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
        setSnackbarSeverity('info');
        setSnackbarMessage(getInputHint(equation, currentDate));
        setSnackbarOpen(true);
      }
    }
  };

  const clearEquation = () => {
    setEquation('');
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
      setSnackbarSeverity('info');
      setSnackbarMessage('Please build an equation first');
      setSnackbarOpen(true);
      return;
    }

    const result = validateEquation(equation, currentDate);
    setValid(result.isValid);

    if (result.isValid) {
      const scoreValue = calculateScore(result);
      const description = getScoreDescription(scoreValue, result.complexity);
      addSolution(equation, scoreValue);
      setSnackbarSeverity('success');
      setSnackbarMessage('🎉 ' + description);
      setSnackbarOpen(true);
    } else {
      setSnackbarSeverity('error');
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
            backgroundColor: theme.palette.background.default,
            minHeight: '100vh',
          }}
          tabIndex={0}
          onKeyDown={(e) => {
            // Handle keyboard input for typing directly into equation
            if (e.key === 'Enter') {
              e.preventDefault();
              if (isEquationReadyForSubmission()) {
                validateEquationHandler();
              } else {
                setSnackbarSeverity('info');
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

            if (['Shift', 'Control', 'Alt', 'Meta', 'Tab', 'CapsLock', 'Escape'].includes(e.key)) {
              return;
            }

            const mapKeyToToken = (key: string): string | null => {
              if (key === 'x' || key === 'X') return '*';
              if (key === 's' || key === 'S') return 'sqrt(';
              if (key === 'a' || key === 'A') return 'abs(';
              if (/^[0-9+\-*/^%()=!]{1}$/.test(key)) return key;
              return null;
            };

            const token = mapKeyToToken(e.key);
            if (!token) {
              setSnackbarSeverity('error');
              setSnackbarMessage('Only digits and math operators are allowed.');
              setSnackbarOpen(true);
              return;
            }

            e.preventDefault();

            if (/^\d$/.test(token)) {
              const usedDigits = (equation + token).match(/\d/g) || [];
              for (let i = 0; i < usedDigits.length; i++) {
                if (usedDigits[i] !== digitsArray[i].toString()) {
                  setSnackbarSeverity('error');
                  setSnackbarMessage('Use the date digits in order.');
                  setSnackbarOpen(true);
                  return;
                }
              }
              if (usedDigits.length > digitsArray.length) {
                setSnackbarSeverity('error');
                setSnackbarMessage('You have used too many digits.');
                setSnackbarOpen(true);
                return;
              }
            }

            addToEquation(token);
          }}
        >
          {/* Header - CrackleDate Style */}
          <Box sx={{ position: 'relative', mb: 4 }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                zIndex: 100,
                mb: 0.5,
                px: 2,
                py: 1.5,
                borderRadius: 0,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
                backdropFilter: 'blur(10px)',
                borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.15)}`,
              }}
            >
              <Box display="flex" alignItems="center">
                <Calculate
                  sx={{
                    fontSize: 36,
                    mr: 1,
                    color: theme.palette.common.white,
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                  }}
                />
                <Typography
                  variant="h5"
                  component="h1"
                  fontWeight={700}
                  letterSpacing={2}
                  sx={{
                    fontSize: 32,
                    color: theme.palette.common.white,
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    background: `linear-gradient(45deg, ${theme.palette.common.white} 0%, ${alpha(theme.palette.common.white, 0.9)} 100%)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Crackle Date
                </Typography>
              </Box>
              <IconButton
                onClick={() => setMenuOpen(true)}
                sx={{
                  ml: 2,
                  color: theme.palette.common.white,
                  backgroundColor: alpha(theme.palette.common.white, 0.1),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.common.white, 0.2),
                  },
                }}
                aria-label="menu"
              >
                <Menu
                  sx={{
                    fontSize: 32,
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
                  }}
                />
              </IconButton>
            </Box>
          </Box>

          {/* Date Digits */}
          <Box sx={{ mt: 8, mb: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{ textAlign: 'center', color: theme.palette.text.secondary, mb: 1 }}
            >
              {currentDate}
            </Typography>
            <Box display="flex" justifyContent="center" gap={1} mb={3}>
              {(() => {
                const usedCount = (equation.match(/\d/g) || []).length;
                const totalButtons = digitsArray.length;
                return digitsArray.map((digit, index) => {
                  const nextExpectedIndex = usedCount;
                  const isUsed = index < nextExpectedIndex;
                  const isAllowed = index === nextExpectedIndex;
                  return (
                    <Button
                      key={index}
                      onClick={() => isAllowed && addToEquation(digit.toString())}
                      disabled={isUsed || !isAllowed}
                      sx={{
                        flex: '1 1 0%',
                        maxWidth: 64,
                        minWidth: 32,
                        width: '100%',
                        minHeight: 64,
                        fontSize: totalButtons > 7 ? '18px' : '20px',
                        fontWeight: 700,
                        letterSpacing: '0.5px',
                        backgroundColor: isUsed
                          ? theme.palette.primary.main
                          : isAllowed
                            ? theme.palette.primary.subtle
                            : theme.palette.action.disabled,
                        color: isUsed
                          ? theme.palette.common.white
                          : isAllowed
                            ? theme.palette.text.primary
                            : theme.palette.text.disabled,
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: isUsed
                          ? `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`
                          : 'none',
                        opacity: isUsed ? 1 : isAllowed ? 1 : 0.5,
                        cursor: isUsed ? 'default' : isAllowed ? 'pointer' : 'not-allowed',
                        '&:hover':
                          isAllowed && !isUsed
                            ? {
                                backgroundColor: theme.palette.primary.hover,
                                boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.15)}`,
                                transform: 'translateY(-1px)',
                              }
                            : {},
                        '&:active':
                          isAllowed && !isUsed
                            ? {
                                transform: 'translateY(0px)',
                                boxShadow: `0 1px 4px ${alpha(theme.palette.text.primary, 0.1)}`,
                              }
                            : {},
                        textTransform: 'none',
                        transition: 'all 0.2s ease',
                        '&.Mui-disabled': {
                          color: isUsed ? theme.palette.common.white : theme.palette.text.disabled,
                          backgroundColor: isUsed
                            ? theme.palette.primary.main
                            : theme.palette.action.disabled,
                        },
                      }}
                    >
                      {digit}
                    </Button>
                  );
                });
              })()}
            </Box>
          </Box>

          {/* Equation Display */}
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                border: `2px solid ${theme.palette.text.primary}`,
                borderRadius: '4px',
                p: 2,
                minHeight: 56,
                display: 'flex',
                alignItems: 'center',
                backgroundColor: theme.palette.background.paper,
                position: 'relative',
              }}
            >
              <Typography
                sx={{
                  fontSize: '24px',
                  fontWeight: 600,
                  fontFamily: 'monospace',
                  color: theme.palette.text.primary,
                  flexGrow: 1,
                  minHeight: '1.5em',
                }}
              >
                {equation || (
                  <span style={{ color: theme.palette.text.secondary, fontSize: '24px' }}>
                    Input your equation
                  </span>
                )}
              </Typography>
              {equation && (
                <IconButton
                  onClick={removeLastChar}
                  size="small"
                  sx={{
                    color: theme.palette.text.primary,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <Backspace fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Box>

          {/* Keyboard Layout - CrackleDate Style */}
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
                  backgroundColor: theme.palette.secondary.subtle,
                  color: theme.palette.text.primary,
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: theme.palette.secondary.hover,
                    boxShadow: `0 2px 8px ${alpha(theme.palette.secondary.main, 0.15)}`,
                    transform: 'translateY(-1px)',
                  },
                  '&:active': {
                    transform: 'translateY(0px)',
                    boxShadow: `0 1px 4px ${alpha(theme.palette.text.primary, 0.1)}`,
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
                  backgroundColor: theme.palette.success.main,
                  color: theme.palette.common.white,
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: `0 2px 8px ${alpha(theme.palette.success.main, 0.3)}`,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.success.main, 0.9),
                    boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.4)}`,
                    transform: 'translateY(-2px)',
                  },
                  '&:active': {
                    transform: 'translateY(-1px)',
                    boxShadow: `0 2px 8px ${alpha(theme.palette.success.main, 0.3)}`,
                  },
                  '&.Mui-disabled': {
                    backgroundColor:
                      theme.palette.mode === 'dark'
                        ? alpha(theme.palette.background.paper, 0.6)
                        : alpha(theme.palette.text.primary, 0.1),
                    color:
                      theme.palette.mode === 'dark'
                        ? alpha(theme.palette.text.primary, 0.5)
                        : alpha(theme.palette.text.primary, 0.4),
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
                backgroundColor:
                  snackbarSeverity === 'success'
                    ? theme.palette.success.main
                    : snackbarSeverity === 'error'
                      ? theme.palette.error.main
                      : theme.palette.info.main,
                color: theme.palette.common.white,
                fontSize: '14px',
                fontWeight: 500,
                borderRadius: '4px',
              },
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
        <Stats
          onBack={() => setCurrentPage('game')}
          score={score}
          streak={streak}
          solutions={solutions}
          currentDate={currentDate}
        />
      )}

      {/* Hamburger Menu Drawer */}
      <Drawer
        anchor="right"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            backgroundColor: theme.palette.background.default,
            borderLeft: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
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
                backgroundColor:
                  currentPage === 'game' ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                },
              }}
            >
              <ListItemIcon>
                <Calculate
                  sx={{
                    color:
                      currentPage === 'game'
                        ? theme.palette.primary.main
                        : theme.palette.text.primary,
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary="Game"
                sx={{
                  '& .MuiListItemText-primary': {
                    color: theme.palette.text.primary,
                    fontWeight: currentPage === 'game' ? 600 : 400,
                  },
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
                backgroundColor:
                  currentPage === 'stats' ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                },
              }}
            >
              <ListItemIcon>
                <BarChart
                  sx={{
                    color:
                      currentPage === 'stats'
                        ? theme.palette.primary.main
                        : theme.palette.text.primary,
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary="Stats"
                sx={{
                  '& .MuiListItemText-primary': {
                    color: theme.palette.text.primary,
                    fontWeight: currentPage === 'stats' ? 600 : 400,
                  },
                }}
              />
            </ListItemButton>
            <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />
            <Typography sx={{ color: theme.palette.text.secondary, fontSize: 12, mb: 1, px: 1 }}>
              Theme
            </Typography>
            <RadioGroup
              aria-label="Theme"
              value={themeMode}
              onChange={(_, value: string) => setThemeMode(value as 'light' | 'dark' | 'system')}
            >
              <FormControlLabel
                value="light"
                control={<Radio size="small" />}
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <LightMode fontSize="small" /> Light
                  </Box>
                }
                sx={{
                  m: 0,
                  px: 1,
                  py: 0.5,
                  borderRadius: '8px',
                  borderLeft: '3px solid transparent',
                  transition:
                    'border-color 120ms ease, background-color 120ms ease, transform 80ms ease',
                  '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.05) },
                  '&:active': {
                    transform: 'translateY(1px)',
                    boxShadow: `0 1px 4px ${alpha(theme.palette.text.primary, 0.12)}`,
                  },
                  ...(themeMode === 'light' && {
                    backgroundColor: `${alpha(theme.palette.primary.main, 0.12)} !important`,
                    borderLeftColor: `${theme.palette.primary.main} !important`,
                  }),
                }}
              />
              <FormControlLabel
                value="dark"
                control={<Radio size="small" />}
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <DarkMode fontSize="small" /> Dark
                  </Box>
                }
                sx={{
                  m: 0,
                  px: 1,
                  py: 0.5,
                  borderRadius: '8px',
                  borderLeft: '3px solid transparent',
                  transition:
                    'border-color 120ms ease, background-color 120ms ease, transform 80ms ease',
                  '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.05) },
                  '&:active': {
                    transform: 'translateY(1px)',
                    boxShadow: `0 1px 4px ${alpha(theme.palette.text.primary, 0.12)}`,
                  },
                  ...(themeMode === 'dark' && {
                    backgroundColor: `${alpha(theme.palette.primary.main, 0.12)} !important`,
                    borderLeftColor: `${theme.palette.primary.main} !important`,
                  }),
                }}
              />
              <FormControlLabel
                value="system"
                control={<Radio size="small" />}
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <SettingsBrightness fontSize="small" /> System
                  </Box>
                }
                sx={{
                  m: 0,
                  px: 1,
                  py: 0.5,
                  borderRadius: '8px',
                  borderLeft: '3px solid transparent',
                  transition:
                    'border-color 120ms ease, background-color 120ms ease, transform 80ms ease',
                  '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.05) },
                  '&:active': {
                    transform: 'translateY(1px)',
                    boxShadow: `0 1px 4px ${alpha(theme.palette.text.primary, 0.12)}`,
                  },
                  ...(themeMode === 'system' && {
                    backgroundColor: `${alpha(theme.palette.primary.main, 0.12)} !important`,
                    borderLeftColor: `${theme.palette.primary.main} !important`,
                  }),
                }}
              />
            </RadioGroup>
          </List>
        </Box>
      </Drawer>
    </React.Fragment>
  );
};

export default CrackleDateCard;
