import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      include: ['src/hooks/useAmenities.ts', 'src/hooks/useDirectory.ts', 'src/lib/**/*.ts'],
      reporter: ['text', 'json-summary'],
      thresholds: { lines: 70 },
    },
  },
});
