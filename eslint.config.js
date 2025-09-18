import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Warn on raw hex colors in TS/TSX strings to encourage theme usage
      'no-restricted-syntax': [
        'warn',
        {
          selector: "Literal[value=/#[0-9A-Fa-f]{3,8}/]",
          message: 'Avoid raw hex colors; use theme palette or CSS variables.',
        },
      ],
    },
  },
  // A separate config targeting CSS files via eslint-plugin to catch inline hexes in CSS.
  // If stylelint is preferred, we can add a stylelint config instead. For now, treat as JS disabled.
  {
    files: ['**/*.{css,scss}'],
    rules: {
      // Using regex in comments for awareness; consider adding Stylelint for robust CSS linting.
    },
  },
])
