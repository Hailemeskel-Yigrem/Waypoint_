import { AppError } from '../../lib/errors.js';
import { isWithinWindow } from '../../lib/types.js';
import { ok, err, type Result } from '../../lib/result.js';
import type { VisitorRepository } from './repository.js';
import type { Visitor, CreateVisitorInput, UpdateVisitorInput } from './types.js';
import type { PaginationQuery, PaginatedResult } from '../../lib/pagination.js';
import type { UserRepository } from '../users/repository.js';
import type { OrganizationRepository } from '../organizations/repository.js';
import { generateToken } from '../../lib/crypto.js';
import { DEFAULT_ORG_SETTINGS } from '../organizations/types.js';

export class VisitorService {
  constructor(
    private readonly repo: VisitorRepository,
    private readonly userRepo: UserRepository,
    private readonly orgRepo: OrganizationRepository,
  ) {}

  private async resolveWindow(
    organizationId: string,
    expectedArrival: Date,
    windowMinutes?: number,
  ): Promise<{ start: Date; end: Date }> {
    const org = await this.orgRepo.findById(organizationId);
    const minutes =
      windowMinutes ??
      org?.settings.visitorCheckInWindowMinutes ??
      DEFAULT_ORG_SETTINGS.visitorCheckInWindowMinutes;
    const start = new Date(expectedArrival.getTime() - minutes * 60_000);
    const end = new Date(expectedArrival.getTime() + minutes * 60_000);
    return { start, end };
  }

  async create(
    organizationId: string,
    input: Omit<CreateVisitorInput, 'organizationId'>,
  ): Promise<Result<Visitor>> {
    const host = await this.userRepo.findById(organizationId, input.hostUserId);
    if (!host) {
      return err(AppError.notFound('Host user', input.hostUserId));
    }
    if (host.status !== 'active') {
      return err(AppError.validation('Host user must be active'));
    }

    const window = await this.resolveWindow(
      organizationId,
      input.expectedArrival,
      input.checkInWindowMinutes,
    );
    const visitor = await this.repo.create({
      ...input,
      organizationId,
      checkInWindowStart: window.start,
      checkInWindowEnd: window.end,
    });
    return ok(visitor);
  }

  async getById(organizationId: string, id: string): Promise<Result<Visitor>> {
    const visitor = await this.repo.findById(organizationId, id);
    if (!visitor) return err(AppError.notFound('Visitor', id));
    return ok(visitor);
  }

  async checkIn(organizationId: string, id: string): Promise<Result<Visitor>> {
    const visitor = await this.repo.findById(organizationId, id);
    if (!visitor) return err(AppError.notFound('Visitor', id));
    if (visitor.status !== 'expected') {
      return err(AppError.validation(`Cannot check in visitor with status '${visitor.status}'`));
    }

    const now = new Date();
    if (!isWithinWindow(now, visitor.checkInWindowStart, visitor.checkInWindowEnd)) {
      return err(
        AppError.validation('Check-in is outside the allowed window', {
          windowStart: visitor.checkInWindowStart.toISOString(),
          windowEnd: visitor.checkInWindowEnd.toISOString(),
        }),
      );
    }

    const badgeCode = generateToken(4).slice(0, 8).toUpperCase();
    const updated = await this.repo.update(organizationId, id, {
      status: 'checked_in',
      checkedInAt: now,
      badgeCode,
    });
    if (!updated) return err(AppError.notFound('Visitor', id));
    return ok(updated);
  }

  async checkOut(organizationId: string, id: string): Promise<Result<Visitor>> {
    const visitor = await this.repo.findById(organizationId, id);
    if (!visitor) return err(AppError.notFound('Visitor', id));
    if (visitor.status !== 'checked_in') {
      return err(AppError.validation('Visitor must be checked in before check-out'));
    }
    const now = new Date();
    const updated = await this.repo.update(organizationId, id, {
      status: 'checked_out',
      checkedOutAt: now,
    });
    if (!updated) return err(AppError.notFound('Visitor', id));
    return ok(updated);
  }

  async list(
    organizationId: string,
    query: PaginationQuery & { hostUserId?: string; status?: string },
  ): Promise<PaginatedResult<Visitor>> {
    return this.repo.list(organizationId, query);
  }
}
