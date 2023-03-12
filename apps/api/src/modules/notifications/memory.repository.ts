import { generateId } from '../../lib/id.js';
import { paginate, offsetFromPage, sortItems } from '../../lib/pagination.js';
import type { NotificationRepository, NotificationDispatcher } from './repository.js';
import type { Notification, CreateNotificationInput } from './types.js';

export class MemoryNotificationRepository implements NotificationRepository {
  private readonly store = new Map<string, Notification>();

  private key(orgId: string, id: string): string {
    return `${orgId}:${id}`;
  }

  async create(input: CreateNotificationInput): Promise<Notification> {
    const now = new Date();
    const notification: Notification = {
      id: generateId('notification'),
      organizationId: input.organizationId,
      userId: input.userId,
      channel: input.channel,
      subject: input.subject,
      body: input.body,
      status: 'pending',
      metadata: input.metadata ?? {},
      sentAt: null,
      readAt: null,
      createdAt: now,
      updatedAt: now,
    };
    this.store.set(this.key(notification.organizationId, notification.id), notification);
    return notification;
  }

  async findById(organizationId: string, id: string): Promise<Notification | null> {
    const n = this.store.get(this.key(organizationId, id));
    return n?.organizationId === organizationId ? n : null;
  }

  async updateStatus(
    organizationId: string,
    id: string,
    status: Notification['status'],
    sentAt?: Date,
  ): Promise<Notification | null> {
    const existing = await this.findById(organizationId, id);
    if (!existing) return null;
    const updated: Notification = {
      ...existing,
      status,
      sentAt: sentAt ?? existing.sentAt,
      updatedAt: new Date(),
    };
    this.store.set(this.key(organizationId, id), updated);
    return updated;
  }

  async markRead(organizationId: string, id: string): Promise<Notification | null> {
    const existing = await this.findById(organizationId, id);
    if (!existing) return null;
    const updated: Notification = {
      ...existing,
      status: 'read',
      readAt: new Date(),
      updatedAt: new Date(),
    };
    this.store.set(this.key(organizationId, id), updated);
    return updated;
  }

  async list(organizationId: string, userId: string, query) {
    const all = [...this.store.values()].filter(
      (n) => n.organizationId === organizationId && n.userId === userId,
    );
    const sorted = sortItems(all, query.sortBy as keyof Notification, query.sortOrder);
    const offset = offsetFromPage(query.page, query.limit);
    return paginate(
      sorted.slice(offset, offset + query.limit),
      query.page,
      query.limit,
      all.length,
    );
  }

  clear(): void {
    this.store.clear();
  }
}

export class ConsoleNotificationDispatcher implements NotificationDispatcher {
  async dispatch(notification: Notification): Promise<boolean> {
    console.info(
      `[notification:${notification.channel}] ${notification.subject} -> user ${notification.userId}`,
    );
    return true;
  }
}
