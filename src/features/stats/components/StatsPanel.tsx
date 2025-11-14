import { useMemo } from 'react';
import './stats-panel.css';

interface StatsPanelProps {
  onBack?: () => void;
  score: number;
  streak: number;
  inputClicks: number;
}

export default function StatsPanel({ onBack, score, streak, inputClicks }: StatsPanelProps) {
  const stats = useMemo(() => {
    const averageScore = score > 0 ? Math.round(score / Math.max(streak, 1)) : 0;
    return {
      totalScore: score,
      currentStreak: streak,
      averageScore,
      daysPlayed: streak,
      currentClicks: inputClicks,
    };
  }, [inputClicks, score, streak]);

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
        <h2>Statistics</h2>
        <p>Track your performance and progress</p>
      </header>

      <div className="stats-panel-summary">
        <div className="stats-panel-stats">
          <div className="stats-panel-stat">
            <div className="stats-panel-stat-value">{stats.totalScore}</div>
            <div className="stats-panel-stat-label">Total Score</div>
          </div>
          <div className="stats-panel-stat">
            <div className="stats-panel-stat-value">{stats.currentStreak}</div>
            <div className="stats-panel-stat-label">Current Streak</div>
          </div>
          <div className="stats-panel-stat">
            <div className="stats-panel-stat-value">{stats.averageScore}</div>
            <div className="stats-panel-stat-label">Average Score</div>
          </div>
          <div className="stats-panel-stat">
            <div className="stats-panel-stat-value">{stats.daysPlayed}</div>
            <div className="stats-panel-stat-label">Days Played</div>
          </div>
          <div className="stats-panel-stat">
            <div className="stats-panel-stat-value">{stats.currentClicks}</div>
            <div className="stats-panel-stat-label">Current Clicks</div>
          </div>
        </div>
      </div>
    </section>
  );
}
