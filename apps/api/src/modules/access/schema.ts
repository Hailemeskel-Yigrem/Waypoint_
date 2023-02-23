import { z } from 'zod';

export const accessConditionsSchema = z.object({
  roles: z.array(z.enum(['owner', 'admin', 'manager', 'member', 'viewer'])).optional(),
  spaceIds: z.array(z.string()).optional(),
  deskIds: z.array(z.string()).optional(),
  daysOfWeek: z.array(z.number().int().min(0).max(6)).optional(),
  startHour: z.number().int().min(0).max(23).optional(),
  endHour: z.number().int().min(0).max(23).optional(),
});

export const createAccessPolicySchema = z.object({
  name: z.string().min(1).max(120),
  action: z.enum(['book_desk', 'book_space', 'enter_building', 'manage_visitors']),
  effect: z.enum(['allow', 'deny']),
  priority: z.number().int().min(0).max(1000).default(100),
  conditions: accessConditionsSchema,
});

export const policyIdParamSchema = z.object({ policyId: z.string().min(1) });

export type CreateAccessPolicyDto = z.infer<typeof createAccessPolicySchema>;
