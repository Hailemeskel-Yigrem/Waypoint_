import { AppError } from '../../lib/errors.js';
import { ok, err, type Result } from '../../lib/result.js';
import type { IntegrationRepository } from './repository.js';
import type { Integration, CreateIntegrationInput, UpdateIntegrationInput } from './types.js';
import type { PaginationQuery, PaginatedResult } from '../../lib/pagination.js';

const REQUIRED_CONFIG: Record<Integration['provider'], string[]> = {
  slack: ['webhookUrl'],
  teams: ['webhookUrl'],
  google_calendar: ['clientId', 'clientSecret'],
  okta: ['domain', 'clientId'],
  webhook: ['url'],
};

export class IntegrationService {
  constructor(private readonly repo: IntegrationRepository) {}

  private validateConfig(
    provider: Integration['provider'],
    config: Record<string, string>,
  ): Result<void> {
    const required = REQUIRED_CONFIG[provider];
    const missing = required.filter((key) => !config[key]?.trim());
    if (missing.length > 0) {
      return err(AppError.validation(`Missing required config keys: ${missing.join(', ')}`));
    }
    return ok(undefined);
  }

  async create(
    organizationId: string,
    input: Omit<CreateIntegrationInput, 'organizationId'>,
  ): Promise<Result<Integration>> {
    const configCheck = this.validateConfig(input.provider, input.config);
    if (!configCheck.ok) return configCheck as Result<never>;
    const integration = await this.repo.create({ ...input, organizationId });
    return ok(integration);
  }

  async activate(organizationId: string, id: string): Promise<Result<Integration>> {
    const existing = await this.repo.findById(organizationId, id);
    if (!existing) return err(AppError.notFound('Integration', id));
    const configCheck = this.validateConfig(existing.provider, existing.config);
    if (!configCheck.ok) return configCheck as Result<never>;
    const updated = await this.repo.update(organizationId, id, { status: 'active' });
    if (!updated) return err(AppError.notFound('Integration', id));
    return ok({ ...updated, lastSyncAt: new Date() });
  }

  async update(
    organizationId: string,
    id: string,
    input: UpdateIntegrationInput,
  ): Promise<Result<Integration>> {
    const existing = await this.repo.findById(organizationId, id);
    if (!existing) return err(AppError.notFound('Integration', id));
    if (input.config) {
      const merged = { ...existing.config, ...input.config };
      const configCheck = this.validateConfig(existing.provider, merged);
      if (!configCheck.ok) return configCheck as Result<never>;
    }
    const updated = await this.repo.update(organizationId, id, input);
    if (!updated) return err(AppError.notFound('Integration', id));
    return ok(updated);
  }

  async delete(organizationId: string, id: string): Promise<Result<void>> {
    const deleted = await this.repo.delete(organizationId, id);
    if (!deleted) return err(AppError.notFound('Integration', id));
    return ok(undefined);
  }

  async list(
    organizationId: string,
    query: PaginationQuery,
  ): Promise<PaginatedResult<Integration>> {
    return this.repo.list(organizationId, query);
  }
}
