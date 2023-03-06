import { z } from 'zod';

export const createDeskSchema = z.object({
  spaceId: z.string().min(1),
  label: z.string().min(1).max(64),
  isBookable: z.boolean().default(true),
  amenities: z.array(z.string()).default([]),
});

export const updateDeskSchema = createDeskSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export const deskIdParamSchema = z.object({ deskId: z.string().min(1) });

export type CreateDeskDto = z.infer<typeof createDeskSchema>;
export type UpdateDeskDto = z.infer<typeof updateDeskSchema>;
