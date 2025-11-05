# Change: Add separate achievements menu item

## Why
The achievements section is currently embedded within the stats panel, making it less discoverable and harder to navigate. Users want dedicated access to their achievements as a separate menu item for better organization and user experience.

## What Changes
- Add new "Achievements" menu item in the main navigation menu
- Create a dedicated achievements view/screen component
- Move achievements display from StatsPanel to new AchievementsPanel component
- Update GameScreen to handle new 'achievements' view mode
- Remove achievements section from StatsPanel component

## Impact
- Affected specs: ui-navigation, achievements-display
- Affected code: GameScreen.tsx, StatsPanel.tsx, new AchievementsPanel.tsx