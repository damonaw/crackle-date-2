import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { evaluate } from 'mathjs';
import MathEquation from '../../math/components/MathEquation';
import StatsPanel from '../../stats/components/StatsPanel';
import AchievementsPanel from '../../achievements/components/AchievementsPanel';
import SolutionsPanel from '../../solutions/components/SolutionsPanel';
import TutorialPanel from '../../tutorial/components/TutorialPanel';
import { useThemeMode } from '../../theme/hooks/useThemeMode';
import { useGameStore } from '../state/game-store';
import { getDateDigits, getDigitsArray, getTodaysGameDate } from '../lib/dateUtils';
import { validateEquationInput } from '../lib/inputValidator';
import { validateEquation } from '../lib/mathValidator';
import { calculateScore, getScoreDescription } from '../lib/scoring';
import DatePicker from './DatePicker';
import './game-screen.css';

type ViewMode = 'game' | 'stats' | 'achievements' | 'solutions' | 'tutorial';
type ToastTone = 'success' | 'error' | 'info';

type OperatorToken = {
  token: string;
  label: string;
};

// Reorganized operators: 3 columns of 4 rows
const OPERATOR_COLUMNS: OperatorToken[][] = [
  [
    { token: '+', label: '+' },
    { token: '^', label: '^' },
    { token: '(', label: '(' },
    { token: '=', label: '=' },
  ],
  [
    { token: '-', label: '−' },
    { token: '%', label: '%' },
    { token: ')', label: ')' },
    { token: 'sqrt(', label: '√' },
  ],
  [
    { token: '*', label: '×' },
    { token: '/', label: '÷' },
    { token: '!', label: '!' },
    { token: 'abs(', label: '|x|' },
  ],
];

const SHARE_OPERATOR_TOKENS: OperatorToken[] = [
  { token: '+', label: '+' },
  { token: '-', label: '−' },
  { token: '*', label: '×' },
  { token: '/', label: '÷' },
  { token: '^', label: '^' },
  { token: '%', label: '%' },
  { token: 'sqrt(', label: '√' },
  { token: 'abs(', label: '|x|' },
  { token: '!', label: '!' },
  { token: '(', label: '(' },
  { token: ')', label: ')' },
];

const formatOperatorsUsed = (equation: string): string => {
  const usedLabels = new Set<string>();

  SHARE_OPERATOR_TOKENS.forEach(({ token, label }) => {
    if (equation.includes(token)) {
      usedLabels.add(label);
    }
  });

  if (usedLabels.size === 0) {
    return 'none';
  }

  return SHARE_OPERATOR_TOKENS.filter(({ label }) => usedLabels.has(label))
    .map(({ label }) => label)
    .join(', ');
};

const mapKeyToToken = (key: string): string | null => {
  if (key === 'x' || key === 'X') return '*';
  if (key === 's' || key === 'S') return 'sqrt(';
  if (key === 'a' || key === 'A') return 'abs(';
  if (/^[0-9+\-*/^%()=!]{1}$/.test(key)) return key;
  return null;
};

// Material UI style icons as SVG components
const LightModeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" />
  </svg>
);

const DarkModeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9.37,5.51C9.19,6.15,9.1,6.82,9.1,7.5c0,4.08,3.32,7.4,7.4,7.4c0.68,0,1.35-0.09,1.99-0.27C17.45,17.19,14.93,19,12,19 c-3.86,0-7-3.14-7-7C5,9.07,6.81,6.55,9.37,5.51z M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36 c-0.98,1.37-2.58,2.26-4.4,2.26c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z" />
  </svg>
);

// Calculate equation side values for easy mode
const calculateSideValues = (equation: string): { left: string; right: string } => {
  try {
    if (!equation.includes('=')) {
      return { left: '', right: '' };
    }
    const equalsIndex = equation.indexOf('=');
    const leftSide = equation.substring(0, equalsIndex);
    const rightSide = equation.substring(equalsIndex + 1);

    let leftValue = '';
    let rightValue = '';

    if (leftSide.trim()) {
      try {
        const leftResult = evaluate(leftSide);
        leftValue = typeof leftResult === 'number' ? leftResult.toString() : '';
      } catch {
        leftValue = '';
      }
    }

    if (rightSide.trim()) {
      try {
        const rightResult = evaluate(rightSide);
        rightValue = typeof rightResult === 'number' ? rightResult.toString() : '';
      } catch {
        rightValue = '';
      }
    }

    return { left: leftValue, right: rightValue };
  } catch {
    return { left: '', right: '' };
  }
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
  const selectDate = useGameStore((state) => state.selectDate);
  const achievements = useGameStore((state) => state.achievements);
  const tutorialSeen = useGameStore((state) => state.tutorialSeen);
  const markTutorialComplete = useGameStore((state) => state.markTutorialComplete);
  const incrementWrongAttempts = useGameStore((state) => state.incrementWrongAttempts);
  const easyMode = useGameStore((state) => state.easyMode);
  const setEasyMode = useGameStore((state) => state.setEasyMode);
  const inputClicks = useGameStore((state) => state.inputClicks);
  const incrementInputClicks = useGameStore((state) => state.incrementInputClicks);
  const showInputClicks = useGameStore((state) => state.showInputClicks);
  const setShowInputClicks = useGameStore((state) => state.setShowInputClicks);

  const { themeMode, resolvedMode, cycleThemeMode, nextThemeMode } = useThemeMode();

  const [view, setView] = useState<ViewMode>('game');
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState<{ tone: ToastTone; message: string } | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [hasPromptedTutorial, setHasPromptedTutorial] = useState(false);
  const [isHeaderCondensed, setHeaderCondensed] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => {
      setHeaderCondensed(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const digitsArray = useMemo(() => getDigitsArray(getDateDigits(currentDate)), [currentDate]);
  const digitSections = useMemo(() => {
    const monthDigitCount = Math.max(1, digitsArray.length - 6);
    const sections: Array<{ start: number; end: number; separator: '/' | null }> = [
      { start: 0, end: monthDigitCount, separator: '/' },
      { start: monthDigitCount, end: monthDigitCount + 2, separator: '/' },
      { start: monthDigitCount + 2, end: digitsArray.length, separator: null },
    ];

    return sections.filter((section) => section.end > section.start);
  }, [digitsArray]);
  const usedDigits = useMemo(
    () => (equation.match(/\d/g) || []).map((digit) => parseInt(digit, 10)),
    [equation]
  );

  const easyModeValues = useMemo(() => {
    if (!easyMode) return null;
    return calculateSideValues(equation);
  }, [easyMode, equation]);

  const showToast = useCallback((tone: ToastTone, message: string) => {
    setToast({ tone, message });
  }, []);

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
    const summaryLines = orderedSolutions.map((solution) => {
      const operatorsUsed = formatOperatorsUsed(solution.equation);
      return `${solution.score} pts • Operators: ${operatorsUsed}`;
    });
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
    if (!equation) {
      return;
    }
    incrementInputClicks();
    setEquation('');
  }, [equation, incrementInputClicks, setEquation]);

  const removeLastChar = useCallback(() => {
    if (equation.length === 0) {
      return;
    }
    incrementInputClicks();
    setEquation(equation.slice(0, -1));
  }, [equation, incrementInputClicks, setEquation]);

  const addToken = useCallback(
    (token: string) => {
      const recordInput = () => {
        incrementInputClicks();
      };

      if (token === 'sqrt(' || token === 'abs(') {
        setEquation(equation + token);
        recordInput();
        return;
      }

      if (token === '=' && equation.includes('=')) {
        showToast('error', 'Only one equals sign is allowed.');
        return;
      }

      const validation = validateEquationInput(equation, token, currentDate);
      if (validation.isValid) {
        setEquation(equation + token);
        recordInput();
      } else if (validation.error) {
        showToast('error', validation.error);
      }
    },
    [currentDate, equation, incrementInputClicks, setEquation, showToast]
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
      incrementWrongAttempts();
      showToast('error', result.error || 'Invalid equation.');
    }
  }, [
    addSolution,
    clearEquation,
    currentDate,
    equation,
    incrementWrongAttempts,
    setValid,
    showToast,
  ]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        incrementInputClicks();
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
    incrementInputClicks,
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
      <header className="game-header" data-condensed={isHeaderCondensed}>
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
          <p className="game-header-date" aria-label="Puzzle date">
            {currentDate}
          </p>
        </div>
        <button
          type="button"
          className="icon-button"
          onClick={cycleThemeMode}
          aria-label={`Current theme ${themeMode}. ${nextThemeLabel}`}
        >
          {resolvedMode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
        </button>
      </header>

      <main className="game-main" aria-live="polite">
        {view === 'game' ? (
          <section className="game-content" aria-label="Equation builder">
            <div className="game-layout">
              <div className="game-layout-main">
                <div className="digit-track" role="group" aria-label="Date digits" tabIndex={0}>
                  {digitSections.map((section, sectionIndex) => {
                    const digits = digitsArray.slice(section.start, section.end);
                    return (
                      <Fragment key={`section-${sectionIndex}`}>
                        {digits.map((digit, index) => {
                          const globalIndex = section.start + index;
                          const isUsed = globalIndex < usedDigits.length;
                          const isNext = globalIndex === usedDigits.length;

                          return (
                            <span
                              key={`${digit}-${globalIndex}`}
                              className="digit-token-wrapper"
                              data-state={isNext ? 'active' : isUsed ? 'used' : 'waiting'}
                            >
                              {isNext ? (
                                <span className="digit-bracket" aria-hidden="true">
                                  [
                                </span>
                              ) : null}
                              {isNext ? (
                                <button
                                  type="button"
                                  className="digit-token"
                                  onClick={() => handleDigitPress(digit)}
                                  aria-label={`Use digit ${digit}`}
                                >
                                  {digit}
                                </button>
                              ) : (
                                <span
                                  className="digit-token"
                                  aria-hidden={false}
                                  data-state={isUsed ? 'used' : 'waiting'}
                                >
                                  {digit}
                                </span>
                              )}
                              {isNext ? (
                                <span className="digit-bracket" aria-hidden="true">
                                  ]
                                </span>
                              ) : null}
                            </span>
                          );
                        })}
                        {section.separator ? (
                          <span className="digit-separator" aria-hidden="true">
                            {section.separator}
                          </span>
                        ) : null}
                      </Fragment>
                    );
                  })}
                </div>

                <div
                  className="equation-display"
                  role="textbox"
                  aria-label="Current equation"
                  aria-live="polite"
                >
                  {equation ? (
                    <MathEquation equation={equation} className="equation-render" />
                  ) : (
                    <span className="equation-placeholder">Build your equation</span>
                  )}
                </div>

                {showInputClicks && (
                  <div className="input-clicks-indicator" aria-live="polite">
                    <span className="input-clicks-label">Input clicks</span>
                    <span className="input-clicks-value">{inputClicks}</span>
                  </div>
                )}

                {easyMode && easyModeValues && (
                  <div className="easy-mode-values" aria-label="Equation side values">
                    <div className="easy-mode-side">
                      <span className="easy-mode-label">Left:</span>
                      <span className="easy-mode-value">{easyModeValues.left || '—'}</span>
                    </div>
                    <div className="easy-mode-side">
                      <span className="easy-mode-label">Right:</span>
                      <span className="easy-mode-value">{easyModeValues.right || '—'}</span>
                    </div>
                  </div>
                )}

                <div className="equation-actions">
                  <button type="button" className="secondary-button" onClick={clearEquation}>
                    Clear
                  </button>
                  <button type="button" className="secondary-button" onClick={removeLastChar}>
                    Backspace
                  </button>
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => {
                      incrementInputClicks();
                      submitEquation();
                    }}
                    disabled={!isEquationReadyForSubmission()}
                  >
                    Submit
                  </button>
                </div>
              </div>

              <div className="game-layout-side">
                <div className="operator-pad" aria-label="Math operators">
                  {OPERATOR_COLUMNS.map((column, colIndex) => (
                    <div className="operator-column" key={`col-${colIndex}`}>
                      {column.map((item) => (
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
              </div>
            </div>
          </section>
        ) : view === 'stats' ? (
          <StatsPanel
            onBack={() => setView('game')}
            score={score}
            streak={streak}
            inputClicks={inputClicks}
          />
        ) : view === 'solutions' ? (
          <SolutionsPanel
            onBack={() => setView('game')}
            solutions={solutions}
            currentDate={currentDate}
            onShare={handleShareSolutions}
          />
        ) : view === 'tutorial' ? (
          <TutorialPanel onBack={() => setView('game')} />
        ) : (
          <AchievementsPanel onBack={() => setView('game')} achievements={achievements} />
        )}
      </main>

      {menuOpen && (
        <div
          className="menu-panel"
          role="dialog"
          aria-modal="true"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="menu-panel-card"
            role="document"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="menu-panel-header">
              <div>
                <p className="menu-panel-subtitle">Quick access</p>
                <h2>Menu</h2>
                <p className="menu-panel-description">Navigate or tweak the experience.</p>
              </div>
              <button
                type="button"
                className="menu-panel-close"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
              >
                ✕
              </button>
            </header>
            <div className="menu-panel-body">
              <section className="menu-panel-section">
                <p className="menu-panel-label">Navigate</p>
                <div className="menu-panel-actions">
                  <button
                    type="button"
                    className="menu-nav-button"
                    onClick={() => {
                      setView('stats');
                      setMenuOpen(false);
                    }}
                  >
                    <span className="menu-nav-title">Stats</span>
                    <span className="menu-nav-description">Performance overview</span>
                  </button>
                  <button
                    type="button"
                    className="menu-nav-button"
                    onClick={() => {
                      setView('solutions');
                      setMenuOpen(false);
                    }}
                  >
                    <span className="menu-nav-title">Solutions</span>
                    <span className="menu-nav-description">See past equations</span>
                  </button>
                  <button
                    type="button"
                    className="menu-nav-button"
                    onClick={() => {
                      setView('achievements');
                      setMenuOpen(false);
                    }}
                  >
                    <span className="menu-nav-title">Achievements</span>
                    <span className="menu-nav-description">Unlocked goals</span>
                  </button>
                  <button
                    type="button"
                    className="menu-nav-button"
                    onClick={() => {
                      setView('tutorial');
                      setMenuOpen(false);
                    }}
                  >
                    <span className="menu-nav-title">Tutorial</span>
                    <span className="menu-nav-description">How to play</span>
                  </button>
                </div>
              </section>

              <section className="menu-panel-section">
                <p className="menu-panel-label">Settings</p>
                <div className="menu-setting-card">
                  <div>
                    <p className="menu-setting-title">Theme</p>
                    <p className="menu-setting-description">{nextThemeLabel}</p>
                  </div>
                  <button type="button" className="menu-setting-button" onClick={cycleThemeMode}>
                    Change
                  </button>
                </div>
                <button
                  type="button"
                  className="menu-toggle"
                  aria-pressed={easyMode}
                  onClick={() => setEasyMode(!easyMode)}
                >
                  <div>
                    <p className="menu-toggle-title">Easy mode</p>
                    <p className="menu-toggle-description">Preview each side of the equation</p>
                  </div>
                  <span className="menu-toggle-indicator" data-state={easyMode ? 'on' : 'off'}>
                    {easyMode ? 'On' : 'Off'}
                  </span>
                </button>
                <button
                  type="button"
                  className="menu-toggle"
                  aria-pressed={showInputClicks}
                  onClick={() => setShowInputClicks(!showInputClicks)}
                >
                  <div>
                    <p className="menu-toggle-title">Show input clicks</p>
                    <p className="menu-toggle-description">
                      Toggle the click counter on the game board
                    </p>
                  </div>
                  <span
                    className="menu-toggle-indicator"
                    data-state={showInputClicks ? 'on' : 'off'}
                  >
                    {showInputClicks ? 'On' : 'Off'}
                  </span>
                </button>
              </section>

              <section className="menu-panel-section">
                <p className="menu-panel-label">Previous puzzles</p>
                <DatePicker
                  currentDate={currentDate}
                  maxDate={getTodaysGameDate()}
                  onDateSelect={handleDateSelect}
                />
              </section>
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
