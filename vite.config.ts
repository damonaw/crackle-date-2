import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const githubPagesBase = '/crackle-date-2/'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? githubPagesBase : '/',
  plugins: [react()],
  server: {
    host: true, // or '0.0.0.0'
    port: 5173
  },
  build: {
    outDir: 'docs'
  }
}))
