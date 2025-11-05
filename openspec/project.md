# Project Context

## Purpose
Crackle Date is a math-based puzzle game that challenges players to solve date-related mathematical equations. The game features achievements, scoring systems, and statistics tracking to provide an engaging learning experience focused on mathematical problem-solving with date contexts.

## Tech Stack
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite (development server and production builds)
- **State Management**: Zustand for global game state
- **Testing**: Vitest for unit testing
- **Linting**: ESLint for JavaScript/TypeScript, Stylelint for CSS
- **Formatting**: Prettier (single quotes, semicolons, 100 char width, 2-space indentation)
- **Deployment**: GitHub Pages (builds to docs/ directory)

## Project Conventions

### Code Style
- **TypeScript**: Strict mode enabled, no unused locals/parameters, explicit types required
- **Imports**: Absolute imports within features (e.g., `@/features/game/...`), relative imports for cross-feature dependencies
- **Naming**: camelCase for variables/functions, PascalCase for components/interfaces/types
- **Formatting**: Prettier configuration (single quotes, semicolons, 100 character line width, 2-space indentation)
- **CSS**: No hex colors (use CSS custom properties/variables), alphabetical property ordering, standard configuration
- **Error Handling**: Try/catch blocks with descriptive error messages, no silent failures

### Architecture Patterns
- **Feature-Based Structure**: Code organized under `src/app/features/` with each feature containing components, lib utilities, state, and types
- **React Patterns**: Functional components with hooks, proper dependency arrays in useEffect/useCallback
- **State Management**: Zustand stores for global state, local component state for feature-specific data
- **File Organization**: Clear separation of concerns (components, lib utilities, state management, types)

### Testing Strategy
- **Framework**: Vitest for fast, modern testing
- **Modes**: `npm run test` (watch mode), `npm run test:run` (CI mode), `npm run test:ui` (visual UI mode)
- **Coverage**: Unit tests for utilities, components, and state logic
- **Single Test Execution**: `npx vitest run path/to/test.ts` or `npx vitest run --grep "test name"`

### Git Workflow
- **Deployment**: Automated GitHub Actions workflow for building and deploying to GitHub Pages
- **Pre-commit**: Husky hooks for code quality checks
- **Branching**: Feature branches for development, main branch for production

## Domain Context
- **Game Mechanics**: Players solve mathematical equations involving dates using a date picker interface
- **Scoring System**: Points awarded based on equation complexity and solve time
- **Achievements**: Unlockable achievements for milestones and special solves
- **Statistics**: Comprehensive stats tracking including solve times, accuracy, and progress
- **Math Operations**: Safe mathematical expression evaluation using dedicated libraries

## Important Constraints
- **Security**: No use of `eval()` for code execution, all mathematical expressions validated and evaluated safely
- **Input Validation**: All user inputs must be validated before processing
- **Performance**: Game must remain responsive with complex mathematical operations
- **Accessibility**: Interface should be usable and understandable for math learners

## External Dependencies
- **mathjs**: Safe mathematical expression parsing and evaluation
- **KaTeX**: Mathematical notation rendering for equations
- **Zustand**: Lightweight state management library
- **Vite**: Fast build tool and development server
