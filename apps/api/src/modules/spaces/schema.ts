import { z } from 'zod';

export const createSpaceSchema = z.object({
  name: z.string().min(1).max(120),
  type: z.enum(['office', 'meeting_room', 'floor', 'campus', 'zone']),
  floor: z.string().max(32).nullable().optional(),
  capacity: z.number().int().min(1).max(10000).default(1),
  metadata: z.record(z.string()).optional(),
});

export const updateSpaceSchema = createSpaceSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export const spaceIdParamSchema = z.object({ spaceId: z.string().min(1) });

export type CreateSpaceDto = z.infer<typeof createSpaceSchema>;
export type UpdateSpaceDto = z.infer<typeof updateSpaceSchema>;
