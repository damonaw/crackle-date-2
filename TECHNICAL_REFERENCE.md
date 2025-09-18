# CRACKLE-DATE TECHNICAL REFERENCE

## RECOMMENDED TECH STACK (2024 PROVEN)

### FRONTEND FRAMEWORK
**React 18+ with TypeScript**
- React maintains 57% developer adoption rate
- Mature ecosystem with proven track record
- Excellent TypeScript integration
- Strong community support and documentation
- Component-based architecture ideal for game UI

### BUILD TOOL
**Vite**
- 20x faster development than webpack
- Native TypeScript support with esbuild transpiler
- Modern ES modules approach
- Rollup for optimized production builds
- Zero-config TypeScript setup
- Excellent mobile optimization capabilities

### UI FRAMEWORK
**Material UI (MUI) v5+**
- Robust TypeScript support with full type definitions
- Mobile-first responsive design system
- Proven accessibility compliance (WCAG 2.1 AA)
- Modular imports for bundle optimization
- Dark/light mode built-in theming
- Touch-friendly components for mobile

**Alternative: Chakra UI**
- Simpler API than MUI
- Excellent TypeScript support
- Built-in accessibility features
- Customizable theming system
- Good mobile responsiveness

### STATE MANAGEMENT
**Zustand** (for simple to medium complexity)
- TypeScript-first design
- Minimal boilerplate
- Good performance
- Easy testing

**React Query/TanStack Query** (for server state)
- Proven caching and synchronization
- Excellent TypeScript support
- Background updates and error handling

### MATH EXPRESSION PARSING
**Math.js**
- Most mature and well-tested option
- Full TypeScript support
- AST parsing capabilities
- Comprehensive math operations support
- Security-focused (no eval usage)
- Handle floating-point precision correctly

**Alternative: equation-parser**
- Lightweight dedicated AST parser
- Specifically designed for math expressions
- Good TypeScript support

### DRAG & DROP (REMOVED FOR SIMPLICITY)
**Previously Considered: dnd-kit**
- ❌ Removed in favor of text input approach
- Complex for simple equation building
- Added unnecessary complexity to user interaction

**Current Approach: Text Input**
- ✅ Simple, accessible text input
- ✅ Works well on all devices
- ✅ Familiar user experience
- ✅ Easy to validate and process

### STYLING
**CSS-in-JS with Emotion** (if using MUI)
- TypeScript support
- Dynamic theming
- Performance optimized
- SSR compatible

**Tailwind CSS** (alternative)
- Utility-first approach
- Excellent mobile-first responsive design
- Good TypeScript integration via class variance authority

## TESTING STRATEGY

### UNIT & INTEGRATION TESTING
**Jest + React Testing Library**
- Industry standard for React applications
- Excellent TypeScript support
- Built-in mocking capabilities
- Strong community and documentation
- Good performance and reliability

### END-TO-END TESTING
**Playwright**
- Microsoft-backed, reliable and mature
- Excellent TypeScript support
- Cross-browser testing
- Mobile device emulation
- Fast execution and reliable selectors
- Built-in screenshot and video recording

**Alternative: Cypress**
- More mature ecosystem
- Real browser testing
- Good debugging capabilities
- Strong community support

### VISUAL REGRESSION TESTING
**Chromatic** (with Storybook)
- Automated visual testing
- Component isolation
- Cross-browser visual diffs
- Integration with CI/CD

## DEVELOPMENT TOOLS

### CODE QUALITY
**ESLint + Prettier**
- TypeScript-specific rules
- React-specific linting
- Consistent code formatting
- Mobile performance linting rules

### TYPE CHECKING
**TypeScript 5.0+**
- Latest features and performance improvements
- Strict mode enabled
- Path mapping for clean imports
- Build-time type checking

### BUNDLING & OPTIMIZATION
**Vite + Rollup**
- Code splitting for optimal loading
- Tree shaking for smaller bundles
- Asset optimization for mobile
- Progressive web app capabilities

## MOBILE OPTIMIZATION

### PERFORMANCE
- Bundle size < 500KB gzipped for initial load
- Lazy loading for non-critical components
- Image optimization with WebP format
- Service worker for offline capability

### RESPONSIVE DESIGN
- Mobile-first CSS approach
- Touch-friendly minimum 44px touch targets
- Optimized for thumb navigation
- Viewport meta tag configuration

### PWA FEATURES
**Workbox** (via Vite PWA plugin)
- Offline functionality
- App-like experience
- Background sync for user data
- Push notifications (future feature)

## ACCESSIBILITY

### TOOLS
**axe-core** for automated testing
- Integration with testing frameworks
- Runtime accessibility checks
- Comprehensive WCAG coverage

**React Testing Library**
- Accessibility-focused testing approach
- Screen reader simulation
- Keyboard navigation testing

### STANDARDS
- WCAG 2.1 AA compliance
- Screen reader compatibility
- Keyboard navigation support
- High contrast mode support
- Focus management

## DEPLOYMENT & HOSTING

### STATIC HOSTING
**Vercel** (recommended)
- Zero-config deployment
- Automatic HTTPS
- Global CDN
- Preview deployments
- Excellent performance metrics

**Alternative: Netlify**
- Static site hosting
- Form handling capabilities
- Split testing features
- Analytics integration

### CI/CD
**GitHub Actions**
- Automated testing pipeline
- Type checking
- Build verification
- Accessibility testing
- Performance auditing

## MONITORING & ANALYTICS

### PERFORMANCE
**Web Vitals** measurement
- Core Web Vitals tracking
- Lighthouse CI integration
- Performance budgets
- Real user monitoring

### ERROR TRACKING
**Sentry**
- TypeScript error tracking
- Performance monitoring
- User session replay
- Mobile-specific error tracking

## SECURITY

### BEST PRACTICES
- Content Security Policy (CSP)
- Secure math expression parsing (no eval)
- Input sanitization and validation
- HTTPS enforcement
- Dependency vulnerability scanning

### TOOLS
**npm audit** for dependency security
**Snyk** for vulnerability monitoring
**SonarQube** for code security analysis

## FUTURE SCALABILITY

### DATABASE (when user accounts added)
**Supabase**
- PostgreSQL with real-time features
- Built-in authentication
- Row-level security
- TypeScript client
- Edge functions

### BACKEND API (if needed)
**tRPC**
- End-to-end type safety
- Excellent TypeScript integration
- Lightweight and fast
- Easy React integration

## PACKAGE MANAGEMENT
**pnpm**
- Faster than npm/yarn
- Efficient disk space usage
- Strict dependency resolution
- Good monorepo support

## CURRENT IMPLEMENTATION STATUS
1. ✅ **Setup**: Vite + React 19 + TypeScript
2. ✅ **Linting**: ESLint + Prettier configuration
3. ✅ **Testing**: Vitest + RTL setup (Playwright not yet implemented)
4. ✅ **UI**: Material-UI v7 component library
5. ✅ **State**: Zustand for game state management
6. ✅ **Math**: Math.js for expression parsing + KaTeX for rendering
7. ✅ **Input**: Text-based equation input (drag/drop removed)
8. 🔄 **Deploy**: Ready for Vercel deployment

## PERFORMANCE TARGETS
- **Lighthouse Score**: 90+ across all metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms
- **Bundle Size**: < 500KB gzipped initial load

## BROWSER SUPPORT
- **Modern browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Android Chrome 90+
- **No Internet Explorer support** (focus on modern web standards)

## RECENT CHANGES (January 2025)
### Codebase Cleanup
- ✅ Removed 10 unused component files (various game card alternatives)
- ✅ Removed 6 unused dependencies (@dnd-kit/*, @mui/lab, @types/katex, react-katex)
- ✅ Streamlined to 3 core components: NYTGameCard, Stats, MathEquation
- ✅ Simplified dependency tree (31 → 25 dependencies)
- ✅ Significant bundle size reduction
- ✅ Maintained all active functionality

### Current Dependency Tree
**Production Dependencies (9):**
- @emotion/react, @emotion/styled (Material-UI theming)
- @mui/icons-material, @mui/material (UI components)
- katex (mathematical notation)
- mathjs (expression evaluation)
- react, react-dom (core framework)
- zustand (state management)

---

*Last Updated: 2025-01-18*
*Reflects current implementation status and recent cleanup*