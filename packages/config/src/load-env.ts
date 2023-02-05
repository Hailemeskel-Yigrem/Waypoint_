import { z } from 'zod';

export function loadEnv<T extends z.ZodTypeAny>(
  schema: T,
  source: Record<string, string | undefined> = process.env as Record<string, string | undefined>,
): z.infer<T> {
  const parsed = schema.safeParse(source);
  if (!parsed.success) {
    const messages = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`Invalid environment: ${messages}`);
  }
  return parsed.data;
}

export function loadEnvSafe<T extends z.ZodTypeAny>(
  schema: T,
  source: Record<string, string | undefined> = process.env as Record<string, string | undefined>,
) {
  return schema.safeParse(source);
}
