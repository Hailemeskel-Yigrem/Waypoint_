import { z } from 'zod';

export const createAmenitySchema = z.object({
  spaceId: z.string().min(1),
  name: z.string().min(1).max(120),
  type: z.enum(['gym', 'parking', 'cafeteria', 'locker', 'shower', 'other']),
  capacity: z.number().int().min(1).max(10000),
});

export const createReservationSchema = z
  .object({
    amenityId: z.string().min(1),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    partySize: z.number().int().min(1).max(100),
  })
  .refine((d) => d.endTime > d.startTime, { message: 'endTime must be after startTime' });

export const amenityIdParamSchema = z.object({ amenityId: z.string().min(1) });

export type CreateAmenityDto = z.infer<typeof createAmenitySchema>;
export type CreateReservationDto = z.infer<typeof createReservationSchema>;
