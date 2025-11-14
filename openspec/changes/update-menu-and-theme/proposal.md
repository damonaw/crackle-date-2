## Summary
Improve the in-game menu to fit comfortably on small screens (iPhone SE), provide clearer navigation, and add controls for input-click visibility. Refresh both dark and light themes so the dark palette leans into the purple brand color and the operator buttons in light mode feel more vibrant.

## Motivation
Players reported the current menu feels cramped on smaller phones and the settings/navigation items are hard to scan. They also want control over whether the click counter shows on the main screen. Finally, the default themes feel flat compared to the purple Crackle Date icon, so colors should better reflect the brand and make the operator pad livelier.

## Proposed Changes
- Redesign the slide-out menu so it fits within iPhone SE dimensions with clear sections (navigation vs settings) and improved spacing/scrolling.
- Add a toggle in the menu to show/hide the input-click indicator on the gameplay view, persisting the preference.
- Adjust the dark theme token(s) to introduce a richer purple hue while keeping contrast accessible.
- Update light-mode operator buttons with more color (e.g., subtle gradients/borders) without harming readability.

## Impact
- Updates to menu layout/styles, possibly component markup changes.
- Theme token updates plus operator button CSS tweaks.
- Game store + persistence changes for the new click-visibility preference, plus conditional rendering of the indicator.
- Regression risk around theme styling and layout; targeted testing/linting required.
