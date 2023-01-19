import { z } from 'zod';
import { AMENITY_TYPES } from '../constants/index.js';
import { isoDateSchema } from './common.js';

export const createAmenitySchema = z.object({
  name: z.string().min(1).max(200),
  type: z.enum(AMENITY_TYPES),
  capacity: z.number().int().min(1).default(1),
});

export const bookAmenitySchema = z.object({
  amenityId: z.string().uuid(),
  startAt: isoDateSchema,
  endAt: isoDateSchema,
});

export type CreateAmenityInput = z.infer<typeof createAmenitySchema>;
export type BookAmenityInput = z.infer<typeof bookAmenitySchema>;
