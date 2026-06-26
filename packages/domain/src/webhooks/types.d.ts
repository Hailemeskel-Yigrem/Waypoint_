export type WebhookStatus = 'active' | 'inactive' | 'archived' | 'draft';
export interface Webhook {
    id: string;
    organizationId: string;
    name: string;
    status: WebhookStatus;
    metadata?: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
}
export interface CreateWebhookInput {
    organizationId: string;
    name: string;
    status?: WebhookStatus;
    metadata?: Record<string, unknown>;
}
export interface UpdateWebhookInput {
    name?: string;
    status?: WebhookStatus;
    metadata?: Record<string, unknown>;
    updatedAt?: string;
}
export interface WebhookFilter {
    organizationId: string;
    status?: WebhookStatus;
    query?: string;
    limit?: number;
    offset?: number;
}
//# sourceMappingURL=types.d.ts.map