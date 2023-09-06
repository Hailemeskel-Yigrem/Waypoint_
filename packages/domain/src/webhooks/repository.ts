import type { Webhook, CreateWebhookInput, UpdateWebhookInput, WebhookFilter } from './types.js';

export interface WebhookRepository {
  create(
    input: CreateWebhookInput & { status: string; createdAt: string; updatedAt: string },
  ): Promise<Webhook>;
  findById(organizationId: string, id: string): Promise<Webhook | null>;
  findByName(organizationId: string, name: string): Promise<Webhook | null>;
  list(filter: WebhookFilter): Promise<Webhook[]>;
  update(organizationId: string, id: string, input: UpdateWebhookInput): Promise<Webhook>;
}
