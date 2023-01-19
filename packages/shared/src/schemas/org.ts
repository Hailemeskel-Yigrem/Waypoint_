import { z } from 'zod';
import { slugSchema } from './common.js';

export const orgSettingsSchema = z.object({
  allowGuestBookings: z.boolean().default(false),
  visitorExpiryHours: z.number().int().min(1).max(168).default(24),
  bookingReminderMinutes: z.number().int().min(5).max(1440).default(60),
  requireVisitorApproval: z.boolean().default(false),
});

export const createOrgSchema = z.object({
  name: z.string().min(2).max(200),
  slug: slugSchema,
  timezone: z.string().default('UTC'),
  locale: z.string().default('en-US'),
  currency: z.string().length(3).default('USD'),
  settings: orgSettingsSchema.optional(),
});

export const updateOrgSchema = createOrgSchema.partial();

export type CreateOrgInput = z.infer<typeof createOrgSchema>;
export type UpdateOrgInput = z.infer<typeof updateOrgSchema>;
