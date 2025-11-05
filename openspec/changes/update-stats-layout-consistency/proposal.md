# Change: Update stats panel layout to match solutions and achievements

## Why
The stats panel currently uses a different layout pattern compared to the solutions and achievements panels. Creating visual consistency across all panels will improve user experience and make the application feel more cohesive and professional.

## What Changes
- Redesign StatsPanel to use the same header, summary, and content structure as SolutionsPanel and AchievementsPanel
- Update CSS to match the visual styling patterns used in other panels
- Maintain all existing stats functionality while improving the layout
- Ensure responsive design consistency across all panels

## Impact
- Affected specs: ui-navigation, stats-display
- Affected code: StatsPanel.tsx, stats-panel.css

## Visual Consistency Goals
- Header with back button, title, and description
- Summary section with key statistics cards
- Consistent spacing, typography, and color scheme
- Responsive design matching other panels