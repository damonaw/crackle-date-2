## ADDED Requirements
### Requirement: Consistent panel styling
Stats, Solutions, Achievements, and Tutorial panels MUST reuse the refreshed card design introduced in the menu.

#### Scenario: Panel cards match menu
- **WHEN** a player opens any of the panels from the menu
- **THEN** the panel header, body cards, and controls share the same radii, spacing, and color tokens as the menu so the UI feels cohesive.

### Requirement: Modern navigation semantics
Panel navigation MUST follow modern semantics with accessible headings, back buttons, and region labels.

#### Scenario: Panels use structured navigation
- **WHEN** the user views any panel
- **THEN** the top area includes a descriptive heading and properly-labelled back/navigation control with correct HTML semantics (e.g., `<nav>`, `<section>`, aria-labels)
- **AND** focus outlines are visible when tabbing through interactive elements.
