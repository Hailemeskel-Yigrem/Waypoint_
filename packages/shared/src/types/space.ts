import type { SpaceType } from '../constants/index.js';
import type { EntityId, OrgId } from './id.js';

export interface Space {
  id: EntityId;
  orgId: OrgId;
  name: string;
  slug: string;
  type: SpaceType;
  floor?: string;
  capacity: number;
  amenities: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Desk {
  id: EntityId;
  orgId: OrgId;
  spaceId: EntityId;
  label: string;
  isBookable: boolean;
  coordinates?: { x: number; y: number };
}
