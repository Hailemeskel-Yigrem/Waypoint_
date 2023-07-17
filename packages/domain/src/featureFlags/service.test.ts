import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryFeatureFlagRepository } from './memory.repository.js';
import { FeatureFlagService } from './service.js';

describe('FeatureFlagService', () => {
  let service: FeatureFlagService;
  const orgId = '11111111-1111-1111-1111-111111111111';

  beforeEach(() => {
    service = new FeatureFlagService(new MemoryFeatureFlagRepository());
  });

  it('creates a featureFlags record', async () => {
    const result = await service.create({ organizationId: orgId, name: 'Alpha FeatureFlag' });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.name).toBe('Alpha FeatureFlag');
      expect(result.value.status).toBe('active');
    }
  });

  it('rejects duplicate names in the same tenant', async () => {
    await service.create({ organizationId: orgId, name: 'Dup' });
    const result = await service.create({ organizationId: orgId, name: 'Dup' });
    expect(result.ok).toBe(false);
  });

  it('enforces tenant isolation on get', async () => {
    const created = await service.create({ organizationId: orgId, name: 'Isolated' });
    if (!created.ok) throw new Error('setup failed');
    const other = await service.get('22222222-2222-2222-2222-222222222222', created.value.id);
    expect(other.ok).toBe(false);
  });

  it('archives with admin role', async () => {
    const created = await service.create({ organizationId: orgId, name: 'Archive Me' });
    if (!created.ok) throw new Error('setup failed');
    const archived = await service.archive(orgId, created.value.id, 'admin');
    expect(archived.ok).toBe(true);
    if (archived.ok) expect(archived.value.status).toBe('archived');
  });

  it('forbids archive for member role', async () => {
    const created = await service.create({ organizationId: orgId, name: 'No Archive' });
    if (!created.ok) throw new Error('setup failed');
    const archived = await service.archive(orgId, created.value.id, 'member');
    expect(archived.ok).toBe(false);
  });
});
