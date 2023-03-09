import type { Timestamps, TenantScoped } from '../../lib/types.js';

export interface DirectoryEntry extends Timestamps, TenantScoped {
  id: string;
  userId: string | null;
  displayName: string;
  email: string;
  department: string | null;
  title: string | null;
  phone: string | null;
  location: string | null;
  isVisible: boolean;
}

export interface CreateDirectoryEntryInput {
  organizationId: string;
  userId?: string | null;
  displayName: string;
  email: string;
  department?: string | null;
  title?: string | null;
  phone?: string | null;
  location?: string | null;
}

export interface UpdateDirectoryEntryInput {
  displayName?: string;
  email?: string;
  department?: string | null;
  title?: string | null;
  phone?: string | null;
  location?: string | null;
  isVisible?: boolean;
}

export interface DirectorySearchQuery {
  q?: string;
  department?: string;
}
