import type { Timestamps, TenantScoped, NotificationChannel } from '../../lib/types.js';

export type NotificationStatus = 'pending' | 'sent' | 'failed' | 'read';

export interface Notification extends Timestamps, TenantScoped {
  id: string;
  userId: string;
  channel: NotificationChannel;
  subject: string;
  body: string;
  status: NotificationStatus;
  metadata: Record<string, string>;
  sentAt: Date | null;
  readAt: Date | null;
}

export interface CreateNotificationInput {
  organizationId: string;
  userId: string;
  channel: NotificationChannel;
  subject: string;
  body: string;
  metadata?: Record<string, string>;
}
