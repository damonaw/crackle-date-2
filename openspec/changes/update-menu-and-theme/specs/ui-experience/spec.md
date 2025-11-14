## ADDED Requirements
### Requirement: Small-screen friendly menu
The in-game menu MUST remain fully usable on 320px-wide devices and clearly separate navigation from settings.

#### Scenario: Menu fits iPhone SE
- **GIVEN** a device with a 320px viewport width
- **WHEN** the user opens the menu
- **THEN** the content fits onscreen without horizontal scrolling
- **AND** sections are grouped with headings so navigation items and settings are visually distinct
- **AND** the menu remains scrollable if content exceeds the viewport height.

### Requirement: Toggleable input-click indicator
Players MUST be able to enable or disable the gameplay input-click indicator from the menu, and the preference persists across sessions.

#### Scenario: Toggle controls visibility
- **WHEN** the player flips the “Show input clicks” toggle in the menu
- **THEN** the gameplay screen hides or shows the indicator immediately without reload
- **AND** the preference is stored so the choice survives reloads and date switches.

### Requirement: Refreshed theme colors
Theme palettes MUST reflect the purple brand in dark mode and add color to light-mode operator buttons without breaking accessibility.

#### Scenario: Purple-accented dark mode
- **WHEN** the player uses dark mode
- **THEN** the predominant accent/background hues incorporate a purple shade consistent with the app icon while keeping sufficient contrast for text and controls.

#### Scenario: Colorful operator buttons in light mode
- **WHEN** the game renders operator buttons in light mode
- **THEN** the buttons display colorful backgrounds/borders (not plain gray) with hover/focus states that remain readable and accessible.
