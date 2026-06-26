import type { Webhook, CreateWebhookInput, UpdateWebhookInput, WebhookFilter } from './types.js';
import type { WebhookRepository } from './repository.js';
export declare class MemoryWebhookRepository implements WebhookRepository {
    private readonly rows;
    private key;
    create(input: CreateWebhookInput & {
        status: string;
        createdAt: string;
        updatedAt: string;
    }): Promise<Webhook>;
    findById(organizationId: string, id: string): Promise<Webhook | null>;
    findByName(organizationId: string, name: string): Promise<Webhook | null>;
    list(filter: WebhookFilter): Promise<Webhook[]>;
    update(organizationId: string, id: string, input: UpdateWebhookInput): Promise<Webhook>;
}
//# sourceMappingURL=memory.repository.d.ts.map