import { useMemo } from 'react';
import type { AchievementStatus } from '../../game/types';
import PanelBackButton from '../../ui/components/PanelBackButton';
import '../../ui/components/panel-base.css';
import './achievements-panel.css';

// Material UI style icons as SVG components
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

interface AchievementsPanelProps {
  onBack?: () => void;
  achievements: AchievementStatus[];
}

export default function AchievementsPanel({ onBack, achievements }: AchievementsPanelProps) {
  const stats = useMemo(() => {
    const unlockedCount = achievements.filter((achievement) => achievement.unlocked).length;
    const totalCount = achievements.length;
    const percentage = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

    return {
      unlockedCount,
      totalCount,
      percentage,
    };
  }, [achievements]);

  const achievementsByCategory = useMemo(() => {
    const categories: Record<string, AchievementStatus[]> = {};

    achievements.forEach((achievement) => {
      const category = achievement.category || 'General';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(achievement);
    });

    return categories;
  }, [achievements]);

  return (
    <section className="app-panel achievements-panel" aria-labelledby="achievements-heading">
      <header className="app-panel-header achievements-panel-header">
        {onBack && <PanelBackButton className="app-panel-back" onClick={onBack} />}
        <h2 id="achievements-heading">Achievements</h2>
      </header>

      <div className="app-panel-body">
        <div className="achievements-panel-summary" role="region" aria-label="Achievement stats">
          <div className="achievements-panel-stats">
            {[
              { label: 'Unlocked', value: stats.unlockedCount },
              { label: 'Total', value: stats.totalCount },
              { label: 'Complete', value: `${stats.percentage}%` },
            ].map((item) => (
              <article key={item.label} className="achievements-panel-stat">
                <p className="achievements-panel-stat-label">{item.label}</p>
                <p className="achievements-panel-stat-value">{item.value}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="achievements-panel-categories">
          {Object.entries(achievementsByCategory).map(([category, categoryAchievements]) => (
            <div key={category} className="achievements-panel-category">
              <h3 className="achievements-panel-category-title">{category}</h3>
              <ul className="achievements-panel-list">
                {categoryAchievements.map((achievement) => (
                  <li
                    key={achievement.id}
                    className="achievements-panel-item"
                    data-state={achievement.unlocked ? 'unlocked' : 'locked'}
                  >
                    <div className="achievements-panel-icon" aria-hidden="true">
                      {achievement.unlocked ? <EmojiEventsIcon /> : <LockIcon />}
                    </div>
                    <div className="achievements-panel-content">
                      <div className="achievements-panel-title">{achievement.title}</div>
                      <p className="achievements-panel-detail">{achievement.description}</p>
                      <div className="achievements-panel-meta">
                        {achievement.progress && (
                          <span className="achievements-panel-progress">
                            {achievement.progress}
                          </span>
                        )}
                        {achievement.unlocked && achievement.unlockedOn && (
                          <span className="achievements-panel-date">
                            Unlocked {achievement.unlockedOn}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
