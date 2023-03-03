import { z } from 'zod';

export const updateSubscriptionSchema = z.object({
  plan: z.enum(['free', 'starter', 'professional', 'enterprise']).optional(),
  seatCount: z.number().int().min(1).optional(),
});

export type UpdateSubscriptionDto = z.infer<typeof updateSubscriptionSchema>;

