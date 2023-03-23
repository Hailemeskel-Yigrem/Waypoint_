import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(120),
  role: z.enum(['owner', 'admin', 'manager', 'member', 'viewer']).default('member'),
  password: z.string().min(8).max(128).optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  role: z.enum(['owner', 'admin', 'manager', 'member', 'viewer']).optional(),
  status: z.enum(['active', 'inactive', 'invited']).optional(),
  password: z.string().min(8).max(128).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  organizationId: z.string().min(1),
});

export const userIdParamSchema = z.object({
  userId: z.string().min(1),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
