import { AppError } from '../../lib/errors.js';
import { ok, err, type Result } from '../../lib/result.js';
import type { BookingRepository } from './repository.js';
import type { Booking, CreateBookingInput, UpdateBookingInput } from './types.js';
import type { PaginationQuery, PaginatedResult } from '../../lib/pagination.js';
import type { BillingService } from '../billing/service.js';
import type { DeskRepository } from '../desks/repository.js';
import type { SpaceRepository } from '../spaces/repository.js';
import type { AccessService } from '../access/service.js';

export class BookingService {
  constructor(
    private readonly repo: BookingRepository,
    private readonly deskRepo: DeskRepository,
    private readonly spaceRepo: SpaceRepository,
    private readonly billing: BillingService,
    private readonly access: AccessService,
  ) {}

  private async validateResources(
    organizationId: string,
    deskId: string | null | undefined,
    spaceId: string | null | undefined,
  ): Promise<Result<{ deskId: string | null; spaceId: string | null }>> {
    if (deskId) {
      const desk = await this.deskRepo.findById(organizationId, deskId);
      if (!desk) return err(AppError.notFound('Desk', deskId));
      if (!desk.isBookable || !desk.isActive) {
        return err(AppError.validation('Desk is not available for booking'));
      }
      return ok({ deskId, spaceId: desk.spaceId });
    }
    if (spaceId) {
      const space = await this.spaceRepo.findById(organizationId, spaceId);
      if (!space) return err(AppError.notFound('Space', spaceId));
      if (!space.isActive) {
        return err(AppError.validation('Space is not active'));
      }
      return ok({ deskId: null, spaceId });
    }
    return err(AppError.validation('Either deskId or spaceId is required'));
  }

  private async checkOverlap(
    organizationId: string,
    deskId: string | null,
    spaceId: string | null,
    startTime: Date,
    endTime: Date,
    excludeId?: string,
  ): Promise<Result<void>> {
    const conflicts = await this.repo.findConflicts({
      organizationId,
      deskId: deskId ?? undefined,
      spaceId: spaceId ?? undefined,
      startTime,
      endTime,
      excludeId,
    });
    if (conflicts.length > 0) {
      return err(AppError.bookingOverlap({ conflictingIds: conflicts.map((c) => c.id) }));
    }
    return ok(undefined);
  }

  async create(
    organizationId: string,
    userId: string,
    input: Omit<CreateBookingInput, 'organizationId' | 'userId'>,
  ): Promise<Result<Booking>> {
    const billingCheck = await this.billing.canCreateBooking(organizationId);
    if (!billingCheck.ok) return billingCheck as Result<never>;

    const accessCheck = await this.access.canBook(organizationId, userId, input.deskId, input.spaceId);
    if (!accessCheck.ok) return accessCheck as Result<never>;

    const resources = await this.validateResources(organizationId, input.deskId, input.spaceId);
    if (!resources.ok) return resources as Result<never>;

    const overlapCheck = await this.checkOverlap(
      organizationId,
      resources.value.deskId,
      resources.value.spaceId,
      input.startTime,
      input.endTime,
    );
    if (!overlapCheck.ok) return overlapCheck as Result<never>;

    const booking = await this.repo.create({
      ...input,
      organizationId,
      userId,
      deskId: resources.value.deskId,
      spaceId: resources.value.spaceId,
    });
    return ok(booking);
  }

  async getById(organizationId: string, id: string): Promise<Result<Booking>> {
    const booking = await this.repo.findById(organizationId, id);
    if (!booking) return err(AppError.notFound('Booking', id));
    return ok(booking);
  }

  async update(organizationId: string, id: string, input: UpdateBookingInput): Promise<Result<Booking>> {
    const existing = await this.repo.findById(organizationId, id);
    if (!existing) return err(AppError.notFound('Booking', id));
    if (existing.status === 'cancelled' || existing.status === 'completed') {
      return err(AppError.validation('Cannot modify a cancelled or completed booking'));
    }

    const startTime = input.startTime ?? existing.startTime;
    const endTime = input.endTime ?? existing.endTime;

    if (input.startTime || input.endTime) {
      const overlapCheck = await this.checkOverlap(
        organizationId,
        existing.deskId,
        existing.spaceId,
        startTime,
        endTime,
        id,
      );
      if (!overlapCheck.ok) return overlapCheck as Result<never>;
    }

    const updated = await this.repo.update(organizationId, id, input);
    if (!updated) return err(AppError.notFound('Booking', id));
    return ok(updated);
  }

  async cancel(organizationId: string, id: string): Promise<Result<Booking>> {
    return this.update(organizationId, id, { status: 'cancelled' });
  }

  async checkIn(organizationId: string, id: string): Promise<Result<Booking>> {
    const existing = await this.repo.findById(organizationId, id);
    if (!existing) return err(AppError.notFound('Booking', id));
    const now = new Date();
    if (now < existing.startTime) {
      return err(AppError.validation('Cannot check in before booking start time'));
    }
    if (now > existing.endTime) {
      return err(AppError.validation('Booking has already ended'));
    }
    return this.update(organizationId, id, { status: 'checked_in' });
  }

  async list(
    organizationId: string,
    query: PaginationQuery & { userId?: string; deskId?: string; spaceId?: string },
  ): Promise<PaginatedResult<Booking>> {
    return this.repo.list(organizationId, query);
  }
}
