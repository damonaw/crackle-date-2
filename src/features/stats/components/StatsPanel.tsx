import { useMemo } from 'react';
import MathEquation from '../../math/components/MathEquation';
import type { Solution } from '../../game/types';
import './stats-panel.css';

interface StatsPanelProps {
  onBack?: () => void;
  score: number;
  streak: number;
  solutions: Solution[];
  currentDate: string;
}

export default function StatsPanel({
  onBack,
  score,
  streak,
  solutions,
  currentDate,
}: StatsPanelProps) {
  const statCards = useMemo(
    () => [
      {
        icon: '✅',
        label: 'Solutions Today',
        value: solutions.length,
        description: `Equations solved for ${currentDate}`,
      },
      {
        icon: '⭐',
        label: 'Total Score',
        value: score,
        description: 'Points earned from all solutions',
      },
      {
        icon: '🔥',
        label: 'Current Streak',
        value: streak,
        description: 'Days with at least one solution',
      },
      {
        icon: '📈',
        label: 'Average Score',
        value: solutions.length > 0 ? Math.round(score / solutions.length) : 0,
        description: 'Average points per solution',
      },
    ],
    [currentDate, score, solutions.length, streak]
  );

  const solutionsReversed = useMemo(() => solutions.slice().reverse(), [solutions]);

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
          <h3>Today's solutions</h3>
          <ul>
            {solutionsReversed.map((solution, index) => {
              const key = solution.timestamp instanceof Date ? solution.timestamp.getTime() : index;

              return (
                <li key={key} className="stats-panel-solution-row">
                  <MathEquation equation={solution.equation} className="stats-panel-equation" />
                  <div className="stats-panel-solution-meta">
                    <span className="stats-panel-complexity">{solution.complexity}</span>
                    <span className="stats-panel-score">{solution.score} pts</span>
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
    </section>
  );
}
