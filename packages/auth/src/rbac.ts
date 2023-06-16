import type { UserRole } from '@waypoint/shared';

export type Permission =
  | 'org:read'
  | 'org:write'
  | 'users:read'
  | 'users:write'
  | 'spaces:read'
  | 'spaces:write'
  | 'bookings:read'
  | 'bookings:write'
  | 'visitors:read'
  | 'visitors:write'
  | 'billing:read'
  | 'billing:write'
  | 'analytics:read'
  | 'settings:write';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  owner: [
    'org:read',
    'org:write',
    'users:read',
    'users:write',
    'spaces:read',
    'spaces:write',
    'bookings:read',
    'bookings:write',
    'visitors:read',
    'visitors:write',
    'billing:read',
    'billing:write',
    'analytics:read',
    'settings:write',
  ],
  admin: [
    'org:read',
    'org:write',
    'users:read',
    'users:write',
    'spaces:read',
    'spaces:write',
    'bookings:read',
    'bookings:write',
    'visitors:read',
    'visitors:write',
    'billing:read',
    'analytics:read',
    'settings:write',
  ],
  manager: [
    'org:read',
    'users:read',
    'spaces:read',
    'spaces:write',
    'bookings:read',
    'bookings:write',
    'visitors:read',
    'visitors:write',
    'analytics:read',
  ],
  member: [
    'org:read',
    'spaces:read',
    'bookings:read',
    'bookings:write',
    'visitors:read',
    'visitors:write',
  ],
  guest: ['spaces:read', 'bookings:read'],
};

export function getPermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return getPermissions(role).includes(permission);
}

export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  const set = new Set(getPermissions(role));
  return permissions.some((p) => set.has(p));
}

export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  const set = new Set(getPermissions(role));
  return permissions.every((p) => set.has(p));
}

export function requirePermission(role: UserRole, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    throw new Error(`Forbidden: missing permission ${permission}`);
  }
}
