import { describe, it, expect } from 'vitest';
import { hasPermission, requirePermission, getPermissions } from './rbac.js';

describe('rbac', () => {
  it('owner has billing write', () => {
    expect(hasPermission('owner', 'billing:write')).toBe(true);
  });
  it('guest lacks users write', () => {
    expect(hasPermission('guest', 'users:write')).toBe(false);
  });
  it('requirePermission throws', () => {
    expect(() => requirePermission('guest', 'users:write')).toThrow('Forbidden');
  });
  it('getPermissions returns array', () => {
    expect(getPermissions('member').length).toBeGreaterThan(0);
  });
});
