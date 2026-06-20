import { describe, it, expect } from 'vitest';
import { filterByTenant } from '../../src/middleware/tenant.js';

describe('tenant middleware helpers', () => {
  it('filters items by organization', () => {
    const items = [
      { organizationId: 'org1', id: '1' },
      { organizationId: 'org2', id: '2' },
    ];
    expect(filterByTenant('org1', items)).toHaveLength(1);
  });
});
