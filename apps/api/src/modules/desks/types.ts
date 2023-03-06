import type { Timestamps, TenantScoped } from '../../lib/types.js';

export interface Desk extends Timestamps, TenantScoped {
  id: string;
  spaceId: string;
  label: string;
  isBookable: boolean;
  amenities: string[];
  isActive: boolean;
}

export interface CreateDeskInput {
  organizationId: string;
  spaceId: string;
  label: string;
  isBookable?: boolean;
  amenities?: string[];
}

export interface UpdateDeskInput {
  label?: string;
  isBookable?: boolean;
  amenities?: string[];
  isActive?: boolean;
}
