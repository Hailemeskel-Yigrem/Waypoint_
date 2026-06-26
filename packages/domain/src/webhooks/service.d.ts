import { type Result } from '../result.js';
import type { Webhook, CreateWebhookInput, UpdateWebhookInput, WebhookFilter } from './types.js';
import type { WebhookRepository } from './repository.js';
export declare class WebhookService {
    private readonly repo;
    constructor(repo: WebhookRepository);
    create(input: CreateWebhookInput): Promise<Result<Webhook, Error>>;
    get(organizationId: string, id: string): Promise<Result<Webhook, Error>>;
    list(filter: WebhookFilter): Promise<Result<Webhook[], Error>>;
    update(organizationId: string, id: string, input: UpdateWebhookInput, actorRole: string): Promise<Result<Webhook, Error>>;
    archive(organizationId: string, id: string, actorRole: string): Promise<Result<Webhook, Error>>;
}
//# sourceMappingURL=service.d.ts.map