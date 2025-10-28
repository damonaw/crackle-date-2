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
- **Basic**: `+`, `-`, `*`, `/`
- **Advanced**: `^` (power), `sqrt()` (square root)
- **Functions**: `abs()` (absolute value), `!` (factorial), `%` (modulo)
- **Grouping**: `()` for precedence

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

### ✅ Implemented
- **Daily Puzzles**: New challenge every day based on current date
- **Real-time Validation**: Instant feedback on equation validity
- **Mathematical Rendering**: Beautiful √, fractions, and exponents using KaTeX
- **Smart Scoring**: Complexity-based scoring rewards creative solutions
- **Statistics Tracking**: View your solutions, scores, and progress
- **Dark/Light Mode**: Toggle between themes
- **Mobile-First Design**: Optimized for phones and tablets
- **PWA Ready**: Install as an app on your device
- **Persistent Progress**: Your solutions automatically save locally

### 🔄 Coming Soon
- User accounts and cloud sync
- Daily streaks and achievements
- Solution sharing with friends
- Hints and tutorial system
- Previous date gameplay
- Leaderboards

## 🏗️ Technology Stack

- **Frontend**: React 19 + TypeScript
- **State Management**: Zustand
- **Math Engine**: mathjs (secure expression evaluation)
- **Math Rendering**: KaTeX (LaTeX-quality notation)
- **Styling**: Native CSS modules + design tokens in `src/index.css`
- **Build Tooling**: Vite + TypeScript project references
- **Testing**: Vitest + React Testing Library

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
├── app/                     # Root App composition
├── features/
│   ├── game/                # Gameplay UI, Zustand store, and domain logic
│   │   ├── components/
│   │   ├── lib/
│   │   └── state/
│   ├── math/                # KaTeX equation renderer
│   ├── stats/               # Stats modal and layout
│   └── theme/               # Theme detection hook
├── index.css                # Global tokens + resets
└── main.tsx                 # Vite/React bootstrapper
```

### Code Quality
- **TypeScript**: 100% TypeScript with strict mode
- **Linting**: ESLint with React and TypeScript rules
- **Formatting**: Prettier for consistent code style
- **Testing**: Comprehensive test coverage for game logic

## 🎯 Game Design Philosophy

**Accessibility First**: Every feature is designed to be usable by everyone
**Educational**: Encourages mathematical thinking and creativity
**Daily Habit**: One puzzle per day creates engaging routine
**Progressive Difficulty**: Date variations naturally create varying difficulty
**Rewarding**: Complex solutions provide satisfying "aha!" moments

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