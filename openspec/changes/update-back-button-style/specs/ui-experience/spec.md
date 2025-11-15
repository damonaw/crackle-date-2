## ADDED Requirements
### Requirement: Consistent back button pattern
All secondary panels accessed from the menu MUST share a consistent back-button design and behavior.

#### Scenario: Unified back button styling
- **WHEN** a player opens the Stats, Solutions, Achievements, or Tutorial panel
- **THEN** the back button appears with the same icon + label, pill shape, padding, and focus outline, matching the refreshed UI theme.

#### Scenario: Accessible and responsive back button
- **WHEN** the user interacts with the back button via keyboard or on a small-screen touch device
- **THEN** the control has a visible focus state, sufficient hit area, and the correct aria-label, ensuring it is accessible and easy to activate.
