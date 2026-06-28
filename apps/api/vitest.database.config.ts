import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/integration/**/*.integration.test.ts'],
    testTimeout: 20_000,
    hookTimeout: 20_000,
    fileParallelism: false,
  },
  resolve: {
    alias: {
      '@waypoint/shared': path.resolve(__dirname, '../../packages/shared/src/index.ts'),
      '@waypoint/domain': path.resolve(__dirname, '../../packages/domain/src/index.ts'),
      '@waypoint/auth': path.resolve(__dirname, '../../packages/auth/src/index.ts'),
      '@waypoint/config': path.resolve(__dirname, '../../packages/config/src/index.ts'),
      '@waypoint/logging': path.resolve(__dirname, '../../packages/logging/src/index.ts'),
      '@waypoint/database': path.resolve(__dirname, '../../packages/database/src/index.ts'),
    },
  },
});
