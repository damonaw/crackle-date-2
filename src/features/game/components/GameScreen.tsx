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

const MAX_HINTS_PER_DAY = 3;

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
  const availableDates = useGameStore((state) => state.availableDates);
  const selectDate = useGameStore((state) => state.selectDate);
  const hintsUsed = useGameStore((state) => state.hintsUsed);
  const incrementHintsUsed = useGameStore((state) => state.incrementHintsUsed);
  const achievements = useGameStore((state) => state.achievements);
  const tutorialSeen = useGameStore((state) => state.tutorialSeen);
  const markTutorialComplete = useGameStore((state) => state.markTutorialComplete);

  const { themeMode, resolvedMode, cycleThemeMode, nextThemeMode } = useThemeMode();

  const [view, setView] = useState<ViewMode>('game');
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState<{ tone: ToastTone; message: string } | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [hasPromptedTutorial, setHasPromptedTutorial] = useState(false);

  useEffect(() => {
    loadGameState();
  }, [loadGameState]);

  useEffect(() => {
    if (!tutorialSeen && !hasPromptedTutorial) {
      setShowTutorial(true);
      setHasPromptedTutorial(true);
    }
  }, [hasPromptedTutorial, tutorialSeen]);

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

  const remainingHints = Math.max(0, MAX_HINTS_PER_DAY - hintsUsed);

  const handleHint = useCallback(() => {
    if (hintsUsed >= MAX_HINTS_PER_DAY) {
      showToast('info', 'You have used all available hints for today.');
      return;
    }
    const hint = getInputHint(equation, currentDate);
    incrementHintsUsed();
    showToast('info', `Hint: ${hint}`);
  }, [currentDate, equation, hintsUsed, incrementHintsUsed, showToast]);

  const handleShareSolutions = useCallback(async () => {
    if (solutions.length === 0) {
      showToast('info', 'Solve a puzzle before sharing.');
      return;
    }

    if (typeof navigator === 'undefined') {
      showToast('error', 'Sharing is not supported in this environment.');
      return;
    }

    const orderedSolutions = solutions.slice().reverse();
    const totalScore = orderedSolutions.reduce((total, sol) => total + sol.score, 0);
    const summaryLines = orderedSolutions.map(
      (solution) => `${solution.equation} (${solution.score} pts)`
    );
    const streakLine = streak > 0 ? `🔥 Streak: ${streak}` : null;
    const shareText = [
      `Crackle Date ${currentDate}`,
      ...summaryLines,
      `Total: ${totalScore} pts`,
      streakLine,
    ]
      .filter(Boolean)
      .join('\n');

    try {
      if ('share' in navigator && typeof navigator.share === 'function') {
        await navigator.share({ title: `Crackle Date ${currentDate}`, text: shareText });
        showToast('success', 'Shared your solutions!');
        return;
      }

      if ('clipboard' in navigator && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
        showToast('success', 'Copied your solutions summary!');
        return;
      }

      throw new Error('Share API unavailable');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        showToast('info', 'Share cancelled.');
        return;
      }
      showToast('error', 'Sharing failed. Try again later.');
    }
  }, [currentDate, showToast, solutions, streak]);

  const closeTutorial = useCallback(() => {
    setShowTutorial(false);
    markTutorialComplete();
  }, [markTutorialComplete]);

  const handleDateSelect = useCallback(
    (date: string) => {
      selectDate(date);
      setView('game');
      setMenuOpen(false);
      showToast('info', `Loaded puzzle for ${date}.`);
    },
    [selectDate, showToast]
  );

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
      addSolution(equation, scoreValue, result.complexity);
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
                <div className="game-stat">
                  <span className="game-stat-label">Hints</span>
                  <span className="game-stat-value">{remainingHints}</span>
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
              <button
                type="button"
                className="secondary-button"
                onClick={handleHint}
                disabled={remainingHints <= 0}
              >
                {remainingHints > 0 ? `Hint (${remainingHints})` : 'No hints left'}
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => setShowTutorial(true)}
              >
                Tutorial
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
            achievements={achievements}
            onShare={handleShareSolutions}
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
              <button
                type="button"
                className="sheet-link"
                onClick={() => {
                  setMenuOpen(false);
                  setShowTutorial(true);
                }}
              >
                Tutorial
              </button>
            </nav>
            <div className="sheet-section">
              <p className="sheet-section-title">Theme</p>
              <p className="sheet-section-hint">Current: {themeMode}</p>
              <button type="button" className="secondary-button" onClick={cycleThemeMode}>
                {nextThemeLabel}
              </button>
            </div>
            <div className="sheet-section">
              <p className="sheet-section-title">Hints</p>
              <p className="sheet-section-hint">
                {remainingHints > 0
                  ? `${remainingHints} hint${remainingHints === 1 ? '' : 's'} remaining today.`
                  : 'No hints left today.'}
              </p>
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setMenuOpen(false);
                  handleHint();
                }}
                disabled={remainingHints <= 0}
              >
                Use a hint
              </button>
            </div>
            <div className="sheet-section">
              <p className="sheet-section-title">Previous puzzles</p>
              <p className="sheet-section-hint">Jump back to a recent date.</p>
              <div className="sheet-date-grid">
                {availableDates.slice(0, 14).map((date) => (
                  <button
                    key={date}
                    type="button"
                    className="sheet-date-button"
                    data-active={date === currentDate}
                    onClick={() => handleDateSelect(date)}
                  >
                    {date}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showTutorial && (
        <div className="tutorial-overlay" role="dialog" aria-modal="true">
          <div className="tutorial-card">
            <header className="tutorial-header">
              <h2>How to play</h2>
              <button
                type="button"
                className="icon-button"
                aria-label="Close tutorial"
                onClick={closeTutorial}
              >
                ✕
              </button>
            </header>
            <ol className="tutorial-steps">
              <li>Use each digit from the date in order—no skipping or rearranging.</li>
              <li>Add operators and parentheses to build both sides of the equation.</li>
              <li>Press submit when you&apos;ve used all digits and added an equals sign.</li>
              <li>Earn streaks and achievements by solving daily and boosting your score.</li>
            </ol>
            <footer className="tutorial-footer">
              <button
                type="button"
                className="primary-button tutorial-primary-button"
                onClick={closeTutorial}
              >
                Let&apos;s play
              </button>
            </footer>
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
