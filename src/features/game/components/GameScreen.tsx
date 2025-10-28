import { useCallback, useEffect, useMemo, useState } from 'react';
import StatsPanel from '../../stats/components/StatsPanel';
import { useThemeMode } from '../../theme/hooks/useThemeMode';
import { useGameStore } from '../state/game-store';
import { getDateDigits, getDigitsArray } from '../lib/dateUtils';
import { validateEquationInput, getInputHint } from '../lib/inputValidator';
import { validateEquation } from '../lib/mathValidator';
import { calculateScore, getScoreDescription } from '../lib/scoring';
import './game-screen.css';

type ViewMode = 'game' | 'stats';
type ToastTone = 'success' | 'error' | 'info';

type OperatorToken = {
  token: string;
  label: string;
};

const OPERATOR_ROWS: OperatorToken[][] = [
  [
    { token: '+', label: '+' },
    { token: '-', label: '−' },
    { token: '*', label: '×' },
    { token: '/', label: '÷' },
  ],
  [
    { token: '^', label: '^' },
    { token: '%', label: '%' },
    { token: 'sqrt(', label: '√' },
    { token: 'abs(', label: '|x|' },
  ],
  [
    { token: '(', label: '(' },
    { token: ')', label: ')' },
    { token: '!', label: '!' },
    { token: '=', label: '=' },
  ],
];

const mapKeyToToken = (key: string): string | null => {
  if (key === 'x' || key === 'X') return '*';
  if (key === 's' || key === 'S') return 'sqrt(';
  if (key === 'a' || key === 'A') return 'abs(';
  if (/^[0-9+\-*/^%()=!]{1}$/.test(key)) return key;
  return null;
};

export default function GameScreen() {
  const currentDate = useGameStore((state) => state.currentDate);
  const equation = useGameStore((state) => state.equation);
  const setEquation = useGameStore((state) => state.setEquation);
  const setValid = useGameStore((state) => state.setValid);
  const addSolution = useGameStore((state) => state.addSolution);
  const loadGameState = useGameStore((state) => state.loadGameState);
  const score = useGameStore((state) => state.score);
  const streak = useGameStore((state) => state.streak);
  const solutions = useGameStore((state) => state.solutions);

  const { themeMode, resolvedMode, cycleThemeMode, nextThemeMode } = useThemeMode();

  const [view, setView] = useState<ViewMode>('game');
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState<{ tone: ToastTone; message: string } | null>(null);

  useEffect(() => {
    loadGameState();
  }, [loadGameState]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  const digitsArray = useMemo(() => getDigitsArray(getDateDigits(currentDate)), [currentDate]);
  const usedDigits = useMemo(
    () => (equation.match(/\d/g) || []).map((digit) => parseInt(digit, 10)),
    [equation]
  );

  const showToast = useCallback((tone: ToastTone, message: string) => {
    setToast({ tone, message });
  }, []);

  const clearEquation = useCallback(() => {
    setEquation('');
  }, [setEquation]);

  const removeLastChar = useCallback(() => {
    setEquation(equation.slice(0, -1));
  }, [equation, setEquation]);

  const addToken = useCallback(
    (token: string) => {
      if (token === 'sqrt(' || token === 'abs(') {
        setEquation(equation + token);
        return;
      }

      if (token === '=' && equation.includes('=')) {
        showToast('error', 'Only one equals sign is allowed.');
        return;
      }

      const validation = validateEquationInput(equation, token, currentDate);
      if (validation.isValid) {
        setEquation(equation + token);
      } else if (/^\d$/.test(token)) {
        showToast('info', getInputHint(equation, currentDate));
      } else if (validation.error) {
        showToast('error', validation.error);
      }
    },
    [currentDate, equation, setEquation, showToast]
  );

  const handleDigitPress = useCallback(
    (digit: number) => {
      const nextIndex = usedDigits.length;
      if (digitsArray[nextIndex] !== digit) {
        showToast('error', 'Use the date digits in order.');
        return;
      }
      addToken(digit.toString());
    },
    [addToken, digitsArray, showToast, usedDigits.length]
  );

  const isEquationReadyForSubmission = useCallback(() => {
    if (!equation.includes('=') || !equation.trim()) {
      return false;
    }

    const parts = equation.split('=');
    if (parts.length !== 2) {
      return false;
    }

    const leftSide = parts[0].trim();
    const rightSide = parts[1].trim();
    if (!leftSide || !rightSide) {
      return false;
    }

    const leftDigits = leftSide.match(/\d/g) || [];
    const rightDigits = rightSide.match(/\d/g) || [];
    if (leftDigits.length === 0 || rightDigits.length === 0) {
      return false;
    }

    if (usedDigits.length !== digitsArray.length) {
      return false;
    }

    return usedDigits.every((digit, index) => digit === digitsArray[index]);
  }, [digitsArray, equation, usedDigits]);

  const submitEquation = useCallback(() => {
    if (!equation) {
      showToast('info', 'Build an equation before submitting.');
      return;
    }

    const result = validateEquation(equation, currentDate);
    setValid(result.isValid);

    if (result.isValid) {
      const scoreValue = calculateScore(result);
      const description = getScoreDescription(scoreValue, result.complexity);
      addSolution(equation, scoreValue);
      showToast('success', `🎉 ${description}`);
      clearEquation();
    } else {
      showToast('error', result.error || 'Invalid equation.');
    }
  }, [addSolution, clearEquation, currentDate, equation, setValid, showToast]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        if (isEquationReadyForSubmission()) {
          submitEquation();
        } else {
          showToast('info', 'Use all digits and add = before submitting.');
        }
        return;
      }

      if (event.key === 'Backspace') {
        event.preventDefault();
        if (equation.length > 0) {
          removeLastChar();
        }
        return;
      }

      if (['Shift', 'Control', 'Alt', 'Meta', 'Tab', 'CapsLock', 'Escape'].includes(event.key)) {
        return;
      }

      const token = mapKeyToToken(event.key);
      if (!token) {
        showToast('error', 'Only digits and math operators are allowed.');
        return;
      }

      event.preventDefault();

      if (/^\d$/.test(token)) {
        const nextIndex = usedDigits.length;
        if (digitsArray[nextIndex]?.toString() !== token) {
          showToast('error', 'Use the date digits in order.');
          return;
        }
      }

      addToken(token);
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [
    addToken,
    digitsArray,
    equation.length,
    isEquationReadyForSubmission,
    removeLastChar,
    showToast,
    submitEquation,
    usedDigits.length,
  ]);

  const nextThemeLabel = useMemo(() => {
    switch (nextThemeMode) {
      case 'dark':
        return 'Switch to dark mode';
      case 'light':
        return 'Switch to light mode';
      default:
        return 'Use system theme';
    }
  }, [nextThemeMode]);

  return (
    <div className="game-screen" data-view={view}>
      <header className="game-header">
        <button
          type="button"
          className="icon-button"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
        >
          ☰
        </button>
        <div className="game-header-title">
          <p className="game-header-tagline">Daily math challenge</p>
          <h1>Crackle Date</h1>
        </div>
        <button
          type="button"
          className="icon-button"
          onClick={cycleThemeMode}
          aria-label={`Current theme ${themeMode}. ${nextThemeLabel}`}
        >
          {resolvedMode === 'dark' ? '🌙' : '☀️'}
        </button>
      </header>

      <main className="game-main" aria-live="polite">
        {view === 'game' ? (
          <section className="game-card" aria-label="Equation builder">
            <div className="game-summary">
              <span className="game-date" aria-label="Puzzle date">
                {currentDate}
              </span>
              <div className="game-stats">
                <div className="game-stat">
                  <span className="game-stat-label">Score</span>
                  <span className="game-stat-value">{score}</span>
                </div>
                <div className="game-stat">
                  <span className="game-stat-label">Streak</span>
                  <span className="game-stat-value">{streak}</span>
                </div>
                <button type="button" className="link-button" onClick={() => setView('stats')}>
                  View stats →
                </button>
              </div>
            </div>

            <div className="equation-display" role="textbox" aria-label="Current equation">
              {equation || <span className="equation-placeholder">Build your equation</span>}
            </div>

            <div className="equation-actions">
              <button type="button" className="secondary-button" onClick={clearEquation}>
                Clear
              </button>
              <button
                type="button"
                className="primary-button"
                onClick={submitEquation}
                disabled={!isEquationReadyForSubmission()}
              >
                Submit
              </button>
            </div>

            <div className="digit-pad" aria-label="Date digits">
              {digitsArray.map((digit, index) => {
                const isUsed = index < usedDigits.length;
                const isNext = index === usedDigits.length;
                return (
                  <button
                    key={`${digit}-${index}`}
                    type="button"
                    className="digit-button"
                    disabled={isUsed}
                    data-state={isUsed ? 'used' : isNext ? 'available' : 'waiting'}
                    onClick={() => !isUsed && isNext && handleDigitPress(digit)}
                  >
                    {digit}
                  </button>
                );
              })}
            </div>

            <div className="operator-pad" aria-label="Math operators">
              {OPERATOR_ROWS.map((row, rowIndex) => (
                <div className="operator-row" key={`row-${rowIndex}`}>
                  {row.map((item) => (
                    <button
                      key={item.token}
                      type="button"
                      className="operator-button"
                      disabled={item.token === '=' && equation.includes('=')}
                      onClick={() => addToken(item.token)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            <div className="quick-actions">
              <button type="button" className="secondary-button" onClick={removeLastChar}>
                Backspace
              </button>
            </div>
          </section>
        ) : (
          <StatsPanel
            onBack={() => setView('game')}
            score={score}
            streak={streak}
            solutions={solutions}
            currentDate={currentDate}
          />
        )}
      </main>

      {menuOpen && (
        <div className="sheet" role="dialog" aria-modal="true">
          <div className="sheet-content">
            <header className="sheet-header">
              <h2>Menu</h2>
              <button
                type="button"
                className="icon-button"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
              >
                ✕
              </button>
            </header>
            <nav className="sheet-nav">
              <button
                type="button"
                className="sheet-link"
                onClick={() => {
                  setView('game');
                  setMenuOpen(false);
                }}
              >
                Play
              </button>
              <button
                type="button"
                className="sheet-link"
                onClick={() => {
                  setView('stats');
                  setMenuOpen(false);
                }}
              >
                Stats
              </button>
            </nav>
            <div className="sheet-section">
              <p className="sheet-section-title">Theme</p>
              <p className="sheet-section-hint">Current: {themeMode}</p>
              <button type="button" className="secondary-button" onClick={cycleThemeMode}>
                {nextThemeLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`game-toast game-toast-${toast.tone}`} role="status" aria-live="assertive">
          {toast.message}
        </div>
      )}
    </div>
  );
}
