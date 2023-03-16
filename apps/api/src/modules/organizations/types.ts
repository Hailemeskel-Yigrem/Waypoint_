import type { Timestamps, BillingPlan } from '../../lib/types.js';

export interface Organization extends Timestamps {
  id: string;
  name: string;
  slug: string;
  plan: BillingPlan;
  status: 'active' | 'suspended' | 'trial';
  settings: OrganizationSettings;
}

export interface OrganizationSettings {
  timezone: string;
  locale: string;
  visitorCheckInWindowMinutes: number;
  defaultBookingDurationMinutes: number;
  requireDeskAssignment: boolean;
}

export interface CreateOrganizationInput {
  name: string;
  slug: string;
  plan?: BillingPlan;
  settings?: Partial<OrganizationSettings>;
}

export interface UpdateOrganizationInput {
  name?: string;
  slug?: string;
  plan?: BillingPlan;
  status?: Organization['status'];
  settings?: Partial<OrganizationSettings>;
}

export const DEFAULT_ORG_SETTINGS: OrganizationSettings = {
  timezone: 'UTC',
  locale: 'en-US',
  visitorCheckInWindowMinutes: 30,
  defaultBookingDurationMinutes: 480,
  requireDeskAssignment: false,
};
