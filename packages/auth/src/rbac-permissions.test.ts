import { describe, it, expect } from 'vitest';
import { hasAllPermissions, hasAnyPermission, hasPermission } from './rbac.js';

describe('rbac permission helpers', () => {
  it('admin has any of the listed permissions', () => {
    expect(hasAnyPermission('admin', ['users:write', 'billing:write'])).toBe(true);
  });

  it('member does not have all elevated permissions', () => {
    expect(hasAllPermissions('member', ['users:write', 'billing:write'])).toBe(false);
  });

  it('owner retains bookings write', () => {
    expect(hasPermission('owner', 'bookings:write')).toBe(true);
  });
});
