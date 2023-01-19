import { z } from 'zod';
import { isoDateSchema } from './common.js';

export const createBookingSchema = z
  .object({
    resourceType: z.enum(['desk', 'space']),
    resourceId: z.string().uuid(),
    startAt: isoDateSchema,
    endAt: isoDateSchema,
    notes: z.string().max(1000).optional(),
  })
  .refine((d) => new Date(d.endAt) > new Date(d.startAt), {
    message: 'endAt must be after startAt',
    path: ['endAt'],
  });

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
