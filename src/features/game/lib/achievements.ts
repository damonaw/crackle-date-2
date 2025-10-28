import type { AchievementStatus } from '../types';
import type { GameStats } from './localStorage';

interface AchievementRule {
  id: string;
  title: string;
  description: string;
  check: (stats: GameStats) => { unlocked: boolean; progress?: string };
}

const getBestScore = (stats: GameStats): number => {
  const scores = Object.values(stats.dailyBestScores ?? {});
  if (scores.length === 0) {
    return 0;
  }
  return Math.max(...scores);
};

const ACHIEVEMENTS: AchievementRule[] = [
  {
    id: 'first-solution',
    title: 'First Solution',
    description: 'Submit your first valid equation.',
    check: (stats) => ({
      unlocked: stats.daysPlayed >= 1,
      progress: `${Math.min(stats.daysPlayed, 1)}/1 days`,
    }),
  },
  {
    id: 'streak-3',
    title: '3-Day Heater',
    description: 'Solve puzzles on three consecutive days.',
    check: (stats) => ({
      unlocked: stats.maxStreak >= 3,
      progress: `${Math.min(stats.maxStreak, 3)}/3 days`,
    }),
  },
  {
    id: 'streak-7',
    title: 'Weeklong Wizard',
    description: 'Keep your daily streak alive for seven days.',
    check: (stats) => ({
      unlocked: stats.maxStreak >= 7,
      progress: `${Math.min(stats.maxStreak, 7)}/7 days`,
    }),
  },
  {
    id: 'weekly-warrior',
    title: 'Weekly Warrior',
    description: 'Complete seven unique Crackle Date challenges.',
    check: (stats) => ({
      unlocked: stats.daysPlayed >= 7,
      progress: `${Math.min(stats.daysPlayed, 7)}/7 days`,
    }),
  },
  {
    id: 'high-score-300',
    title: 'High Roller',
    description: 'Earn a daily best score of 300 points.',
    check: (stats) => {
      const best = getBestScore(stats);
      return {
        unlocked: best >= 300,
        progress: `${best} pts`,
      };
    },
  },
];

export const evaluateAchievements = (stats: GameStats): AchievementStatus[] =>
  ACHIEVEMENTS.map((achievement) => {
    const result = achievement.check(stats);
    const unlockedOn = stats.achievementDates?.[achievement.id];

    return {
      id: achievement.id,
      title: achievement.title,
      description: achievement.description,
      unlocked: result.unlocked,
      progress: result.progress,
      unlockedOn: result.unlocked ? unlockedOn : undefined,
    };
  });

export const recordAchievementDates = (stats: GameStats, date: string): void => {
  if (!stats.achievementDates) {
    stats.achievementDates = {};
  }

  const statuses = evaluateAchievements(stats);
  statuses.forEach((achievement) => {
    if (achievement.unlocked && !stats.achievementDates?.[achievement.id]) {
      stats.achievementDates![achievement.id] = date;
    }
  });
};

export const getAchievementRules = (): AchievementRule[] => ACHIEVEMENTS;
