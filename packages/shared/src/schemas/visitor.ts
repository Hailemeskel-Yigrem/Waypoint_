import { z } from 'zod';
import { emailSchema, isoDateSchema } from './common.js';

export const createVisitorSchema = z.object({
  hostUserId: z.string().uuid(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: emailSchema,
  company: z.string().max(200).optional(),
  expectedAt: isoDateSchema,
});

export type CreateVisitorInput = z.infer<typeof createVisitorSchema>;
