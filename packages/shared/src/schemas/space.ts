import { z } from 'zod';
import { SPACE_TYPES } from '../constants/index.js';
import { slugSchema } from './common.js';

export const createSpaceSchema = z.object({
  name: z.string().min(1).max(200),
  slug: slugSchema,
  type: z.enum(SPACE_TYPES),
  floor: z.string().max(50).optional(),
  capacity: z.number().int().min(1).max(10000).default(1),
  amenities: z.array(z.string()).default([]),
});

export const createDeskSchema = z.object({
  spaceId: z.string().uuid(),
  label: z.string().min(1).max(50),
  isBookable: z.boolean().default(true),
  coordinates: z.object({ x: z.number(), y: z.number() }).optional(),
});

export type CreateSpaceInput = z.infer<typeof createSpaceSchema>;
export type CreateDeskInput = z.infer<typeof createDeskSchema>;
