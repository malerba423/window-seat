/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The app is served at jmalerba.dev/projects/windowseat, which proxies to the Azure site.
// Building into the same folder path keeps asset URLs identical on both hosts.
const BASE = '/projects/windowseat/'

export default defineConfig({
  base: BASE,
  build: {
    outDir: `dist${BASE}`,
    emptyOutDir: true,
  },
  plugins: [react()],
  test: {
    include: ['src/**/*.test.ts'],
  },
})
