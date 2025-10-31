import { useMemo } from 'react';
import MathEquation from '../../math/components/MathEquation';
import type { AchievementStatus, Solution } from '../../game/types';
import './stats-panel.css';

// Material UI style icons as SVG components
const CheckCircleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

const StarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const LocalFireDepartmentIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.48 12.35c-1.57-4.08-7.16-4.3-5.81-10.23.1-.44-.37-.78-.75-.55C9.29 3.71 6.68 8 8.87 13.62c.18.46-.36.89-.75.59-1.81-1.37-2-3.34-1.84-4.75.06-.52-.62-.77-.91-.34C4.69 10.16 4 11.84 4 14.37c.38 5.6 5.11 7.32 6.81 7.54 2.43.31 5.06-.14 6.95-1.87 2.08-1.93 2.84-5.01 1.72-7.69zm-9.28 5.03c1.44-.35 2.18-1.39 2.38-2.31.33-1.43-.96-2.83-.09-5.09.33 1.87 3.27 3.04 3.27 5.08.08 2.53-2.66 4.7-5.56 2.32z" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
  </svg>
);

const EmojiEventsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
  </svg>
);

const LockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
  </svg>
);

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

interface StatsPanelProps {
  onBack?: () => void;
  score: number;
  streak: number;
  solutions: Solution[];
  currentDate: string;
  achievements: AchievementStatus[];
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

export default function StatsPanel({
  onBack,
  score,
  streak,
  solutions,
  currentDate,
  achievements,
  onShare,
}: StatsPanelProps) {
  const statCards = useMemo(
    () => [
      {
        icon: <CheckCircleIcon />,
        label: 'Solutions Today',
        value: solutions.length,
        description: `Equations solved for ${currentDate}`,
      },
      {
        icon: <StarIcon />,
        label: 'Total Score',
        value: score,
        description: 'Points earned from all solutions',
      },
      {
        icon: <LocalFireDepartmentIcon />,
        label: 'Current Streak',
        value: streak,
        description: 'Days with at least one solution',
      },
      {
        icon: <TrendingUpIcon />,
        label: 'Average Score',
        value: solutions.length > 0 ? Math.round(score / solutions.length) : 0,
        description: 'Average points per solution',
      },
    ],
    [currentDate, score, solutions.length, streak]
  );

  const solutionsReversed = useMemo(() => solutions.slice().reverse(), [solutions]);
  const unlockedCount = useMemo(
    () => achievements.filter((achievement) => achievement.unlocked).length,
    [achievements]
  );

  return (
    <section className="stats-panel" aria-label="Player statistics">
      <header className="stats-panel-header">
        {onBack && (
          <button
            type="button"
            className="stats-panel-back"
            onClick={onBack}
            aria-label="Back to game"
          >
            ← Back
          </button>
        )}
        <h2>Daily performance</h2>
        <p>Overview for {currentDate}</p>
      </header>

      <div className="stats-panel-grid">
        {statCards.map((stat) => (
          <article key={stat.label} className="stats-panel-card">
            <div className="stats-panel-icon" aria-hidden="true">
              {stat.icon}
            </div>
            <div className="stats-panel-label">{stat.label}</div>
            <div className="stats-panel-value">{stat.value}</div>
            <p className="stats-panel-description">{stat.description}</p>
          </article>
        ))}
      </div>

      {solutionsReversed.length > 0 ? (
        <div className="stats-panel-solutions">
          <div className="stats-panel-solutions-header">
            <h3>Today's solutions</h3>
            {onShare && (
              <button type="button" className="stats-panel-share" onClick={onShare}>
                Share
              </button>
            )}
          </div>
          <ul>
            {solutionsReversed.map((solution, index) => {
              const key = solution.timestamp instanceof Date ? solution.timestamp.getTime() : index;

              return (
                <li key={key} className="stats-panel-solution-row">
                  <MathEquation equation={solution.equation} className="stats-panel-equation" />
                  <div className="stats-panel-solution-meta">
                    <span className="stats-panel-complexity">{solution.complexity}</span>
                    <span className="stats-panel-score">{solution.score} pts</span>
                    {solution.timeToSolve !== undefined && (
                      <span className="stats-panel-time" title="Time to solve">
                        <TimerIcon /> {formatTime(solution.timeToSolve)}
                      </span>
                    )}
                    {solution.wrongAttempts !== undefined && solution.wrongAttempts > 0 && (
                      <span className="stats-panel-attempts" title="Wrong attempts">
                        <ErrorIcon /> {solution.wrongAttempts}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="stats-panel-empty">
          <p>No solutions yet today.</p>
          <p>Submit your first equation to start tracking progress.</p>
        </div>
      )}

      <div className="stats-panel-achievements">
        <div className="stats-panel-achievements-header">
          <h3>Achievements</h3>
          <span>
            {unlockedCount}/{achievements.length} unlocked
          </span>
        </div>
        <ul className="stats-panel-achievement-list">
          {achievements.map((achievement) => (
            <li
              key={achievement.id}
              className="stats-panel-achievement"
              data-state={achievement.unlocked ? 'unlocked' : 'locked'}
            >
              <div className="stats-panel-achievement-icon" aria-hidden="true">
                {achievement.unlocked ? <EmojiEventsIcon /> : <LockIcon />}
              </div>
              <div className="stats-panel-achievement-content">
                <div className="stats-panel-achievement-title">{achievement.title}</div>
                <p className="stats-panel-achievement-description">{achievement.description}</p>
                <div className="stats-panel-achievement-meta">
                  {achievement.progress && (
                    <span className="stats-panel-achievement-progress">{achievement.progress}</span>
                  )}
                  {achievement.unlocked && achievement.unlockedOn && (
                    <span className="stats-panel-achievement-date">
                      Unlocked {achievement.unlockedOn}
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
