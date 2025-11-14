## ADDED Requirements
### Requirement: Per-round input click counting
Players MUST see how many input interactions they used while attempting a puzzle, including unfinished rounds.

#### Scenario: Count every equation input
- **GIVEN** the player has started entering an equation for the current date
- **WHEN** they tap or press any button/shortcut that inserts digits, operators, equals, parentheses, uses clear/backspace, or attempts to submit the equation
- **THEN** the app increments the current round's input click count by 1
- **AND** the updated count is persisted to localStorage in case the session reloads.

#### Scenario: Reset after success or date switch
- **GIVEN** a round's click count has been accumulating
- **WHEN** the player submits a valid equation or selects a different puzzle date
- **THEN** the counter resets to 0 for the new round
- **AND** the prior round's total is stored with the solved equation (if one was submitted).

### Requirement: Display click totals in UI
The player MUST be able to view how many clicks each solution required and the total they have used so far in an unfinished round.

#### Scenario: Solution history shows clicks
- **GIVEN** a stored solution has an input click total
- **THEN** the Solutions view displays the count alongside the existing time/wrong-attempt badges for that entry.

#### Scenario: In-progress round total is visible
- **GIVEN** the player has used at least one click but has not submitted a valid solution for the current date
- **THEN** the Stats (or main game) panel surfaces the current click total so they can monitor how many combinations they have tried.
