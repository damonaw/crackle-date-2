# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
```bash
npm run dev          # Start development server with host flag
npm run build        # TypeScript compilation and Vite build
npm run preview      # Preview production build
```

### Code Quality
```bash
npm run lint         # ESLint code linting
npm run format       # Prettier code formatting
```

### Testing
```bash
npm run test         # Run Vitest in watch mode
npm run test:ui      # Run Vitest with UI interface
npm run test:run     # Run tests once without watch mode
```

## Project Architecture

### Core Technology Stack
- **React 19** with TypeScript for UI components
- **Vite** for build tooling and development server
- **Material-UI v7** for component library and theming
- **Zustand** for state management
- **Vitest** with Testing Library for testing
- **mathjs** for mathematical expression evaluation
- **KaTeX** for mathematical notation rendering

### Current Component Structure
The application has been streamlined to use only essential components:
- **NYTGameCard.tsx**: Primary game interface (equation input, validation, scoring)
- **Stats.tsx**: Statistics and solutions history display
- **MathEquation.tsx**: KaTeX-powered mathematical notation rendering

### State Management Architecture
The application uses Zustand for centralized state management via `src/stores/gameStore.ts`:
- **Game State**: Current equation, validation status, score, solutions
- **Persistence**: Automatic localStorage integration for game data and user preferences
- **Statistics**: Game stats tracking across sessions
- **Theme**: Dark/light mode preferences

### Utility Layer
Game logic is cleanly separated into `src/utils/`:
- **dateUtils.ts**: Date formatting and timezone handling (US Eastern)
- **mathValidator.ts**: Expression validation and digit checking
- **mathOperations.ts**: Mathematical operation definitions
- **scoring.ts**: Complexity-based scoring algorithm
- **inputValidator.ts**: Input validation and sanitization
- **localStorage.ts**: Game data persistence and user preferences

### Type System
Centralized type definitions in `src/types/game.ts`:
- **GameState**: Core game state interface
- **Solution**: Individual equation solution with metadata
- **ValidationResult**: Equation validation response
- **ComplexityLevel**: Scoring complexity categories

### Mathematical Expression System
- Uses mathjs library for safe expression evaluation (never eval())
- Custom LaTeX conversion in MathEquation component for proper symbol rendering
- Validates equations use all date digits in exact order
- Supports operations: +, -, *, /, ^, √, factorial, absolute value, parentheses
- Complexity-based scoring rewards creative solutions

### Mobile-First Design
- PWA-ready with manifest.json and meta tags
- Responsive Material-UI design optimized for mobile devices
- Touch-friendly interface (no drag-and-drop dependencies removed for simplicity)

### Testing Strategy
- Component tests with Testing Library
- Test setup configured in `src/test/setup.ts`
- Focus on game logic and validation testing

## Game Rules (Core Business Logic)
- Players must use ALL digits from today's date in EXACT order
- Date format: M-DD-YYYY (US Eastern Time, e.g., 9-18-2025)
- Must place exactly ONE equals sign to create valid equation
- Both sides must be mathematically equal
- Multiple solutions allowed with complexity-based scoring
- Trivial solutions (like multiplication by zero) receive negative points

## Important Development Notes
- **Security**: Never use eval() for mathematical parsing - use mathjs library
- **UI Consistency**: Follow Material-UI theming patterns for consistent design
- **Type Safety**: Maintain comprehensive TypeScript interfaces
- **Persistence**: All game state changes automatically save to localStorage
- **Math Rendering**: KaTeX styling configured in index.html for proper notation
- **Code Organization**: Component cleanup completed - only essential files remain

## Recent Cleanup (2025-01-XX)
Removed unused components and dependencies for cleaner codebase:
- Removed 10 unused component files (various game card alternatives)
- Removed 6 unused dependencies (@dnd-kit/*, @mui/lab, etc.)
- Simplified architecture to focus on core functionality
- Maintained all active features while reducing maintenance overhead