import type { EntityId, OrgId } from './id.js';

export interface WebhookEndpoint {
  id: EntityId;
  orgId: OrgId;
  url: string;
  secret: string;
  events: string[];
  isActive: boolean;
}

export interface WebhookDelivery {
  id: EntityId;
  endpointId: EntityId;
  event: string;
  payload: Record<string, unknown>;
  status: 'pending' | 'delivered' | 'failed';
  attempts: number;
  lastAttemptAt?: string;
}
