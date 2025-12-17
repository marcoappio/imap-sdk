import { defineConfig } from 'vitest/config'

import path from 'node:path'

export default defineConfig({
  cacheDir: '.vitest',
  resolve: {
    alias: {
      '@imap-sdk': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'node',
    experimental: {
      fsModuleCache: true,
      fsModuleCachePath: 'node_modules/.vitest-cache',
    },
    globals: true,
    include: ['src/**/*.test.ts'],
    isolate: true,
    pool: 'vmThreads',
    testTimeout: 10_000,
  },
})
