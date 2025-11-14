## Tasks
1. Extend the game state, localStorage schema, and solution objects to capture an `inputClicks` counter that resets on successful submissions/date changes yet persists for in-progress rounds.
2. Increment the counter from every digit/operator/clear/backspace action (including keyboard shortcuts) and include the value when saving a solution.
3. Update the Solutions panel UI to show the click count per solution alongside time/wrong attempt badges.
4. Surface the current round's click count in the Stats or Game UI so players can see total clicks even before solving.
5. Add or update automated/manual validation steps (e.g., unit tests around state helpers) to ensure the counter persists and resets as expected.
