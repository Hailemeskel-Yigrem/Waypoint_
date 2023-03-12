import type { OrganizationRepository } from './organizations/repository.js';
import type { UserRepository } from './users/repository.js';
import type { SpaceRepository } from './spaces/repository.js';
import type { DeskRepository } from './desks/repository.js';
import type { BookingRepository } from './bookings/repository.js';
import type { VisitorRepository } from './visitors/repository.js';
import type { AmenityRepository } from './amenities/repository.js';
import type { AccessPolicyRepository } from './access/repository.js';
import type { NotificationRepository } from './notifications/repository.js';
import type { AnalyticsRepository } from './analytics/repository.js';
import type { BillingRepository } from './billing/repository.js';
import type { IntegrationRepository } from './integrations/repository.js';
import type { DirectoryRepository } from './directory/repository.js';

import { MemoryOrganizationRepository } from './organizations/memory.repository.js';
import { MemoryUserRepository } from './users/memory.repository.js';
import { MemorySpaceRepository } from './spaces/memory.repository.js';
import { MemoryDeskRepository } from './desks/memory.repository.js';
import { MemoryBookingRepository } from './bookings/memory.repository.js';
import { MemoryVisitorRepository } from './visitors/memory.repository.js';
import { MemoryAmenityRepository } from './amenities/memory.repository.js';
import { MemoryAccessPolicyRepository } from './access/memory.repository.js';
import {
  MemoryNotificationRepository,
  ConsoleNotificationDispatcher,
} from './notifications/memory.repository.js';
import { AnalyticsDataRepository } from './analytics/memory.repository.js';
import { MemoryBillingRepository } from './billing/memory.repository.js';
import { MemoryIntegrationRepository } from './integrations/memory.repository.js';
import { MemoryDirectoryRepository } from './directory/memory.repository.js';
import { MemoryHealthRepository } from './health/memory.repository.js';

import { BillingService } from './billing/service.js';
import { AccessService } from './access/service.js';
import { AnalyticsService } from './analytics/service.js';
import { HealthService } from './health/service.js';
import type { NotificationDispatcher } from './notifications/repository.js';

export interface Repositories {
  organizations: OrganizationRepository;
  users: UserRepository;
  spaces: SpaceRepository;
  desks: DeskRepository;
  bookings: BookingRepository;
  visitors: VisitorRepository;
  amenities: AmenityRepository;
  access: AccessPolicyRepository;
  notifications: NotificationRepository;
  analytics: AnalyticsRepository;
  billing: BillingRepository;
  integrations: IntegrationRepository;
  directory: DirectoryRepository;
}

export interface Services {
  billing: BillingService;
  access: AccessService;
  analytics: AnalyticsService;
  health: HealthService;
}

export interface Dispatchers {
  notifications: NotificationDispatcher;
}

export function createMemoryRepositories(): Repositories {
  return {
    organizations: new MemoryOrganizationRepository(),
    users: new MemoryUserRepository(),
    spaces: new MemorySpaceRepository(),
    desks: new MemoryDeskRepository(),
    bookings: new MemoryBookingRepository(),
    visitors: new MemoryVisitorRepository(),
    amenities: new MemoryAmenityRepository(),
    access: new MemoryAccessPolicyRepository(),
    notifications: new MemoryNotificationRepository(),
    billing: new MemoryBillingRepository(),
    integrations: new MemoryIntegrationRepository(),
    directory: new MemoryDirectoryRepository(),
    analytics: null as unknown as AnalyticsRepository,
  };
}

export function wireRepositories(repos: Repositories): Repositories {
  repos.analytics = new AnalyticsDataRepository(
    repos.desks,
    repos.bookings,
    repos.visitors,
    repos.users,
    repos.spaces,
  );
  return repos;
}

export function createServices(repos: Repositories): Services {
  const billing = new BillingService(
    repos.billing,
    repos.organizations,
    repos.users,
    repos.spaces,
    repos.desks,
    repos.bookings,
  );

  return {
    billing,
    access: new AccessService(repos.access, repos.users),
    analytics: new AnalyticsService(repos.analytics),
    health: new HealthService(new MemoryHealthRepository(false)),
  };
}

export function createDispatchers(): Dispatchers {
  return {
    notifications: new ConsoleNotificationDispatcher(),
  };
}

export * from './organizations/index.js';
export * from './users/index.js';
export * from './spaces/index.js';
export * from './desks/index.js';
export * from './bookings/index.js';
export * from './visitors/index.js';
export * from './amenities/index.js';
export * from './access/index.js';
export * from './notifications/index.js';
export * from './analytics/index.js';
export * from './billing/index.js';
export * from './integrations/index.js';
export * from './directory/index.js';
export * from './health/index.js';
