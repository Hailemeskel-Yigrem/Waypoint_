import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@waypoint/shared': path.resolve(__dirname, '../../packages/shared/src/index.ts'),
      '@waypoint/config': path.resolve(__dirname, '../../packages/config/src/index.ts'),
      '@waypoint/logging': path.resolve(__dirname, '../../packages/logging/src/index.ts'),
      '@waypoint/database': path.resolve(__dirname, '../../packages/database/src/index.ts'),
    },
  },
});
