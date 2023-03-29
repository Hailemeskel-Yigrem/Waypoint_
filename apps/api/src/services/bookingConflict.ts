export interface BookingSlot {
  id: string;
  resourceId: string;
  organizationId: string;
  start: string;
  end: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export function isActive(status: BookingSlot['status']): boolean {
  return status === 'pending' || status === 'confirmed';
}

export function overlaps(a: BookingSlot, b: BookingSlot): boolean {
  if (a.organizationId !== b.organizationId) return false;
  if (a.resourceId !== b.resourceId) return false;
  if (!isActive(a.status) || !isActive(b.status)) return false;
  return a.start < b.end && b.start < a.end;
}

export function findConflicts(candidate: BookingSlot, existing: BookingSlot[]): BookingSlot[] {
  return existing.filter((slot) => slot.id !== candidate.id && overlaps(candidate, slot));
}

export function assertNoConflicts(candidate: BookingSlot, existing: BookingSlot[]): void {
  const conflicts = findConflicts(candidate, existing);
  if (conflicts.length) {
    throw new Error(`booking conflicts with ${conflicts.map((c) => c.id).join(', ')}`);
  }
}

export function sortByStart(slots: BookingSlot[]): BookingSlot[] {
  return [...slots].sort((a, b) => a.start.localeCompare(b.start));
}
