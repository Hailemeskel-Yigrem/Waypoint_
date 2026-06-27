import type { ZodTypeAny } from 'zod';

type InferEnv<T extends ZodTypeAny> = T['_output'];

export function loadEnv<T extends ZodTypeAny>(
  schema: T,
  source: Record<string, string | undefined> = process.env as Record<string, string | undefined>,
): InferEnv<T> {
  const parsed = schema.safeParse(source);
  if (!parsed.success) {
    const messages = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`Invalid environment: ${messages}`);
  }
  return parsed.data;
}

export function loadEnvSafe<T extends ZodTypeAny>(
  schema: T,
  source: Record<string, string | undefined> = process.env as Record<string, string | undefined>,
) {
  return schema.safeParse(source);
}
