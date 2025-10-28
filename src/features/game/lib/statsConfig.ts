export interface StatCardConfig {
  iconType: 'CheckCircle' | 'Star' | 'TrendingUp' | 'Calculate';
  iconColor: 'success' | 'warning' | 'text';
  label: string;
  value: number;
  description: string;
}

export const createStatCardConfigs = (
  solutionsCount: number,
  score: number,
  streak: number,
  currentDate: string
): StatCardConfig[] => [
  {
    iconType: 'CheckCircle',
    iconColor: 'success',
    label: 'Solutions Today',
    value: solutionsCount,
    description: `Equations solved for ${currentDate}`,
  },
  {
    iconType: 'Star',
    iconColor: 'warning',
    label: 'Total Score',
    value: score,
    description: 'Points earned from all solutions',
  },
  {
    iconType: 'TrendingUp',
    iconColor: 'success',
    label: 'Current Streak',
    value: streak,
    description: 'Days with at least one solution',
  },
  {
    iconType: 'Calculate',
    iconColor: 'text',
    label: 'Average Score',
    value: solutionsCount > 0 ? Math.round(score / solutionsCount) : 0,
    description: 'Average points per solution',
  },
];
