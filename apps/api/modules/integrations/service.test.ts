import { describe, it, expect, beforeEach } from 'vitest';
import { IntegrationService } from '../../src/modules/integrations/service.js';
import { MemoryIntegrationRepository } from '../../src/modules/integrations/memory.repository.js';
import { MemoryOrganizationRepository } from '../../src/modules/organizations/memory.repository.js';

describe('IntegrationService', () => {
  let service: IntegrationService;
  let orgId: string;

  beforeEach(async () => {
    orgId = (await new MemoryOrganizationRepository().create({ name: 'O', slug: 'int' })).id;
    service = new IntegrationService(new MemoryIntegrationRepository());
  });

  it('validates required slack config', async () => {
    const result = await service.create(orgId, { provider: 'slack', name: 'Slack', config: {} });
    expect(result.ok).toBe(false);
  });

  it('activates integration with valid config', async () => {
    const created = await service.create(orgId, {
      provider: 'webhook',
      name: 'WH',
      config: { url: 'https://example.com/hook' },
    });
    expect(created.ok).toBe(true);
    if (created.ok) {
      const activated = await service.activate(orgId, created.value.id);
      expect(activated.ok).toBe(true);
    }
  });
});
