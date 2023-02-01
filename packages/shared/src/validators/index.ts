import { z } from 'zod';

export const uuidSchema = z.string().uuid();
export const nonEmptyString = z.string().trim().min(1);

export function validateUuid(value: string): boolean {
  return uuidSchema.safeParse(value).success;
}
