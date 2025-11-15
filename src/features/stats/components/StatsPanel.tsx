import { useMemo } from 'react';
import PanelBackButton from '../../ui/components/PanelBackButton';
import '../../ui/components/panel-base.css';
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
    <section className="app-panel stats-panel" aria-labelledby="stats-heading">
      <header className="app-panel-header stats-panel-header">
        {onBack && <PanelBackButton className="app-panel-back" onClick={onBack} />}
        <h2 id="stats-heading">Statistics</h2>
      </header>

      <div className="app-panel-body">
        <div className="stats-panel-grid" role="region" aria-label="Statistic summaries">
          {[
            { label: 'Total Score', value: stats.totalScore },
            { label: 'Current Streak', value: stats.currentStreak },
            { label: 'Average Score', value: stats.averageScore },
            { label: 'Days Played', value: stats.daysPlayed },
            { label: 'Current Clicks', value: stats.currentClicks },
          ].map((item) => (
            <article key={item.label} className="stats-panel-card">
              <p className="stats-panel-card-label">{item.label}</p>
              <p className="stats-panel-card-value">{item.value}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
