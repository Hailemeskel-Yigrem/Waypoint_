import { z } from 'zod';
import { baseEnvSchema } from './base.js';

export const webEnvSchema = baseEnvSchema.extend({
  VITE_API_URL: z.string().url().default('http://localhost:3000'),
  VITE_APP_NAME: z.string().default('Waypoint Admin'),
  VITE_PORT: z.coerce.number().int().default(5173),
});

export type WebEnv = z.infer<typeof webEnvSchema>;

export const webDefaults: Partial<WebEnv> = {
  VITE_API_URL: 'http://localhost:3000',
  VITE_APP_NAME: 'Waypoint Admin',
  VITE_PORT: 5173,
};
