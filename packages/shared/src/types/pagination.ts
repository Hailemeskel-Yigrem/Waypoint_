export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function paginate<T>(items: T[], page = 1, pageSize = 25): PaginatedResult<T> {
  const safePage = Math.max(1, page);
  const safeSize = Math.min(100, Math.max(1, pageSize));
  const start = (safePage - 1) * safeSize;
  const slice = items.slice(start, start + safeSize);
  const total = items.length;
  return {
    items: slice,
    total,
    page: safePage,
    pageSize: safeSize,
    totalPages: Math.ceil(total / safeSize) || 1,
  };
}
