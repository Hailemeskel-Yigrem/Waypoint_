import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  HOST: z.string().default('0.0.0.0'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  LOG_PRETTY: z
    .string()
    .optional()
    .transform((v) => v === 'true' || v === '1'),
  DATABASE_URL: z.string().optional(),
  JWT_SECRET: z.string().min(16).default('dev-secret-change-in-production'),
  API_KEY_SALT: z.string().min(8).default('waypoint-api-salt'),
  RATE_LIMIT_MAX: z.coerce.number().int().min(1).default(200),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().min(1000).default(60_000),
  CORS_ORIGIN: z.string().default('*'),
  USE_MEMORY_REPOS: z
    .string()
    .optional()
    .transform((v) => v === 'true' || v === '1' || process.env.NODE_ENV === 'test'),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | null = null;

export function loadConfig(): Env {
  if (cached) return cached;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const messages = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
    throw new Error(`Invalid configuration:\n${messages.join('\n')}`);
  }
  cached = parsed.data;
  return cached;
}

export function resetConfig(): void {
  cached = null;
}
