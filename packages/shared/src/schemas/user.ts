import { z } from 'zod';
import { USER_ROLES } from '../constants/index.js';
import { emailSchema, entityIdSchema } from './common.js';

export const createUserSchema = z.object({
  email: emailSchema,
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  role: z.enum(USER_ROLES).default('member'),
  password: z.string().min(8).max(128),
});

export const updateUserSchema = createUserSchema.partial().omit({ password: true });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
