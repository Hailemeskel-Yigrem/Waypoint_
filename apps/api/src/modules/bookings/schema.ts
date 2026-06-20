import { z } from 'zod';

export const createBookingSchema = z
  .object({
    spaceId: z.string().nullable().optional(),
    deskId: z.string().nullable().optional(),
    title: z.string().min(1).max(200),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    notes: z.string().max(2000).nullable().optional(),
  })
  .refine((d) => d.endTime > d.startTime, { message: 'endTime must be after startTime' })
  .refine((d) => d.spaceId || d.deskId, { message: 'Either spaceId or deskId is required' });

export const updateBookingSchema = z
  .object({
    title: z.string().min(1).max(200).optional(),
    startTime: z.coerce.date().optional(),
    endTime: z.coerce.date().optional(),
    status: z.enum(['pending', 'confirmed', 'checked_in', 'completed', 'cancelled']).optional(),
    notes: z.string().max(2000).nullable().optional(),
  })
  .refine((d) => !d.startTime || !d.endTime || d.endTime > d.startTime, {
    message: 'endTime must be after startTime',
  });

export const bookingIdParamSchema = z.object({ bookingId: z.string().min(1) });

export type CreateBookingDto = z.infer<typeof createBookingSchema>;
export type UpdateBookingDto = z.infer<typeof updateBookingSchema>;
