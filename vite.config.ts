import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // Use a relative base path for production builds so the bundle works regardless of the
  // repository slug or whether a custom domain is configured on GitHub Pages. An absolute
  // path (e.g. `/crackle-date-2/`) causes a blank page when the repo name changes because
  // the generated asset URLs no longer match the deployed path.
  base: command === 'build' ? './' : '/',
  plugins: [react()],
  server: {
    host: true, // or '0.0.0.0'
    port: 5173
  },
  build: {
    outDir: 'docs'
  }
}))
