import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: [
      'tests/**/*.test.ts',
      'src/**/*.test.ts',
      'modules/**/*.test.ts',
      'integration/**/*.test.ts',
    ],
  },
  resolve: {
    alias: {
      '@waypoint/shared': path.resolve(__dirname, '../../packages/shared/src/index.ts'),
      '@waypoint/domain': path.resolve(__dirname, '../../packages/domain/src/index.ts'),
      '@waypoint/auth': path.resolve(__dirname, '../../packages/auth/src/index.ts'),
      '@waypoint/config': path.resolve(__dirname, '../../packages/config/src/index.ts'),
      '@waypoint/logging': path.resolve(__dirname, '../../packages/logging/src/index.ts'),
    },
  },
});
