import { z } from 'zod';
export const createZoneSchema = z.object({
    organizationId: z.string().uuid(),
    name: z.string().min(1).max(120),
    status: z.enum(['active', 'inactive', 'archived', 'draft']).optional(),
    metadata: z.record(z.unknown()).optional(),
});
export const updateZoneSchema = z.object({
    name: z.string().min(1).max(120).optional(),
    status: z.enum(['active', 'inactive', 'archived', 'draft']).optional(),
    metadata: z.record(z.unknown()).optional(),
});
export const zonesFilterSchema = z.object({
    organizationId: z.string().uuid(),
    status: z.enum(['active', 'inactive', 'archived', 'draft']).optional(),
    query: z.string().max(200).optional(),
    limit: z.coerce.number().int().min(1).max(200).optional(),
    offset: z.coerce.number().int().min(0).optional(),
});
//# sourceMappingURL=schema.js.map