# Change: Add separate solutions menu item

## Why
The solutions section is currently embedded within the stats panel, making it less discoverable and harder to navigate. Users want dedicated access to their solutions as a separate menu item for better organization and user experience.

## What Changes
- Add new "Solutions" menu item in the main navigation menu
- Create a dedicated solutions view/screen component
- Move solutions display from StatsPanel to new SolutionsPanel component
- Update GameScreen to handle new 'solutions' view mode
- Remove solutions section from StatsPanel component

## Impact
- Affected specs: ui-navigation, solutions-display
- Affected code: GameScreen.tsx, StatsPanel.tsx, new SolutionsPanel.tsx