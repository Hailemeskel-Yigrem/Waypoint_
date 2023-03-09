import { z } from 'zod';

export const createDirectoryEntrySchema = z.object({
  userId: z.string().nullable().optional(),
  displayName: z.string().min(1).max(120),
  email: z.string().email(),
  department: z.string().max(120).nullable().optional(),
  title: z.string().max(120).nullable().optional(),
  phone: z.string().max(32).nullable().optional(),
  location: z.string().max(120).nullable().optional(),
});

export const updateDirectoryEntrySchema = createDirectoryEntrySchema.partial().extend({
  isVisible: z.boolean().optional(),
});

export const directorySearchSchema = z.object({
  q: z.string().optional(),
  department: z.string().optional(),
});

export const directoryEntryIdParamSchema = z.object({ entryId: z.string().min(1) });

export type CreateDirectoryEntryDto = z.infer<typeof createDirectoryEntrySchema>;
export type UpdateDirectoryEntryDto = z.infer<typeof updateDirectoryEntrySchema>;
