# Project Context

## Purpose
Crackle Date is a mobile-first PWA that delivers a daily math puzzle built from the current US Eastern Time date. Players must place every digit of the date in order, insert exactly one equals sign, and craft a mathematically valid equation. The app surfaces per-date leaderboards (total score, average, streaks), unlockable achievements, and solution history with timestamps so players can review progress. A tutorial, keyboard shortcuts, and easy-mode previews help new solvers ramp up quickly, while persistent storage keeps prior days and preferences available across sessions.

## Tech Stack
- **Language & Framework**: React 19.1 + TypeScript 5.8 in strict mode with JSX runtime
- **Build Tooling**: Vite 7 with TypeScript project references (`tsconfig.app.json` / `tsconfig.node.json`) and a relative `base` so builds in `docs/` run on GitHub Pages regardless of repo slug
- **State Management**: Single Zustand 5 store (`src/features/game/state/game-store.ts`) plus local component state for transient UI
- **Math & Rendering**: mathjs 14 for secure parsing/evaluation and KaTeX 0.16 for LaTeX-quality equation rendering
- **Styling**: Hand-written CSS with CSS custom properties defined in `src/index.css`; no component framework
- **Testing**: Vitest 3 (jsdom) with React Testing Library, `@testing-library/user-event`, and global `@testing-library/jest-dom` setup in `src/test/setup.ts`
- **Quality Tooling**: ESLint 9 flat config, TypeScript-ESLint, React Hooks rules, Stylelint 16 + `stylelint-order`, and Prettier 3 (100 char width, semicolons, single quotes, 2 spaces)
- **Deployment**: GitHub Actions workflow (`.github/workflows/deploy.yml`) targeting GitHub Pages plus `scripts/deploy-gh-pages.js` for local deploy prep that runs tests, lint, and Vite build

## Project Conventions

### Code Style
- **TypeScript**: `strict`, `noUnusedLocals`, and `noUnusedParameters` are enforced; modules must export explicit types
- **Imports**: Relative imports within `src` to make feature boundaries clear; avoid `@/*` aliases
- **Formatting**: Prettier config enforces semicolons, single quotes, 100-character lines, and 2-space indentation
- **ESLint Rules**: Flat config blocks raw hex string literals in TS/TSX and requires React Hook dependency arrays; Stylelint additionally forbids hex colors in CSS and enforces alphabetical properties
- **CSS Guidance**: Use theme tokens (CSS custom properties) instead of raw colors, keep selectors small, and co-locate component styles beside the component when practical
- **Error Handling**: Input/validation utilities throw descriptive errors, UI path wraps risky operations with try/catch and user-facing messaging (toasts/dialogs)

### Architecture Patterns
- **Feature-First Layout**: Each domain lives in `src/features/<domain>` with nested `components/`, `lib/`, `state/`, and `types.ts` to keep UI, business logic, and state isolated
- **Game Core**: `src/features/game` houses equation validation (`mathValidator.ts`), date utilities (`dateUtils.ts`), scoring (`scoring.ts`), achievements, and the Zustand store that persists to localStorage through `lib/localStorage.ts`
- **Supporting Features**: `features/math` wraps KaTeX rendering, `features/stats` visualizes streaks/averages, `features/theme` provides `useThemeMode` for light/dark/system cycling, and `features/tutorial` controls the onboarding overlay
- **React Usage**: All components are functional, rely on hooks, and memoize expensive derived state; side effects respect dependency arrays
- **Persistence**: Game state, stats, and user preferences hydrate from localStorage on boot and write back via debounced save helpers; exports/imports handle schema migration
- **PWA Setup**: `public/manifest.json`, `icon.svg`, service-worker-ready Vite build, and `404.html` ensure installability and SPA routing

### State, Data, and Time Rules
- **Single Source of Truth**: `useGameStore` orchestrates date selection, solutions, score totals, achievements, streaks, wrong attempt counters, and timer tracking
- **Date Handling**: All puzzles use `getTodaysGameDate()` which normalizes to US Eastern Time and exposes helper utilities for parsing or listing recent dates
- **Scoring & Complexity**: `mathOperations.ts` tags every operator with a complexity weight that feeds into `scoring.ts` for multipliers and streak bonuses
- **Validation Pipeline**: Input is validated in stages—digit order enforcement (`inputValidator.ts`), operator availability, math correctness via mathjs parse/evaluate, and duplicate detection before persisting
- **Preferences**: Theme mode, easy mode, and tutorial completion live alongside puzzle history so UI choices persist across sessions

### Testing Strategy
- **Frameworks**: Vitest (watch via `npm run test`, CI via `npm run test:run`, UI via `npm run test:ui`) with jsdom environment configured in `vitest.config.ts`
- **Utilities**: React Testing Library + `@testing-library/user-event` drive component and hook tests; `@testing-library/jest-dom` assertions loaded globally
- **Coverage Priorities**: Focus on business logic modules (validation, scoring, date helpers) and Zustand selectors; UI snapshot tests avoided in favor of interaction assertions
- **Developer Experience**: `npx vitest run path/to/test.ts` or `--grep "name"` for targeted suites; deployment scripts fail fast if lint/tests fail

### Build & Deployment
- **Build Output**: `npm run build` runs `tsc -b` then Vite, writing bundles to `docs/` with both `index.html` and `404.html` (via manual copy) for GitHub Pages support
- **Dev Server**: `npm run dev` starts Vite with `--host` so phones/tablets on the LAN can connect; `npm run preview` serves the production bundle locally
- **Deployment Automation**: `.github/workflows/deploy.yml` runs lint, tests, build, uploads `docs/`, and publishes to Pages; `scripts/deploy-gh-pages.js` gives the same pipeline locally and reminds about manual upload or push-to-main flows

### Git Workflow
- **Branching**: Develop new work on feature branches, keep `main` deployable; automated deployment triggers on pushes to `main`
- **Pre-commit**: Husky `prepare` script installs hooks; lint-staged runs ESLint, Stylelint, and Prettier on staged files with `--max-warnings=0`
- **Reviews**: Specs/changes should reference OpenSpec change IDs; implementation PRs link back to the approved proposal before merge

## Domain Context
- **Gameplay Rules**: Every puzzle digit (format `M-DD-YYYY`) must appear exactly once in order with one equals sign; allowed operators include `+, -, ×, ÷, ^, %, √, !, |x|`, parentheses, and concatenation where valid
- **Experience Features**: Tutorial modal for first-time play, easy mode that previews evaluation, toasts for validation errors, and keyboard shortcuts (`x`→`×`, `s`→`√`, `a`→`|x|`, digits, Enter/Backspace)
- **Scoring & Achievements**: Complexity tiers (trivial through advanced) influence multipliers; bonus points for first solution, streaks, and correctness; achievements such as streak milestones or high-score runs display in stats
- **Statistics**: `StatsPanel` shows total score, per-date best, averages, streaks, solve times, wrong attempts, and solution history with KaTeX rendering
- **Multi-Date Play**: Date picker lets players replay recent puzzles, view stored solutions, and continue incomplete days thanks to persisted history
- **Sharing & Social**: Copy/share helpers summarize solutions for sending to friends without exposing spoilers

## Important Constraints
- **Security**: No `eval()`—all expressions parse through mathjs; inputs sanitized before mathjs evaluation to prevent arbitrary code execution
- **Validation Discipline**: Input validator enforces digit order, one `=`, matching parentheses, and balanced operators before any scoring or persistence
- **Data Integrity**: LocalStorage schema migrations keep historical data usable; saves are debounced but must never lose completed solutions
- **Time & Locale**: Date math assumes US Eastern Time so the "daily" puzzle ticks over consistently regardless of client locale
- **Performance**: UI must stay responsive on low-end mobile, so expensive recomputations are memoized and KaTeX rendering is scoped to visible nodes
- **Accessibility**: Maintain keyboard-first navigation, focus states, aria labels, and minimum target sizing; theme contrast requirements honored via the shared tokens
- **PWA Expectations**: Manifest values, icons, and relative asset paths must stay accurate so installs and offline caching work on GitHub Pages

## External Dependencies
- **React / React DOM**: UI rendering (v19.1.1)
- **Zustand**: Lightweight global store for the game lifecycle (v5.0.8)
- **mathjs**: Deterministic parsing/evaluation of both sides of the equation with custom pre-processing (v14.7.0)
- **KaTeX**: Typesets equations inside solution history and stats readouts (v0.16.22)
- **Vitest + React Testing Library**: Component and logic testing stack with jsdom runners
- **Husky + lint-staged**: Enforce lint/format before commits and keep repo consistent
