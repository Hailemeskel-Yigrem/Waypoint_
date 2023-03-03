import { generateId } from '../../lib/id.js';
import { paginate, offsetFromPage, sortItems } from '../../lib/pagination.js';
import { overlaps } from '../../lib/types.js';
import type { BookingRepository } from './repository.js';
import type { Booking, CreateBookingInput, UpdateBookingInput, BookingConflictQuery } from './types.js';

const ACTIVE_STATUSES = new Set(['pending', 'confirmed', 'checked_in']);

export class MemoryBookingRepository implements BookingRepository {
  private readonly store = new Map<string, Booking>();

  private key(orgId: string, id: string): string {
    return `${orgId}:${id}`;
  }

  async create(input: CreateBookingInput): Promise<Booking> {
    const now = new Date();
    const booking: Booking = {
      id: generateId('booking'),
      organizationId: input.organizationId,
      userId: input.userId,
      spaceId: input.spaceId ?? null,
      deskId: input.deskId ?? null,
      title: input.title,
      startTime: input.startTime,
      endTime: input.endTime,
      status: 'confirmed',
      notes: input.notes ?? null,
      createdAt: now,
      updatedAt: now,
    };
    this.store.set(this.key(booking.organizationId, booking.id), booking);
    return booking;
  }

  async findById(organizationId: string, id: string): Promise<Booking | null> {
    const b = this.store.get(this.key(organizationId, id));
    return b?.organizationId === organizationId ? b : null;
  }

  async update(organizationId: string, id: string, input: UpdateBookingInput): Promise<Booking | null> {
    const existing = await this.findById(organizationId, id);
    if (!existing) return null;
    const updated: Booking = { ...existing, ...input, updatedAt: new Date() };
    this.store.set(this.key(organizationId, id), updated);
    return updated;
  }

  async delete(organizationId: string, id: string): Promise<boolean> {
    return this.store.delete(this.key(organizationId, id));
  }

  async list(organizationId: string, query) {
    let all = [...this.store.values()].filter((b) => b.organizationId === organizationId);
    if (query.userId) all = all.filter((b) => b.userId === query.userId);
    if (query.deskId) all = all.filter((b) => b.deskId === query.deskId);
    if (query.spaceId) all = all.filter((b) => b.spaceId === query.spaceId);
    const sorted = sortItems(all, query.sortBy as keyof Booking, query.sortOrder);
    const offset = offsetFromPage(query.page, query.limit);
    return paginate(sorted.slice(offset, offset + query.limit), query.page, query.limit, all.length);
  }

  async findConflicts(query: BookingConflictQuery): Promise<Booking[]> {
    return [...this.store.values()].filter((b) => {
      if (b.organizationId !== query.organizationId) return false;
      if (query.excludeId && b.id === query.excludeId) return false;
      if (!ACTIVE_STATUSES.has(b.status)) return false;

      const resourceMatch =
        (query.deskId && b.deskId === query.deskId) ||
        (query.spaceId && b.spaceId === query.spaceId && !b.deskId);

      if (!resourceMatch) return false;
      return overlaps(query.startTime, query.endTime, b.startTime, b.endTime);
    });
  }

  async countThisMonth(organizationId: string): Promise<number> {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    return [...this.store.values()].filter(
      (b) =>
        b.organizationId === organizationId &&
        b.createdAt >= start &&
        b.createdAt <= end &&
        b.status !== 'cancelled',
    ).length;
  }

  clear(): void { this.store.clear(); }
}
