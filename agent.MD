# Crackle-Date agent guide

## Project overview
- Daily math puzzle web app where players build equations using the digits of today's date (US Eastern Time, `M-DD-YYYY`).
- Frontend powered by React 19 + TypeScript and bundled with Vite.
- Core libraries: Zustand (state), mathjs (validation/evaluation), KaTeX (rendering), and native CSS for styling/theming.

## Game rules
- All digits from the date must be used exactly once and in the original order.
- Exactly one equals sign (`=`) is required; both sides must evaluate to the same value.
- Allowed operations: `+`, `-`, `*`, `/`, `^`, `%`, factorial `!`, square root `sqrt()`, absolute value `abs()`, and parentheses.
- Disallow logical/bitwise operators and any use of `eval`.
- Scoring rewards creative, complex solutions while penalizing trivial ones (see `src/features/game/lib/scoring.ts`).

## Architecture & file layout
```
src/
  app/                 # Root App component
  features/
    game/             # Game UI, Zustand store, and domain logic
      components/
      lib/            # Date/math utilities, persistence helpers
      state/
      types.ts
    math/             # KaTeX rendering component
    stats/            # Stats panel UI
    theme/            # Theme resolution hook
  index.css           # Global design tokens & resets
```
- `GameScreen` hosts the main gameplay flow and light-weight menu.
- Theme preference is resolved via `useThemeMode`, which applies a `data-theme` attribute to `<html>`.
- Local storage helpers live in `src/features/game/lib/localStorage.ts` and provide backwards-compatible persistence.

## Tooling & commands
```
npm run dev       # Vite dev server (hosted)
npm run build     # Type check + production build
npm run preview   # Preview production build
npm run test      # Vitest
npm run lint      # ESLint + Stylelint
npm run format    # Prettier
```
- Tests rely on Vitest with React Testing Library; setup file is `src/test/setup.ts`.
- Stylelint/Prettier target the new CSS + TS structure—prefer configuration over custom overrides.

## Development principles
- Favor small, composable components and data-driven configuration (e.g., operator layouts in `GameScreen`).
- Keep business rules in `lib/` modules with thorough unit coverage when possible.
- Maintain accessibility: keyboard input parity is critical for the equation builder.
- Persisted data must remain compatible with existing localStorage schema.
- Avoid reintroducing large UI frameworks without discussion; use CSS variables defined in `index.css`.

## Questions for the maintainer
1. May we sunset the legacy `darkMode` boolean stored in user preferences, or should compatibility be preserved indefinitely?
2. Do you have brand guidelines (logo, colors, typography) we should align the new minimalist UI with?
