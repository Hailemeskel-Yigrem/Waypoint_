import type { Notification, CreateNotificationInput } from './types.js';
import type { PaginatedResult, PaginationQuery } from '../../lib/pagination.js';

export interface NotificationRepository {
  create(input: CreateNotificationInput): Promise<Notification>;
  findById(organizationId: string, id: string): Promise<Notification | null>;
  updateStatus(
    organizationId: string,
    id: string,
    status: Notification['status'],
    sentAt?: Date,
  ): Promise<Notification | null>;
  markRead(organizationId: string, id: string): Promise<Notification | null>;
  list(
    organizationId: string,
    userId: string,
    query: PaginationQuery,
  ): Promise<PaginatedResult<Notification>>;
}

export interface NotificationDispatcher {
  dispatch(notification: Notification): Promise<boolean>;
}
