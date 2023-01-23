import type { EntityId, OrgId, UserId } from './id.js';

export interface Notification {
  id: EntityId;
  orgId: OrgId;
  userId: UserId;
  channel: 'email' | 'push' | 'sms';
  subject: string;
  body: string;
  sentAt?: string;
  readAt?: string;
}
