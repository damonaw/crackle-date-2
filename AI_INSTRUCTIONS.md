# CRACKLE-DATE AI INSTRUCTIONS

## CONTEXT
PROJECT: Daily math puzzle web game called "Crackle-Date"
DEVELOPER: Solo developer, 10+ years experience
TARGET: Daily puzzle enthusiasts (Wordle/crossword/Sudoku players)
GOAL: Create equations using today's date digits

## CORE GAME MECHANICS

### FUNDAMENTAL RULES
- Use ALL digits from today's date in EXACT order they appear
- Date format: M-DD-YYYY (US Eastern Time) - example: 9-17-2025
- Must place exactly ONE equals sign (=) to create valid equation
- Both sides must be mathematically equal
- Example: 9-17-2025 → `9 * 1 + 7 * 2 + 0 = 2^5`

### ALLOWED OPERATIONS
BASIC: + - * /
ADVANCED: ^ (power), √ (square root)
FUNCTIONS: |n| (absolute), n! (factorial), % (modulo)
GROUPING: () for precedence
FORBIDDEN: Logic operators (||, &&, !), bitwise operations

### SCORING RULES
- Complex solutions = higher points
- Simple solutions = lower points
- Trivial solutions = negative points (multiply by zero, identity like 1=1)
- Multiple submissions allowed

## MVP REQUIREMENTS (CURRENT FOCUS)
1. Basic game interface with date display
2. Equation input system (drag-and-drop preferred)
3. Mathematical expression parser/validator
4. Basic scoring mechanism
5. Light/dark mode toggle
6. Mobile-first responsive design

## TECHNICAL CONSTRAINTS

### MUST DO
- Research current mobile-first design patterns and implement best practices
- Responsive across phone/tablet/desktop using modern CSS techniques
- TypeScript for type safety with latest features and patterns
- Component-based modular architecture following established best practices
- Never use eval() for math parsing - research and use well-tested, reliable parser libraries
- WCAG 2.1 AA accessibility compliance using latest tools and techniques
- Clean separation: UI / game logic / data persistence
- Comprehensive testing strategy (unit, integration, e2e, visual regression)
- Performance monitoring and optimization using current tools

### MUST AVOID
- Sloppy coding practices that create technical debt
- Monolithic components - break into focused pieces
- Hardcoded values - use configuration
- Prop drilling or excessive global state
- Over-engineering - start simple, iterate
- eval() for security reasons
- Ignoring edge cases (invalid equations, division by zero)
- Accessibility as afterthought

### ARCHITECTURE PATTERNS
- Clean component structure
- Proper state management (Context API or Zustand based on complexity)
- Performance optimization for mobile
- Robust math expression parsing with AST
- Error handling for malformed equations
- Floating-point arithmetic precision handling

## FUTURE FEATURES (POST-MVP)
- User accounts + guest mode
- Daily streaks tracking
- Solution sharing
- Hints/tutorial system
- Previous date gameplay (marked "retroactive")
- Leaderboards
- Community galleries
- Mathematical formatting display (LaTeX-style rendering)
  - Superscript exponents: 5^6 → 5⁶
  - Proper fraction display: 1/2 → ½
  - Square root symbols: √16 → √16
  - Absolute value bars: |x| → |x|
  - Make equations look like math textbook format

## AI DEVELOPMENT AUTHORITY

### PRIMARY ROLE
AI is the LEAD DEVELOPER responsible for:
- Making all architecture decisions
- Writing application code and components
- Implementing features end-to-end
- Setting up project structure and tooling
- Choosing libraries and frameworks
- Creating tests and documentation
- Debugging and optimization

### PROACTIVE RESPONSIBILITIES
- Take initiative on technical implementation
- Research current best practices via web search before major decisions
- Make reasonable assumptions when requirements are unclear
- Suggest and implement improvements during development
- Choose optimal tech stack based on proven, stable practices
- Create file structure and organize codebase
- Write clean, production-ready code with comprehensive tests
- Handle edge cases and error scenarios

### DECISION MAKING AUTHORITY
- Research and choose well-established, proven libraries (math parser, UI framework, etc.)
- Design component architecture using current best practices
- Implement modern UI/UX patterns and responsive design techniques
- Set up proven, reliable build tools, testing frameworks, and CI/CD
- Create database schema following current standards
- Design API structure using modern patterns (REST/GraphQL/tRPC)
- Select testing strategies and tools based on current recommendations

### DEVELOPMENT WORKFLOW
- Research latest best practices and patterns before starting
- Initialize project with current industry-standard tooling
- Implement MVP features in logical order with TDD approach
- Write comprehensive tests (unit, integration, e2e) alongside development
- Create responsive, accessible components using modern patterns
- Handle all edge cases and error scenarios with proper testing
- Optimize performance throughout development
- Document code and architectural decisions
- Apply current understanding of proven web development practices

### HUMAN DEVELOPER ROLE
- Provide requirements and clarifications
- Review and approve major architectural decisions
- Test functionality and provide feedback
- Make final deployment and hosting decisions
- Handle business logic and game design questions

## CRITICAL SUCCESS FACTORS
1. Functional equation validation that prevents cheating (with comprehensive tests)
2. Intuitive mobile interface with drag-and-drop (tested across devices)
3. Fair scoring that rewards creativity, penalizes trivial solutions (thoroughly tested)
4. Clean, maintainable codebase with 90%+ test coverage
5. Responsive design working seamlessly across devices (visual regression tested)
6. Performance optimized for mobile (lighthouse scores 90+)
7. Accessibility compliant (automated and manual testing)

## DATE/TIME HANDLING
- Always use US Eastern Time for daily puzzle consistency
- Handle midnight transition edge cases
- Parse dates as M-DD-YYYY format (no leading zeros on month)
- Ensure daily puzzle changes exactly at midnight EST

## MATH VALIDATION REQUIREMENTS
- Research current math parsing libraries and select best option
- Parse into Abstract Syntax Tree (never eval)
- Validate operator precedence and parentheses matching
- Verify all date digits used exactly once in order
- Check mathematical equality of both equation sides
- Handle floating-point precision issues with proper testing
- Prevent division by zero and other math errors
- Provide clear error messages for invalid input
- Comprehensive unit tests for all mathematical operations and edge cases
- Property-based testing for equation validation logic

## WEB RESEARCH REQUIREMENTS
### BEFORE MAJOR DECISIONS
- Search for proven best practices in chosen technology stack
- Research established accessibility standards and mature tools
- Find reliable, well-documented testing frameworks and methodologies
- Look up proven performance optimization techniques for mobile web apps
- Check for established security best practices in web development
- Research effective UI/UX patterns for puzzle games
- Find stable, mature build tools and development workflows

### ONGOING RESEARCH AREAS
- Proven component architecture patterns
- Stable state management solutions
- Reliable testing strategies and mature tools
- Established performance monitoring solutions
- Well-supported accessibility testing tools
- Proven mobile-first design patterns
- Mature math expression parsing libraries
- Established drag-and-drop implementation best practices