import { z } from 'zod';
import { baseEnvSchema } from './base.js';

export const apiEnvSchema = baseEnvSchema.extend({
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  HOST: z.string().default('0.0.0.0'),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGIN: z.string().default('*'),
  RATE_LIMIT_MAX: z.coerce.number().int().default(100),
});

export type ApiEnv = z.infer<typeof apiEnvSchema>;

export const apiDefaults: Partial<ApiEnv> = {
  PORT: 3000,
  HOST: '0.0.0.0',
  JWT_EXPIRES_IN: '7d',
  CORS_ORIGIN: '*',
  RATE_LIMIT_MAX: 100,
};
