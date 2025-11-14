## Summary
Add a per-round input click metric so the game can show how many on-screen or keyboard inputs a player used while solving (or attempting to solve) the day's puzzle.

## Motivation
Players want to understand how many combinations they tried before landing on a valid equation. Tracking input clicks between the start of a round and a successful submission offers a skill indicator that rewards efficient reasoning. Persisting the counter for unfinished rounds avoids losing context if they leave mid-puzzle.

## Proposed Changes
- Count every equation-building input (digit selection, operator buttons, equals, parentheses, clear/backspace) triggered via clicks or keyboard once a round starts.
- Reset the counter when a player submits a valid solution or switches to a different date, but persist the current count in local storage while the round is in progress.
- Store the click count alongside saved solutions so the Solutions view can show how many inputs a successful attempt required.
- Surface the metric in the UI via the Solutions panel (per-solution badge) and a summary stat describing the current round's click count when no solution is recorded yet.

## Impact
- Updates to the Zustand store and persisted day state schema.
- UI updates in the Solutions panel (and possibly Stats) to display click counts.
- No server work—purely client-side/localStorage.
