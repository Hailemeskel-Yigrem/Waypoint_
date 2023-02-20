import { z } from 'zod';

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function paginate<T>(
  items: T[],
  page: number,
  limit: number,
  total: number,
): PaginatedResult<T> {
  return {
    items,
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export function offsetFromPage(page: number, limit: number): number {
  return (page - 1) * limit;
}

export function sortItems<T>(
  items: T[],
  sortBy: keyof T | undefined,
  sortOrder: 'asc' | 'desc',
): T[] {
  if (!sortBy) {
    return items;
  }

  const sorted = [...items].sort((a, b) => {
    const av = a[sortBy];
    const bv = b[sortBy];
    if (av === bv) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    if (av < bv) return sortOrder === 'asc' ? -1 : 1;
    return sortOrder === 'asc' ? 1 : -1;
  });

  return sorted;
}
