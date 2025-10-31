# 🧮 Crackle Date

A daily math puzzle game where you create equations using today's date digits!

![PWA Ready](https://img.shields.io/badge/PWA-Ready-success) ![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue) ![React](https://img.shields.io/badge/React-19-blue) ![Mobile First](https://img.shields.io/badge/Mobile-First-green)

## 🔗 Live Demo

- **GitHub Pages**: https://damonaw.github.io/crackle-date-2/

## 🎯 How to Play

**Goal**: Create a valid mathematical equation using ALL digits from today's date in exact order.

### Example
For **September 18, 2025** (9-18-2025):
- You must use digits: `9`, `1`, `8`, `2`, `0`, `2`, `5`
- In that exact order
- With exactly ONE equals sign

**Valid solutions:**
- `9 + 1 * 8 + 2 = 0 + 2 * 5 + 9`
- `sqrt(9 + 1) = 8 - 2 + 0 + 2 + 0`
- `9^(1-8+2+0+2+5) = 1`

### Rules
- ✅ Use ALL date digits in exact order they appear
- ✅ Place exactly ONE equals sign (=)
- ✅ Both sides must be mathematically equal
- ✅ Multiple solutions allowed
- ✅ Complex solutions score higher points
- ❌ Trivial solutions (like `9×0=1×8×2×0×2×5×0`) get negative points

### Allowed Operations

| Operation | Symbol | Description | Complexity |
|-----------|--------|-------------|------------|
| Addition | `+` | Add two numbers | 1 |
| Subtraction | `−` | Subtract two numbers | 1 |
| Multiplication | `×` | Multiply two numbers | 2 |
| Division | `÷` | Divide two numbers | 2 |
| Power | `^` | Raise to a power (e.g., 2^3 = 8) | 4 |
| Square Root | `√` | Square root (e.g., √9 = 3) | 3 |
| Factorial | `!` | Factorial (e.g., 5! = 120) | 3 |
| Absolute Value | `\|x\|` | Absolute value (e.g., \|-5\| = 5) | 2 |
| Modulo | `%` | Remainder after division | 3 |
| Parentheses | `()` | Group operations for precedence | 1 |

**Keyboard Shortcuts:**
- `x` or `X` → Multiplication (×)
- `s` or `S` → Square root (√)
- `a` or `A` → Absolute value (\|x\|)
- Numbers `0-9` → Add next required digit
- `+`, `-`, `/`, `^`, `%`, `!`, `(`, `)`, `=` → Direct input
- `Enter` → Submit equation
- `Backspace` → Delete last character

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/damonaw/crackle-date-2.git
cd crackle-date-2

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run test       # Run tests
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
```

## 🎮 Features

### ✅ Core Gameplay
- **Daily Puzzles**: New challenge every day based on current date (US Eastern Time)
- **Date-Based Challenges**: Play puzzles from recent dates using the date picker
- **Real-time Validation**: Instant feedback on equation validity with detailed error messages
- **Smart Input System**: Context-aware input validation ensuring digits are used in correct order
- **Keyboard Support**: Full keyboard navigation with shortcuts (Enter to submit, Backspace to delete)
- **Multiple Solutions**: Submit as many valid equations as you can for each date
- **Equation History**: Review all your solutions for each puzzle date

### 📊 Scoring & Progression
- **Complexity-Based Scoring**: Rewards creative solutions over trivial ones
  - Trivial solutions: 0.5x multiplier (discouraged)
  - Simple solutions: 1x multiplier (10-25 points)
  - Moderate solutions: 2x multiplier (25-40 points)
  - Complex solutions: 4x multiplier (50-80 points)
  - Advanced solutions: 8x multiplier (100+ points)
- **Streak Tracking**: Daily streaks with max streak records
- **Achievement System**: Unlock achievements like "3-Day Heater" and "High Roller"
- **Statistics Dashboard**: Comprehensive stats including:
  - Total solutions and score per date
  - Average score per solution
  - Current and maximum streaks
  - Time to solve each puzzle
  - Wrong attempts tracking
- **Per-Date Best Scores**: Track your best score for each puzzle date

### 🎨 User Experience
- **Theme System**: Three theme modes - Light, Dark, and System (auto-detects)
- **Easy Mode**: Optional mode showing real-time equation evaluation for each side
- **Tutorial System**: First-time user walkthrough (only shown once)
- **Toast Notifications**: Friendly feedback for actions and errors
- **Condensing Header**: Header minimizes on scroll for more screen space
- **Mathematical Rendering**: Beautiful √, fractions, and exponents using KaTeX

### 📱 Mobile & PWA
- **Mobile-First Design**: Touch-optimized interface for phones and tablets
- **PWA Ready**: Install as an app on your device with offline support
- **Responsive Layout**: Adapts to all screen sizes seamlessly
- **Portrait Orientation**: Optimized for vertical device usage
- **Touch-Friendly Buttons**: Large, accessible operator buttons

### 💾 Data Management
- **Local Storage**: All progress automatically saved to browser storage
- **Per-Date History**: Solutions and equation state saved for each puzzle date
- **Import/Export**: Backup and restore your game data
- **Legacy Compatibility**: Seamlessly migrates data from older versions
- **No Account Required**: Play immediately without sign-up

### 🎯 Advanced Features
- **Solution Sharing**: Share your results via native share API or clipboard
- **Operator Variety**: Support for +, -, ×, ÷, ^, √, !, |x|, %, and parentheses
- **Timer Tracking**: Records time taken to solve each puzzle
- **Wrong Attempts**: Tracks failed attempts for each puzzle
- **Date Selection**: Browse and play puzzles from the past 7 days plus any dates you've played

## 🏗️ Technology Stack

- **Frontend**: React 19.1 + TypeScript 5.8
- **State Management**: Zustand (lightweight, performant store)
- **Math Engine**: mathjs 14.7 (secure expression evaluation and parsing)
- **Math Rendering**: KaTeX 0.16 (LaTeX-quality mathematical notation)
- **Styling**: Native CSS with CSS variables + design tokens in `src/index.css`
- **Build Tooling**: Vite 7.1 + TypeScript project references
- **Testing**: Vitest 3.2 + React Testing Library
- **Code Quality**: 
  - ESLint 9 with React and TypeScript rules
  - Stylelint 16 for CSS linting
  - Prettier 3.6 for code formatting
  - Husky + lint-staged for pre-commit hooks

## 📱 Mobile Experience

Crackle Date is designed mobile-first:
- Touch-friendly interface
- Responsive design for all screen sizes
- PWA capabilities for app-like experience
- Offline functionality (coming soon)
- Fast loading and smooth interactions

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests once (CI mode)
npm run test:run
```

## 🔧 Development

### Project Structure
```
src/
├── app/                      # Root App composition
│   └── App.tsx               # Main app wrapper
├── features/
│   ├── game/                 # Core game functionality
│   │   ├── components/       # React components
│   │   │   ├── GameScreen.tsx        # Main game UI with operator buttons
│   │   │   ├── DatePicker.tsx        # Date selection component
│   │   │   ├── game-screen.css       # Game UI styles
│   │   │   └── date-picker.css       # Date picker styles
│   │   ├── lib/              # Business logic and utilities
│   │   │   ├── achievements.ts       # Achievement definitions and evaluation
│   │   │   ├── dateUtils.ts          # Date parsing and formatting (EST timezone)
│   │   │   ├── inputValidator.ts     # Real-time input validation
│   │   │   ├── localStorage.ts       # Data persistence and migration
│   │   │   ├── mathOperations.ts     # Operator definitions and complexity
│   │   │   ├── mathValidator.ts      # Equation validation and evaluation
│   │   │   ├── scoring.ts            # Score calculation logic
│   │   │   └── statsConfig.ts        # Statistics configuration
│   │   ├── state/            # State management
│   │   │   └── game-store.ts         # Zustand store with all game state
│   │   └── types.ts          # TypeScript type definitions
│   ├── math/                 # Mathematical rendering
│   │   └── components/
│   │       └── MathEquation.tsx      # KaTeX wrapper component
│   ├── stats/                # Statistics and achievements
│   │   └── components/
│   │       ├── StatsPanel.tsx        # Stats display and solution history
│   │       └── stats-panel.css       # Stats panel styles
│   └── theme/                # Theme management
│       └── hooks/
│           └── useThemeMode.ts       # Theme detection and switching
├── test/
│   └── setup.ts              # Vitest configuration
├── index.css                 # Global design tokens and CSS variables
├── main.tsx                  # React entry point
└── vite-env.d.ts             # Vite type definitions
```

### Key Architecture Decisions
- **Feature-Based Organization**: Code is organized by feature (game, math, stats, theme) for better maintainability
- **Separation of Concerns**: UI components separate from business logic in `lib/` folders
- **Type Safety**: 100% TypeScript with strict mode enabled
- **Single Store Pattern**: Zustand store manages all game state with persistence
- **CSS Variables**: Theme-aware design tokens for consistent styling
- **No UI Framework**: Lightweight solution using only React and native CSS

### Code Quality Tools
- **TypeScript**: 100% TypeScript with strict mode enabled
- **ESLint**: Enforces React and TypeScript best practices
- **Stylelint**: CSS linting with standard configuration and ordering rules
- **Prettier**: Automatic code formatting for consistency
- **Husky**: Git hooks for automated quality checks
- **Lint-Staged**: Runs linters only on staged files for faster commits
- **Pre-commit Hooks**: Automatically formats and lints code before commits

## 🎯 Game Design Philosophy

**Accessibility First**: Every feature is designed to be usable by everyone
- Full keyboard support for navigation and input
- Clear error messages and helpful feedback
- Touch-friendly interface for mobile devices
- ARIA labels for screen readers
- Easy mode option for learning

**Educational**: Encourages mathematical thinking and creativity
- Multiple valid solutions per puzzle
- Complexity-based scoring rewards clever approaches
- Supports various mathematical operations
- Visualizes equations with professional math rendering

**Daily Habit**: Creates an engaging routine
- New puzzle every day based on the date
- Streak tracking motivates consistency
- Achievement system rewards milestones
- Can also play puzzles from previous dates

**Progressive Difficulty**: Natural variation in challenge
- Date digits create different complexity levels
- Some dates are naturally easier or harder
- Players can attempt multiple solutions for practice
- No time pressure - solve at your own pace

**Rewarding**: Provides satisfying moments
- Complex solutions score higher points
- Achievement unlocks celebrate progress
- Share feature lets you show off solutions
- Visual feedback for successful submissions

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Quick Start for Contributors
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by daily puzzle games like Wordle and NYT Games
- Math rendering powered by [KaTeX](https://katex.org/)
- Expression evaluation by [mathjs](https://mathjs.org/)
- UI components from [Material-UI](https://mui.com/)

---

**Ready to solve today's puzzle?** [Play Crackle Date](https://your-app-url.com) 🧮✨