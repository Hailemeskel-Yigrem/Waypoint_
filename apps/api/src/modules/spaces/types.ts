import type { Timestamps, TenantScoped } from '../../lib/types.js';

export type SpaceType = 'office' | 'meeting_room' | 'floor' | 'campus' | 'zone';

export interface Space extends Timestamps, TenantScoped {
  id: string;
  name: string;
  type: SpaceType;
  floor: string | null;
  capacity: number;
  isActive: boolean;
  metadata: Record<string, string>;
}

export interface CreateSpaceInput {
  organizationId: string;
  name: string;
  type: SpaceType;
  floor?: string | null;
  capacity?: number;
  metadata?: Record<string, string>;
}

export interface UpdateSpaceInput {
  name?: string;
  type?: SpaceType;
  floor?: string | null;
  capacity?: number;
  isActive?: boolean;
  metadata?: Record<string, string>;
}
