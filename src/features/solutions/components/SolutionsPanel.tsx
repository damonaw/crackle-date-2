import { useMemo } from 'react';
import MathEquation from '../../math/components/MathEquation';
import type { Solution } from '../../game/types';
import './solutions-panel.css';

// Material UI style icons as SVG components
const TimerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
  </svg>
);

const ErrorIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
  </svg>
);

const ShareIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
  </svg>
);

interface SolutionsPanelProps {
  onBack?: () => void;
  solutions: Solution[];
  currentDate: string;
  onShare?: () => void;
}

// Format time in seconds to human-readable format
const formatTime = (seconds?: number): string | null => {
  if (seconds === undefined) return null;
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

// Calculate statistics from solutions
const calculateStats = (solutions: Solution[]) => {
  const totalScore = solutions.reduce((total, sol) => total + sol.score, 0);
  const averageScore = solutions.length > 0 ? Math.round(totalScore / solutions.length) : 0;
  const totalTime = solutions.reduce((total, sol) => total + (sol.timeToSolve || 0), 0);
  const averageTime = solutions.length > 0 ? Math.round(totalTime / solutions.length) : 0;
  const totalAttempts = solutions.reduce((total, sol) => total + (sol.wrongAttempts || 0), 0);

  return {
    totalScore,
    averageScore,
    averageTime,
    totalAttempts,
    solutionCount: solutions.length,
  };
};

export default function SolutionsPanel({
  onBack,
  solutions,
  currentDate,
  onShare,
}: SolutionsPanelProps) {
  const solutionsReversed = useMemo(() => solutions.slice().reverse(), [solutions]);
  const stats = useMemo(() => calculateStats(solutions), [solutions]);

  return (
    <section className="solutions-panel" aria-label="Solutions">
      <header className="solutions-panel-header">
        {onBack && (
          <button
            type="button"
            className="solutions-panel-back"
            onClick={onBack}
            aria-label="Back to game"
          >
            ← Back
          </button>
        )}
        <h2>Solutions</h2>
        <p>Your equations for {currentDate}</p>
      </header>

      <div className="solutions-panel-summary">
        <div className="solutions-panel-stats">
          <div className="solutions-panel-stat">
            <div className="solutions-panel-stat-value">{stats.solutionCount}</div>
            <div className="solutions-panel-stat-label">Solutions</div>
          </div>
          <div className="solutions-panel-stat">
            <div className="solutions-panel-stat-value">{stats.totalScore}</div>
            <div className="solutions-panel-stat-label">Total Score</div>
          </div>
          <div className="solutions-panel-stat">
            <div className="solutions-panel-stat-value">{stats.averageScore}</div>
            <div className="solutions-panel-stat-label">Average Score</div>
          </div>
          <div className="solutions-panel-stat">
            <div className="solutions-panel-stat-value">{formatTime(stats.averageTime)}</div>
            <div className="solutions-panel-stat-label">Avg Time</div>
          </div>
        </div>
      </div>

      {solutionsReversed.length > 0 ? (
        <div className="solutions-panel-list">
          <div className="solutions-panel-list-header">
            <h3>Today's solutions</h3>
            {onShare && (
              <button type="button" className="solutions-panel-share" onClick={onShare}>
                <ShareIcon />
                Share
              </button>
            )}
          </div>
          <ul>
            {solutionsReversed.map((solution, index) => {
              const key = solution.timestamp instanceof Date ? solution.timestamp.getTime() : index;

              return (
                <li key={key} className="solutions-panel-item">
                  <div className="solutions-panel-equation">
                    <MathEquation
                      equation={solution.equation}
                      className="solutions-panel-equation-render"
                    />
                  </div>
                  <div className="solutions-panel-meta">
                    <div className="solutions-panel-primary-meta">
                      <span className="solutions-panel-complexity">{solution.complexity}</span>
                      <span className="solutions-panel-score">{solution.score} pts</span>
                    </div>
                    <div className="solutions-panel-secondary-meta">
                      {solution.timeToSolve !== undefined && (
                        <span className="solutions-panel-time" title="Time to solve">
                          <TimerIcon /> {formatTime(solution.timeToSolve)}
                        </span>
                      )}
                      {solution.wrongAttempts !== undefined && solution.wrongAttempts > 0 && (
                        <span className="solutions-panel-attempts" title="Wrong attempts">
                          <ErrorIcon /> {solution.wrongAttempts}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="solutions-panel-empty">
          <div className="solutions-panel-empty-icon">📝</div>
          <h3>No solutions yet</h3>
          <p>Submit your first equation to start tracking your progress.</p>
        </div>
      )}
    </section>
  );
}
