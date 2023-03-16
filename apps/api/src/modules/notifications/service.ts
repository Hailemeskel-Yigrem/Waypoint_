import { AppError } from '../../lib/errors.js';
import { ok, err, type Result } from '../../lib/result.js';
import type { NotificationRepository, NotificationDispatcher } from './repository.js';
import type { Notification, CreateNotificationInput } from './types.js';
import type { PaginationQuery, PaginatedResult } from '../../lib/pagination.js';
import type { UserRepository } from '../users/repository.js';

export class NotificationService {
  constructor(
    private readonly repo: NotificationRepository,
    private readonly dispatcher: NotificationDispatcher,
    private readonly userRepo: UserRepository,
  ) {}

  async send(
    organizationId: string,
    input: Omit<CreateNotificationInput, 'organizationId'>,
  ): Promise<Result<Notification>> {
    const user = await this.userRepo.findById(organizationId, input.userId);
    if (!user) return err(AppError.notFound('User', input.userId));

    const notification = await this.repo.create({ ...input, organizationId });
    const success = await this.dispatcher.dispatch(notification);
    const status = success ? 'sent' : 'failed';
    const updated = await this.repo.updateStatus(
      organizationId,
      notification.id,
      status,
      success ? new Date() : undefined,
    );
    return ok(updated ?? notification);
  }

  async listForUser(
    organizationId: string,
    userId: string,
    query: PaginationQuery,
  ): Promise<PaginatedResult<Notification>> {
    return this.repo.list(organizationId, userId, query);
  }

  async markRead(
    organizationId: string,
    userId: string,
    id: string,
  ): Promise<Result<Notification>> {
    const notification = await this.repo.findById(organizationId, id);
    if (!notification) return err(AppError.notFound('Notification', id));
    if (notification.userId !== userId)
      return err(AppError.forbidden("Cannot read another user's notification"));
    const updated = await this.repo.markRead(organizationId, id);
    if (!updated) return err(AppError.notFound('Notification', id));
    return ok(updated);
  }
}
