import { z } from 'zod';

export const createVisitorSchema = z.object({
  hostUserId: z.string().min(1),
  name: z.string().min(1).max(120),
  email: z.string().email().nullable().optional(),
  company: z.string().max(120).nullable().optional(),
  expectedArrival: z.coerce.date(),
  checkInWindowMinutes: z.number().int().min(5).max(240).optional(),
});

export const updateVisitorSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  email: z.string().email().nullable().optional(),
  company: z.string().max(120).nullable().optional(),
  expectedArrival: z.coerce.date().optional(),
  status: z.enum(['expected', 'checked_in', 'checked_out', 'denied', 'no_show']).optional(),
});

export const visitorIdParamSchema = z.object({ visitorId: z.string().min(1) });

export type CreateVisitorDto = z.infer<typeof createVisitorSchema>;
export type UpdateVisitorDto = z.infer<typeof updateVisitorSchema>;
