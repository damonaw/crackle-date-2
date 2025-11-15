## Summary
Redesign the back buttons used in Stats, Solutions, Achievements, and Tutorial panels so they feel intentional, modern, and accessible instead of the current simple text/arrow treatment.

## Motivation
After restyling the panels, the ad-hoc back buttons look out of place and don’t clearly communicate their purpose. The user asked to “rethink the back button,” which means giving it a consistent visual language, iconography, and semantics that match the new menu design while keeping it obvious on small screens.

## Proposed Changes
- Define a consistent back-button pattern (pill shape, icon, label) that adapts to light/dark themes and keeps sufficient tap area on mobile.
- Apply the new pattern across all panels that surfaced from the menu, ensuring each button aligns with the panel header layout.
- Confirm focus states, aria-labels, and keyboard navigation meet accessibility expectations.

## Impact
- Updates to panel components and CSS.
- Possible shared utility class for the back button to avoid duplication.
- Minimal risk to logic; purely visual/semantic adjustments.
