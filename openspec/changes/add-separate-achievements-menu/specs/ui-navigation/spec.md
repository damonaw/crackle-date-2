## ADDED Requirements
### Requirement: Dedicated Achievements Navigation
The application SHALL provide a separate menu item for accessing achievements.

#### Scenario: Navigate to achievements from menu
- **WHEN** user opens the main menu
- **THEN** they SHALL see an "Achievements" menu item
- **WHEN** user taps the "Achievements" menu item
- **THEN** the application SHALL display the dedicated achievements screen

#### Scenario: Return to game from achievements
- **WHEN** user is viewing the achievements screen
- **THEN** they SHALL see a back button to return to the game
- **WHEN** user taps the back button
- **THEN** the application SHALL return to the game view

### Requirement: Achievements Display Component
The application SHALL display achievements in a dedicated component separate from statistics.

#### Scenario: View all achievements
- **WHEN** user navigates to the achievements screen
- **THEN** they SHALL see all available achievements with their current status
- **THEN** unlocked achievements SHALL show their unlock date and trophy icon
- **THEN** locked achievements SHALL show a lock icon and progress information

## MODIFIED Requirements
### Requirement: Statistics Panel Content
The statistics panel SHALL focus on performance metrics and solutions without achievements.

#### Scenario: View statistics without achievements
- **WHEN** user navigates to the stats screen
- **THEN** they SHALL see performance metrics (solutions, score, streak, average)
- **THEN** they SHALL see today's solutions with share functionality
- **THEN** they SHALL NOT see any achievements section

### Requirement: Main Navigation Menu
The main navigation menu SHALL include separate items for stats and achievements.

#### Scenario: Access different game sections
- **WHEN** user opens the main menu
- **THEN** they SHALL see separate menu items for "Stats" and "Achievements"
- **WHEN** user taps "Stats" they SHALL see the statistics panel
- **WHEN** user taps "Achievements" they SHALL see the achievements panel