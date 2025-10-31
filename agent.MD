# Crackle-Date Agent Guide

## Project Overview
Crackle Date is a daily math puzzle Progressive Web App (PWA) where players create valid mathematical equations using the digits from today's date in exact order.

**Technical Stack:**
- **Frontend**: React 19.1 + TypeScript 5.8
- **State Management**: Zustand 5.0 (lightweight global store)
- **Math Processing**: mathjs 14.7 (secure expression evaluation and parsing)
- **Math Rendering**: KaTeX 0.16 (LaTeX-quality mathematical notation)
- **Build Tool**: Vite 7.1 (fast development and optimized production builds)
- **Styling**: Native CSS with CSS variables and design tokens
- **Code Quality**: ESLint 9, Stylelint 16, Prettier 3.6, Husky + lint-staged

**Date Format**: `M-DD-YYYY` based on US Eastern Time (e.g., "9-18-2025")

## Game Rules

### Core Mechanics
1. **Digit Usage**: All digits from the date must be used exactly once and in the original order
2. **Equation Structure**: Exactly one equals sign (`=`) is required; both sides must evaluate to the same mathematical value
3. **Allowed Operations**: `+`, `-`, `*`, `/`, `^` (power), `%` (modulo), `!` (factorial), `sqrt()`, `abs()`, and parentheses `()`
4. **Security**: No logical/bitwise operators allowed. All expressions validated through mathjs (no direct `eval` usage)

### Scoring System (see `src/features/game/lib/scoring.ts`)
Base score starts at 10 points, then multiplied by complexity:
- **Trivial** (0.5x): Basic operations like `9×0=1×8×2×0×2×5×0` - discouraged
- **Simple** (1x): Straightforward solutions (10-25 points)
- **Moderate** (2x): Some creative operation usage (25-40 points)
- **Complex** (4x): Advanced mathematical thinking (50-80 points)
- **Advanced** (8x): Exceptional creativity and complexity (100+ points)

Additional bonuses:
- +5 points for valid mathematical correctness
- +10 points for using all digits in correct order
- First solution of the day bonus
- Streak bonus (up to +10 points)

## Architecture & File Layout

### Directory Structure
```
src/
  app/
    App.tsx                                  # Root component wrapper
  features/
    game/
      components/
        GameScreen.tsx                       # Main UI: operator buttons, equation display, menu
        DatePicker.tsx                       # Date selection component
        *.css                                # Component-specific styles
      lib/
        achievements.ts                      # Achievement definitions and evaluation logic
        dateUtils.ts                         # Date parsing/formatting, EST timezone handling
        inputValidator.ts                    # Real-time input validation, digit order checking
        localStorage.ts                      # Persistence layer, data migration, import/export
        mathOperations.ts                    # Operator definitions with complexity scores
        mathValidator.ts                     # Equation validation and mathematical correctness
        scoring.ts                           # Score calculation based on complexity
        statsConfig.ts                       # Statistics configuration
      state/
        game-store.ts                        # Zustand store with all game state and actions
      types.ts                               # TypeScript interfaces and types
    math/
      components/
        MathEquation.tsx                     # KaTeX wrapper for equation rendering
    stats/
      components/
        StatsPanel.tsx                       # Statistics display, achievements, solution history
    theme/
      hooks/
        useThemeMode.ts                      # Theme detection (system/light/dark) and switching
  test/
    setup.ts                                 # Vitest test configuration
  index.css                                  # Global design tokens, CSS variables, resets
  main.tsx                                   # React entry point with strict mode
  vite-env.d.ts                              # Vite type definitions
```

### Key Components

**GameScreen (`src/features/game/components/GameScreen.tsx`)**
- Main gameplay interface with operator button grid (3 columns × 4 rows)
- Equation input display with digit highlighting
- Menu with date picker, theme toggle, and settings
- Tutorial modal for first-time users
- Toast notifications for feedback
- Easy mode toggle showing real-time equation evaluation
- Share functionality for solutions

**Game Store (`src/features/game/state/game-store.ts`)**
- Centralized state management using Zustand
- Handles equation state, solutions, scores, streaks, achievements
- Manages date selection and multi-date history
- Automatic persistence to localStorage with debouncing
- State hydration on load with migration support

**localStorage Module (`src/features/game/lib/localStorage.ts`)**
- Three storage keys: game data, statistics, user preferences
- Backwards-compatible data migration from legacy formats
- Per-date solution history with metadata (time, attempts, complexity)
- Import/export functionality for backups
- Safe access with fallbacks when localStorage unavailable

**Theme System (`src/features/theme/hooks/useThemeMode.ts`)**
- Three modes: system (auto-detect), light, dark
- Applies `data-theme` attribute to `<html>` element
- Persists preference in localStorage
- Cycles through modes via UI button

## Tooling & Commands

### Development Scripts
```bash
npm run dev        # Start Vite dev server with host flag (accessible on network)
npm run build      # TypeScript compilation + production build (outputs to docs/)
npm run preview    # Preview production build locally
npm run test       # Run Vitest in watch mode
npm run test:ui    # Run Vitest with UI interface
npm run test:run   # Run tests once (CI mode)
npm run lint       # Run ESLint + Stylelint on source files
npm run format     # Format all source files with Prettier
```

### Build Configuration
- **TypeScript**: Project references configured in `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- **Vite**: Configured in `vite.config.ts` to output to `docs/` directory for GitHub Pages
- **Vitest**: Test setup in `vitest.config.ts` and `src/test/setup.ts` with jsdom environment

### Linting & Formatting
- **ESLint**: `eslint.config.js` using flat config format with React and TypeScript plugins
- **Stylelint**: `.stylelintrc.json` with standard config and ordering plugin
- **Prettier**: `.prettierrc` for consistent code formatting
- **Husky**: `.husky/` directory contains pre-commit hooks
- **Lint-Staged**: `package.json` configures what to run on staged files

## Development Principles

### Code Organization
- **Feature-Based Structure**: Code organized by feature domain (game, math, stats, theme)
- **Separation of Concerns**: UI components in `components/`, business logic in `lib/`, state in `state/`
- **Small, Composable Components**: Prefer smaller focused components over monolithic ones
- **Data-Driven Configuration**: Use constants for configuration (e.g., `OPERATOR_COLUMNS` in GameScreen)
- **Type Safety**: Leverage TypeScript strictly - all code is 100% TypeScript

### State Management
- **Single Store Pattern**: One Zustand store (`game-store.ts`) manages all game state
- **Action-Based Updates**: State changes through store actions, never direct mutations
- **Persistence Strategy**: Automatic save with debouncing (100ms) after state changes
- **State Hydration**: Load and migrate state on app initialization

### Accessibility
- **Keyboard Navigation**: Full keyboard support is critical
  - All interactive elements keyboard accessible
  - Enter to submit, Backspace to delete
  - Keyboard shortcuts for operators (x→×, s→√, a→|x|)
- **ARIA Labels**: Use appropriate aria-label attributes for screen readers
- **Touch Targets**: Minimum 44×44px touch targets for mobile
- **Error Messages**: Clear, actionable error messages for user feedback

### Data Persistence
- **Backward Compatibility**: Must support migration from legacy data formats
- **Schema Versioning**: Include version numbers in exported data
- **Graceful Degradation**: Handle localStorage unavailability
- **Per-Date History**: Store complete state for each puzzle date independently

### Styling
- **CSS Variables**: Use design tokens defined in `index.css` for theming
- **No UI Frameworks**: Keep dependencies minimal - native CSS only
- **Mobile-First**: Design for mobile screens first, then scale up
- **Theme Support**: All colors and styles must respect light/dark/system themes

### Performance
- **Code Splitting**: Consider dynamic imports for large features
- **Memoization**: Use `useMemo` and `useCallback` for expensive computations
- **Debouncing**: Debounce frequent operations (e.g., localStorage saves)
- **Lazy Loading**: Load heavy libraries (KaTeX) only when needed

## Data Models

### GameState Interface
```typescript
interface GameState {
  currentDate: string;           // Current selected puzzle date (M-DD-YYYY)
  equation: string;              // Current equation being built
  isValid: boolean;              // Whether last validation passed
  score: number;                 // Total score for current date
  streak: number;                // Current consecutive days streak
  solutions: Solution[];         // All solutions for current date
  availableDates: string[];      // Dates available to play (recent + played)
  achievements: AchievementStatus[];  // Achievement progress
  wrongAttempts: number;         // Failed submission count for current date
  startTime: number | null;      // Timestamp when first digit entered
  easyMode: boolean;             // Easy mode enabled flag
}
```

### Solution Interface
```typescript
interface Solution {
  equation: string;              // The complete equation
  score: number;                 // Points earned
  timestamp: Date;               // When submitted
  complexity: ComplexityLevel;   // trivial|simple|moderate|complex|advanced
  timeToSolve?: number;          // Seconds to solve (optional)
  wrongAttempts?: number;        // Failed attempts before success (optional)
}
```

### localStorage Schema
Three separate keys in localStorage:
1. **`crackle-date-game`**: Game data with per-date history
   ```typescript
   {
     lastSelectedDate: string;
     history: {
       [date: string]: {
         equation: string;
         solutions: StoredSolutionData[];
         isValid: boolean;
         completed: boolean;
         wrongAttempts?: number;
         startTime?: number | null;
       }
     }
   }
   ```

2. **`crackle-date-stats`**: Global statistics
   ```typescript
   {
     gamesPlayed: number;
     gamesWon: number;
     currentStreak: number;
     maxStreak: number;
     winPercentage: number;
     averageScore: number;
     scoreDistribution: { [score: string]: number };
     lastPlayedDate: string;
     dailyBestScores: { [date: string]: number };
     daysPlayed: number;
     achievementDates?: { [achievementId: string]: string };
   }
   ```

3. **`crackle-date-prefs`**: User preferences
   ```typescript
   {
     darkMode: boolean;          // Legacy field for compatibility
     soundEnabled: boolean;
     themeMode?: 'light' | 'dark' | 'system';
     tutorialSeen?: boolean;
     easyMode?: boolean;
   }
   ```

## Validation Flow

### Input Validation (`inputValidator.ts`)
1. Check if next input is a digit or operator
2. If digit: verify it matches next required digit from date
3. If operator: allow if valid mathematical operator
4. If equals sign: ensure only one exists in equation
5. Return validation result with error message if invalid

### Equation Validation (`mathValidator.ts`)
1. **Basic Checks**: Non-empty, contains exactly one `=`, both sides have content
2. **Digit Validation**: Extract all digits, verify count and order match date
3. **Mathematical Validation**: 
   - Normalize expression (convert √ to sqrt, × to *, etc.)
   - Parse both sides with mathjs
   - Evaluate both sides
   - Check equality with floating-point tolerance (1e-10)
4. **Complexity Calculation**: Score based on operations used
5. Return validation result with detailed feedback

## Achievements System

Five achievements currently implemented (see `achievements.ts`):
1. **First Solution**: Complete your first puzzle
2. **3-Day Heater**: Solve puzzles 3 consecutive days
3. **Weeklong Wizard**: Maintain 7-day streak
4. **Weekly Warrior**: Complete 7 unique puzzles (any dates)
5. **High Roller**: Earn 300+ points on a single date

Each achievement tracks:
- Unlocked status
- Progress indicator
- Date unlocked (for display)

## Theme System

Three theme modes managed via `useThemeMode` hook:
- **system**: Auto-detect OS preference (default)
- **light**: Force light theme
- **dark**: Force dark theme

Theme applied via `data-theme` attribute on `<html>`:
```html
<html data-theme="light">  <!-- or "dark" -->
```

CSS variables in `index.css` respond to this attribute:
```css
:root {
  --color-primary: #6200EE;  /* light mode values */
}

[data-theme="dark"] {
  --color-primary: #BB86FC;  /* dark mode values */
}
```

## PWA Configuration

- **Manifest**: `public/manifest.json` defines app metadata
- **Service Worker**: Not yet implemented (future enhancement)
- **Icons**: SVG icon in `public/icon.svg` (scales to all sizes)
- **Offline Support**: Planned but not yet implemented
- **Install Prompt**: Browser handles automatically

## Common Tasks

### Adding a New Operator
1. Add to `MATH_OPERATIONS` in `mathOperations.ts` with complexity score
2. Add button to `OPERATOR_COLUMNS` in `GameScreen.tsx`
3. Update `normalizeExpression` in `mathValidator.ts` if special syntax needed
4. Update keyboard mapping in `mapKeyToToken` if shortcut desired
5. Test with various equations

### Adding a New Achievement
1. Add definition to `ACHIEVEMENTS` array in `achievements.ts`
2. Implement check function based on `GameStats`
3. Achievement will automatically appear in StatsPanel

### Modifying Score Calculation
1. Edit multipliers in `complexityMultipliers` in `scoring.ts`
2. Adjust bonus calculations in `getBonusPoints` if needed
3. Test with various complexity levels

### Adding a New Statistic
1. Add field to `GameStats` interface in `localStorage.ts`
2. Update `getGameStats` and `updateGameStats` functions
3. Add display in `StatsPanel.tsx`
4. Handle migration from old data format if needed
