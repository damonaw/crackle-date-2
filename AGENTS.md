<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# Agent Guidelines for Crackle Date

## Build/Lint/Test Commands
- **Development**: `npm run dev` (Vite dev server with host flag)
- **Build**: `npm run build` (TypeScript + Vite production build to docs/)
- **Lint**: `npm run lint` (ESLint + Stylelint)
- **Format**: `npm run format` (Prettier on all source files)
- **Test**: `npm run test` (Vitest watch mode), `npm run test:run` (CI mode), `npm run test:ui` (UI mode)
- **Single test**: `npx vitest run path/to/test.ts` or `npx vitest run --grep "test name"`

## Code Style Guidelines
- **TypeScript**: Strict mode enabled, no unused locals/parameters, explicit types required
- **Imports**: Absolute imports within features, relative imports for cross-feature
- **Naming**: camelCase for variables/functions, PascalCase for components/interfaces
- **Formatting**: Prettier (single quotes, semicolons, 100 char width, 2-space tabs)
- **CSS**: No hex colors (use CSS variables), alphabetical property ordering, standard config
- **Error Handling**: Try/catch with descriptive messages, no silent failures
- **React**: Functional components with hooks, proper dependency arrays
- **State**: Zustand store for global state, local state for component-specific
- **Security**: No eval(), use mathjs for expression evaluation, validate all inputs</content>
<parameter name="filePath">C:/Users/damon/Projects/crackle-date-2/AGENTS.md