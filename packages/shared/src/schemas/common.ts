import { z } from 'zod';
import { MAX_PAGE_SIZE, DEFAULT_PAGE_SIZE } from '../constants/index.js';

export const entityIdSchema = z.string().uuid();
export const emailSchema = z.string().email().max(255);
export const slugSchema = z.string().min(2).max(64).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
export const isoDateSchema = z.string().datetime();

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
});

export type PaginationInput = z.infer<typeof paginationSchema>;
