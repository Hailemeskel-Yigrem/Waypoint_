import { z } from 'zod';

export const organizationSettingsSchema = z.object({
  timezone: z.string().min(1).default('UTC'),
  locale: z.string().min(2).default('en-US'),
  visitorCheckInWindowMinutes: z.number().int().min(5).max(240).default(30),
  defaultBookingDurationMinutes: z.number().int().min(15).max(1440).default(480),
  requireDeskAssignment: z.boolean().default(false),
});

export const createOrganizationSchema = z.object({
  name: z.string().min(2).max(120),
  slug: z
    .string()
    .min(2)
    .max(64)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  plan: z.enum(['free', 'starter', 'professional', 'enterprise']).optional(),
  settings: organizationSettingsSchema.partial().optional(),
});

export const updateOrganizationSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  slug: z
    .string()
    .min(2)
    .max(64)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  plan: z.enum(['free', 'starter', 'professional', 'enterprise']).optional(),
  status: z.enum(['active', 'suspended', 'trial']).optional(),
  settings: organizationSettingsSchema.partial().optional(),
});

export const organizationIdParamSchema = z.object({
  organizationId: z.string().min(1),
});

export type CreateOrganizationDto = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationDto = z.infer<typeof updateOrganizationSchema>;
