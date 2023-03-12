import { z } from 'zod';

export const createIntegrationSchema = z.object({
  provider: z.enum(['slack', 'teams', 'google_calendar', 'okta', 'webhook']),
  name: z.string().min(1).max(120),
  config: z.record(z.string()),
});

export const updateIntegrationSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  status: z.enum(['active', 'inactive', 'error']).optional(),
  config: z.record(z.string()).optional(),
});

export const integrationIdParamSchema = z.object({ integrationId: z.string().min(1) });

export type CreateIntegrationDto = z.infer<typeof createIntegrationSchema>;
export type UpdateIntegrationDto = z.infer<typeof updateIntegrationSchema>;
