import type { Timestamps, TenantScoped } from '../../lib/types.js';

export type IntegrationProvider = 'slack' | 'teams' | 'google_calendar' | 'okta' | 'webhook';

export type IntegrationStatus = 'active' | 'inactive' | 'error';

export interface Integration extends Timestamps, TenantScoped {
  id: string;
  provider: IntegrationProvider;
  name: string;
  status: IntegrationStatus;
  config: Record<string, string>;
  lastSyncAt: Date | null;
}

export interface CreateIntegrationInput {
  organizationId: string;
  provider: IntegrationProvider;
  name: string;
  config: Record<string, string>;
}

export interface UpdateIntegrationInput {
  name?: string;
  status?: IntegrationStatus;
  config?: Record<string, string>;
}
