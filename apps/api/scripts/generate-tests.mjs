#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testsDir = path.join(__dirname, '..');

function write(rel, content) {
  const full = path.join(testsDir, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trimStart() + '\n');
}

const libTests = [
  ['lib/errors.test.ts', `
import { describe, it, expect } from 'vitest';
import { AppError, isAppError } from '../../src/lib/errors.js';

describe('AppError', () => {
  it('creates validation errors with 400', () => {
    const err = AppError.validation('bad input', { field: 'name' });
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('VALIDATION_ERROR');
    expect(isAppError(err)).toBe(true);
  });

  it('creates booking overlap errors', () => {
    const err = AppError.bookingOverlap({ id: 'b1' });
    expect(err.code).toBe('BOOKING_OVERLAP');
    expect(err.statusCode).toBe(409);
  });

  it('creates billing limit errors with 402', () => {
    const err = AppError.billingLimit('limit reached');
    expect(err.statusCode).toBe(402);
  });
});
`],
  ['lib/result.test.ts', `
import { describe, it, expect } from 'vitest';
import { ok, err, unwrap, mapResult, flatMapResult } from '../../src/lib/result.js';
import { AppError } from '../../src/lib/errors.js';

describe('Result', () => {
  it('unwraps ok values', () => {
    expect(unwrap(ok(42))).toBe(42);
  });

  it('throws on err', () => {
    expect(() => unwrap(err(AppError.notFound('X')))).toThrow();
  });

  it('maps ok values', () => {
    expect(mapResult(ok(2), (n) => n * 2)).toEqual(ok(4));
  });

  it('short-circuits on err in flatMap', () => {
    const result = flatMapResult(ok(1), () => err(AppError.conflict('nope')));
    expect(result.ok).toBe(false);
  });
});
`],
  ['lib/pagination.test.ts', `
import { describe, it, expect } from 'vitest';
import { paginate, offsetFromPage, sortItems } from '../../src/lib/pagination.js';

describe('pagination', () => {
  it('computes offset from page', () => {
    expect(offsetFromPage(3, 20)).toBe(40);
  });

  it('paginates items', () => {
    const result = paginate([1, 2], 1, 20, 2);
    expect(result.totalPages).toBe(1);
    expect(result.items).toEqual([1, 2]);
  });

  it('sorts items asc/desc', () => {
    const items = [{ n: 3 }, { n: 1 }];
    expect(sortItems(items, 'n', 'asc').map((i) => i.n)).toEqual([1, 3]);
  });
});
`],
  ['lib/id.test.ts', `
import { describe, it, expect } from 'vitest';
import { generateId, isValidId, extractPrefix } from '../../src/lib/id.js';

describe('id', () => {
  it('generates prefixed ids', () => {
    const id = generateId('user');
    expect(id.startsWith('usr_')).toBe(true);
    expect(isValidId(id, 'user')).toBe(true);
  });

  it('extracts prefix', () => {
    expect(extractPrefix('org_abc123')).toBe('org');
  });
});
`],
  ['lib/crypto.test.ts', `
import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, signPayload, verifySignature, generateToken } from '../../src/lib/crypto.js';

describe('crypto', () => {
  it('hashes and verifies passwords', () => {
    const hash = hashPassword('secret123');
    expect(verifyPassword('secret123', hash)).toBe(true);
    expect(verifyPassword('wrong', hash)).toBe(false);
  });

  it('signs and verifies payloads', () => {
    const sig = signPayload('payload', 'secret');
    expect(verifySignature('payload', sig, 'secret')).toBe(true);
  });

  it('generates tokens', () => {
    expect(generateToken()).toHaveLength(43);
  });
});
`],
  ['lib/types.test.ts', `
import { describe, it, expect } from 'vitest';
import { overlaps, isWithinWindow, BILLING_LIMITS } from '../../src/lib/types.js';

describe('shared types helpers', () => {
  it('detects time overlaps', () => {
    const s = new Date('2026-01-01T09:00:00Z');
    const e = new Date('2026-01-01T11:00:00Z');
    const s2 = new Date('2026-01-01T10:00:00Z');
    const e2 = new Date('2026-01-01T12:00:00Z');
    expect(overlaps(s, e, s2, e2)).toBe(true);
  });

  it('checks window membership', () => {
    const t = new Date('2026-01-01T10:00:00Z');
    const start = new Date('2026-01-01T09:00:00Z');
    const end = new Date('2026-01-01T11:00:00Z');
    expect(isWithinWindow(t, start, end)).toBe(true);
  });

  it('defines billing limits per plan', () => {
    expect(BILLING_LIMITS.free.maxSeats).toBe(5);
    expect(BILLING_LIMITS.enterprise.maxSpaces).toBeGreaterThan(100);
  });
});
`],
];

const moduleTests = {
  organizations: `
import { describe, it, expect, beforeEach } from 'vitest';
import { OrganizationService } from '../../src/modules/organizations/service.js';
import { MemoryOrganizationRepository } from '../../src/modules/organizations/memory.repository.js';

describe('OrganizationService', () => {
  let service: OrganizationService;
  beforeEach(() => { service = new OrganizationService(new MemoryOrganizationRepository()); });

  it('creates organization', async () => {
    const result = await service.create({ name: 'Waypoint HQ', slug: 'waypoint-hq' });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.slug).toBe('waypoint-hq');
  });

  it('rejects duplicate slug', async () => {
    await service.create({ name: 'A', slug: 'dup' });
    const result = await service.create({ name: 'B', slug: 'dup' });
    expect(result.ok).toBe(false);
  });
});
`,
  users: `
import { describe, it, expect, beforeEach } from 'vitest';
import { UserService } from '../../src/modules/users/service.js';
import { MemoryUserRepository } from '../../src/modules/users/memory.repository.js';
import { MemoryOrganizationRepository } from '../../src/modules/organizations/memory.repository.js';
import { MemorySpaceRepository } from '../../src/modules/spaces/memory.repository.js';
import { MemoryDeskRepository } from '../../src/modules/desks/memory.repository.js';
import { MemoryBookingRepository } from '../../src/modules/bookings/memory.repository.js';
import { MemoryBillingRepository } from '../../src/modules/billing/memory.repository.js';
import { BillingService } from '../../src/modules/billing/service.js';
import { hashPassword } from '../../src/lib/crypto.js';

describe('UserService', () => {
  let service: UserService;
  let orgId: string;

  beforeEach(async () => {
    const orgRepo = new MemoryOrganizationRepository();
    const org = await orgRepo.create({ name: 'Test', slug: 'test' });
    orgId = org.id;
    const billing = new BillingService(
      new MemoryBillingRepository(), orgRepo,
      new MemoryUserRepository(), new MemorySpaceRepository(),
      new MemoryDeskRepository(), new MemoryBookingRepository(),
    );
    service = new UserService(new MemoryUserRepository(), billing, 'test-secret-16chars!!', 'salt');
  });

  it('creates user with hashed password', async () => {
    const result = await service.create(orgId, { email: 'a@test.com', name: 'A', password: 'password123' });
    expect(result.ok).toBe(true);
  });

  it('logs in active user', async () => {
    const repo = new MemoryUserRepository();
    const billing = new BillingService(new MemoryBillingRepository(), new MemoryOrganizationRepository(), repo, new MemorySpaceRepository(), new MemoryDeskRepository(), new MemoryBookingRepository());
    const svc = new UserService(repo, billing, 'test-secret-16chars!!', 'salt');
    await repo.create({ organizationId: orgId, email: 'login@test.com', name: 'Login', passwordHash: hashPassword('password123') });
    const user = await repo.findByEmail(orgId, 'login@test.com');
    await repo.update(orgId, user!.id, { status: 'active' });
    const result = await svc.login({ organizationId: orgId, email: 'login@test.com', password: 'password123' });
    expect(result.ok).toBe(true);
  });
});
`,
  spaces: `
import { describe, it, expect, beforeEach } from 'vitest';
import { SpaceService } from '../../src/modules/spaces/service.js';
import { MemorySpaceRepository } from '../../src/modules/spaces/memory.repository.js';
import { MemoryOrganizationRepository } from '../../src/modules/organizations/memory.repository.js';
import { MemoryUserRepository } from '../../src/modules/users/memory.repository.js';
import { MemoryDeskRepository } from '../../src/modules/desks/memory.repository.js';
import { MemoryBookingRepository } from '../../src/modules/bookings/memory.repository.js';
import { MemoryBillingRepository } from '../../src/modules/billing/memory.repository.js';
import { BillingService } from '../../src/modules/billing/service.js';

describe('SpaceService', () => {
  let service: SpaceService;
  let orgId: string;

  beforeEach(async () => {
    const orgRepo = new MemoryOrganizationRepository();
    orgId = (await orgRepo.create({ name: 'O', slug: 'o' })).id;
    const billing = new BillingService(new MemoryBillingRepository(), orgRepo, new MemoryUserRepository(), new MemorySpaceRepository(), new MemoryDeskRepository(), new MemoryBookingRepository());
    service = new SpaceService(new MemorySpaceRepository(), billing);
  });

  it('creates space within billing limits', async () => {
    const result = await service.create(orgId, { name: 'Floor 1', type: 'floor', capacity: 50 });
    expect(result.ok).toBe(true);
  });
});
`,
  desks: `
import { describe, it, expect, beforeEach } from 'vitest';
import { DeskService } from '../../src/modules/desks/service.js';
import { MemoryDeskRepository } from '../../src/modules/desks/memory.repository.js';
import { MemorySpaceRepository } from '../../src/modules/spaces/memory.repository.js';
import { MemoryOrganizationRepository } from '../../src/modules/organizations/memory.repository.js';
import { MemoryUserRepository } from '../../src/modules/users/memory.repository.js';
import { MemoryBookingRepository } from '../../src/modules/bookings/memory.repository.js';
import { MemoryBillingRepository } from '../../src/modules/billing/memory.repository.js';
import { BillingService } from '../../src/modules/billing/service.js';

describe('DeskService', () => {
  let service: DeskService;
  let orgId: string;
  let spaceId: string;

  beforeEach(async () => {
    const orgRepo = new MemoryOrganizationRepository();
    orgId = (await orgRepo.create({ name: 'O', slug: 'o2' })).id;
    const spaceRepo = new MemorySpaceRepository();
    spaceId = (await spaceRepo.create({ organizationId: orgId, name: 'S', type: 'office' })).id;
    const billing = new BillingService(new MemoryBillingRepository(), orgRepo, new MemoryUserRepository(), spaceRepo, new MemoryDeskRepository(), new MemoryBookingRepository());
    service = new DeskService(new MemoryDeskRepository(), spaceRepo, billing);
  });

  it('creates desk in existing space', async () => {
    const result = await service.create(orgId, { spaceId, label: 'D-101' });
    expect(result.ok).toBe(true);
  });

  it('rejects desk for missing space', async () => {
    const result = await service.create(orgId, { spaceId: 'missing', label: 'X' });
    expect(result.ok).toBe(false);
  });
});
`,
  bookings: `
import { describe, it, expect, beforeEach } from 'vitest';
import { BookingService } from '../../src/modules/bookings/service.js';
import { MemoryBookingRepository } from '../../src/modules/bookings/memory.repository.js';
import { MemoryDeskRepository } from '../../src/modules/desks/memory.repository.js';
import { MemorySpaceRepository } from '../../src/modules/spaces/memory.repository.js';
import { MemoryOrganizationRepository } from '../../src/modules/organizations/memory.repository.js';
import { MemoryUserRepository } from '../../src/modules/users/memory.repository.js';
import { MemoryBillingRepository } from '../../src/modules/billing/memory.repository.js';
import { MemoryAccessPolicyRepository } from '../../src/modules/access/memory.repository.js';
import { BillingService } from '../../src/modules/billing/service.js';
import { AccessService } from '../../src/modules/access/service.js';

describe('BookingService overlap rules', () => {
  let service: BookingService;
  let orgId: string;
  let userId: string;
  let deskId: string;

  beforeEach(async () => {
    const orgRepo = new MemoryOrganizationRepository();
    orgId = (await orgRepo.create({ name: 'O', slug: 'book' })).id;
    const userRepo = new MemoryUserRepository();
    userId = (await userRepo.create({ organizationId: orgId, email: 'u@t.com', name: 'U' })).id;
    const spaceRepo = new MemorySpaceRepository();
    const spaceId = (await spaceRepo.create({ organizationId: orgId, name: 'S', type: 'office' })).id;
    const deskRepo = new MemoryDeskRepository();
    deskId = (await deskRepo.create({ organizationId: orgId, spaceId, label: 'D1' })).id;
    const bookingRepo = new MemoryBookingRepository();
    const billing = new BillingService(new MemoryBillingRepository(), orgRepo, userRepo, spaceRepo, deskRepo, bookingRepo);
    const access = new AccessService(new MemoryAccessPolicyRepository(), userRepo);
    service = new BookingService(bookingRepo, deskRepo, spaceRepo, billing, access);
  });

  it('creates non-overlapping bookings', async () => {
    const start = new Date('2026-02-01T09:00:00Z');
    const end = new Date('2026-02-01T11:00:00Z');
    const r1 = await service.create(orgId, userId, { deskId, title: 'Morning', startTime: start, endTime: end });
    expect(r1.ok).toBe(true);
    const r2 = await service.create(orgId, userId, {
      deskId, title: 'Afternoon',
      startTime: new Date('2026-02-01T12:00:00Z'),
      endTime: new Date('2026-02-01T14:00:00Z'),
    });
    expect(r2.ok).toBe(true);
  });

  it('rejects overlapping desk bookings', async () => {
    const start = new Date('2026-03-01T09:00:00Z');
    const end = new Date('2026-03-01T12:00:00Z');
    await service.create(orgId, userId, { deskId, title: 'First', startTime: start, endTime: end });
    const overlap = await service.create(orgId, userId, {
      deskId, title: 'Overlap',
      startTime: new Date('2026-03-01T11:00:00Z'),
      endTime: new Date('2026-03-01T13:00:00Z'),
    });
    expect(overlap.ok).toBe(false);
    if (!overlap.ok) expect(overlap.error.code).toBe('BOOKING_OVERLAP');
  });
});
`,
  visitors: `
import { describe, it, expect, beforeEach } from 'vitest';
import { VisitorService } from '../../src/modules/visitors/service.js';
import { MemoryVisitorRepository } from '../../src/modules/visitors/memory.repository.js';
import { MemoryUserRepository } from '../../src/modules/users/memory.repository.js';
import { MemoryOrganizationRepository } from '../../src/modules/organizations/memory.repository.js';

describe('VisitorService', () => {
  let service: VisitorService;
  let orgId: string;
  let hostId: string;

  beforeEach(async () => {
    const orgRepo = new MemoryOrganizationRepository();
    orgId = (await orgRepo.create({ name: 'O', slug: 'vis' })).id;
    const userRepo = new MemoryUserRepository();
    hostId = (await userRepo.create({ organizationId: orgId, email: 'host@t.com', name: 'Host' })).id;
    await userRepo.update(orgId, hostId, { status: 'active' });
    service = new VisitorService(new MemoryVisitorRepository(), userRepo, orgRepo);
  });

  it('requires active host', async () => {
    const result = await service.create(orgId, {
      hostUserId: 'missing', name: 'Guest', expectedArrival: new Date('2026-04-01T10:00:00Z'),
    });
    expect(result.ok).toBe(false);
  });

  it('creates visitor with check-in window', async () => {
    const result = await service.create(orgId, {
      hostUserId: hostId, name: 'Guest', expectedArrival: new Date('2026-04-01T10:00:00Z'),
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.checkInWindowStart.getTime()).toBeLessThan(result.value.expectedArrival.getTime());
    }
  });

  it('rejects check-in outside window', async () => {
    const created = await service.create(orgId, {
      hostUserId: hostId, name: 'Guest', expectedArrival: new Date('2026-04-01T10:00:00Z'), checkInWindowMinutes: 15,
    });
    const visitorId = created.ok ? created.value.id : '';
    const checkIn = await service.checkIn(orgId, visitorId);
    expect(checkIn.ok).toBe(false);
  });
});
`,
  amenities: `
import { describe, it, expect, beforeEach } from 'vitest';
import { AmenityService } from '../../src/modules/amenities/service.js';
import { MemoryAmenityRepository } from '../../src/modules/amenities/memory.repository.js';
import { MemorySpaceRepository } from '../../src/modules/spaces/memory.repository.js';
import { MemoryOrganizationRepository } from '../../src/modules/organizations/memory.repository.js';

describe('AmenityService capacity', () => {
  let service: AmenityService;
  let orgId: string;
  let amenityId: string;

  beforeEach(async () => {
    const orgRepo = new MemoryOrganizationRepository();
    orgId = (await orgRepo.create({ name: 'O', slug: 'amn' })).id;
    const spaceRepo = new MemorySpaceRepository();
    const spaceId = (await spaceRepo.create({ organizationId: orgId, name: 'Gym', type: 'zone' })).id;
    const amenityRepo = new MemoryAmenityRepository();
    amenityId = (await amenityRepo.create({ organizationId: orgId, spaceId, name: 'Gym', type: 'gym', capacity: 2 })).id;
    service = new AmenityService(amenityRepo, spaceRepo);
  });

  it('allows reservation within capacity', async () => {
    const result = await service.reserve(orgId, 'user1', {
      amenityId,
      startTime: new Date('2026-05-01T08:00:00Z'),
      endTime: new Date('2026-05-01T09:00:00Z'),
      partySize: 1,
    });
    expect(result.ok).toBe(true);
  });

  it('rejects when capacity exceeded', async () => {
    const slot = { amenityId, startTime: new Date('2026-05-02T08:00:00Z'), endTime: new Date('2026-05-02T09:00:00Z'), partySize: 2 };
    await service.reserve(orgId, 'u1', slot);
    const result = await service.reserve(orgId, 'u2', { ...slot, partySize: 1 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('CAPACITY_EXCEEDED');
  });
});
`,
  access: `
import { describe, it, expect, beforeEach } from 'vitest';
import { AccessService } from '../../src/modules/access/service.js';
import { MemoryAccessPolicyRepository, evaluatePolicies } from '../../src/modules/access/memory.repository.js';
import { MemoryUserRepository } from '../../src/modules/users/memory.repository.js';
import { MemoryOrganizationRepository } from '../../src/modules/organizations/memory.repository.js';

describe('AccessService policy evaluation', () => {
  let service: AccessService;
  let orgId: string;
  let userId: string;
  let repo: MemoryAccessPolicyRepository;

  beforeEach(async () => {
    orgId = (await new MemoryOrganizationRepository().create({ name: 'O', slug: 'acc' })).id;
    const userRepo = new MemoryUserRepository();
    userId = (await userRepo.create({ organizationId: orgId, email: 'v@t.com', name: 'V', role: 'viewer' })).id;
    repo = new MemoryAccessPolicyRepository();
    service = new AccessService(repo, userRepo);
  });

  it('denies booking when deny policy matches', async () => {
    await repo.create({
      organizationId: orgId, name: 'No viewers', action: 'book_desk', effect: 'deny', priority: 1,
      conditions: { roles: ['viewer'] },
    });
    const result = await service.canBook(orgId, userId, 'desk1', null);
    expect(result.ok).toBe(false);
  });

  it('evaluatePolicies returns first matching policy', async () => {
    const p = await repo.create({
      organizationId: orgId, name: 'Allow admins', action: 'book_space', effect: 'allow', priority: 1,
      conditions: { roles: ['admin'] },
    });
    const match = evaluatePolicies([p], {
      organizationId: orgId, userId: 'x', userRole: 'admin', action: 'book_space',
    });
    expect(match?.id).toBe(p.id);
  });
});
`,
  notifications: `
import { describe, it, expect, beforeEach } from 'vitest';
import { NotificationService } from '../../src/modules/notifications/service.js';
import { MemoryNotificationRepository, ConsoleNotificationDispatcher } from '../../src/modules/notifications/memory.repository.js';
import { MemoryUserRepository } from '../../src/modules/users/memory.repository.js';
import { MemoryOrganizationRepository } from '../../src/modules/organizations/memory.repository.js';

describe('NotificationService', () => {
  let service: NotificationService;
  let orgId: string;
  let userId: string;

  beforeEach(async () => {
    orgId = (await new MemoryOrganizationRepository().create({ name: 'O', slug: 'ntf' })).id;
    const userRepo = new MemoryUserRepository();
    userId = (await userRepo.create({ organizationId: orgId, email: 'n@t.com', name: 'N' })).id;
    service = new NotificationService(new MemoryNotificationRepository(), new ConsoleNotificationDispatcher(), userRepo);
  });

  it('sends notification to existing user', async () => {
    const result = await service.send(orgId, { userId, channel: 'in_app', subject: 'Hi', body: 'Hello' });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.status).toBe('sent');
  });
});
`,
  analytics: `
import { describe, it, expect, beforeEach } from 'vitest';
import { AnalyticsService } from '../../src/modules/analytics/service.js';
import { AnalyticsDataRepository } from '../../src/modules/analytics/memory.repository.js';
import { MemoryDeskRepository } from '../../src/modules/desks/memory.repository.js';
import { MemoryBookingRepository } from '../../src/modules/bookings/memory.repository.js';
import { MemoryVisitorRepository } from '../../src/modules/visitors/memory.repository.js';
import { MemoryUserRepository } from '../../src/modules/users/memory.repository.js';
import { MemorySpaceRepository } from '../../src/modules/spaces/memory.repository.js';
import { MemoryOrganizationRepository } from '../../src/modules/organizations/memory.repository.js';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let orgId: string;

  beforeEach(async () => {
    orgId = (await new MemoryOrganizationRepository().create({ name: 'O', slug: 'ana' })).id;
    const desks = new MemoryDeskRepository();
    const bookings = new MemoryBookingRepository();
    const repo = new AnalyticsDataRepository(desks, bookings, new MemoryVisitorRepository(), new MemoryUserRepository(), new MemorySpaceRepository());
    service = new AnalyticsService(repo);
  });

  it('returns dashboard summary', async () => {
    const result = await service.dashboard(orgId);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.organizationId).toBe(orgId);
  });
});
`,
  billing: `
import { describe, it, expect, beforeEach } from 'vitest';
import { BillingService } from '../../src/modules/billing/service.js';
import { MemoryBillingRepository } from '../../src/modules/billing/memory.repository.js';
import { MemoryOrganizationRepository } from '../../src/modules/organizations/memory.repository.js';
import { MemoryUserRepository } from '../../src/modules/users/memory.repository.js';
import { MemorySpaceRepository } from '../../src/modules/spaces/memory.repository.js';
import { MemoryDeskRepository } from '../../src/modules/desks/memory.repository.js';
import { MemoryBookingRepository } from '../../src/modules/bookings/memory.repository.js';
import { BILLING_LIMITS } from '../../src/lib/types.js';

describe('BillingService plan limits', () => {
  let service: BillingService;
  let orgId: string;
  let userRepo: MemoryUserRepository;

  beforeEach(async () => {
    const orgRepo = new MemoryOrganizationRepository();
    orgId = (await orgRepo.create({ name: 'O', slug: 'bill', plan: 'free' })).id;
    userRepo = new MemoryUserRepository();
    service = new BillingService(new MemoryBillingRepository(), orgRepo, userRepo, new MemorySpaceRepository(), new MemoryDeskRepository(), new MemoryBookingRepository());
  });

  it('blocks seats beyond free plan limit', async () => {
    for (let i = 0; i < BILLING_LIMITS.free.maxSeats; i++) {
      const u = await userRepo.create({ organizationId: orgId, email: \`u\${i}@t.com\`, name: \`U\${i}\` });
      await userRepo.update(orgId, u.id, { status: 'active' });
    }
    const result = await service.canAddSeat(orgId);
    expect(result.ok).toBe(false);
  });
});
`,
  integrations: `
import { describe, it, expect, beforeEach } from 'vitest';
import { IntegrationService } from '../../src/modules/integrations/service.js';
import { MemoryIntegrationRepository } from '../../src/modules/integrations/memory.repository.js';
import { MemoryOrganizationRepository } from '../../src/modules/organizations/memory.repository.js';

describe('IntegrationService', () => {
  let service: IntegrationService;
  let orgId: string;

  beforeEach(async () => {
    orgId = (await new MemoryOrganizationRepository().create({ name: 'O', slug: 'int' })).id;
    service = new IntegrationService(new MemoryIntegrationRepository());
  });

  it('validates required slack config', async () => {
    const result = await service.create(orgId, { provider: 'slack', name: 'Slack', config: {} });
    expect(result.ok).toBe(false);
  });

  it('activates integration with valid config', async () => {
    const created = await service.create(orgId, { provider: 'webhook', name: 'WH', config: { url: 'https://example.com/hook' } });
    expect(created.ok).toBe(true);
    if (created.ok) {
      const activated = await service.activate(orgId, created.value.id);
      expect(activated.ok).toBe(true);
    }
  });
});
`,
  directory: `
import { describe, it, expect, beforeEach } from 'vitest';
import { DirectoryService } from '../../src/modules/directory/service.js';
import { MemoryDirectoryRepository } from '../../src/modules/directory/memory.repository.js';
import { MemoryOrganizationRepository } from '../../src/modules/organizations/memory.repository.js';

describe('DirectoryService', () => {
  let service: DirectoryService;
  let orgId: string;

  beforeEach(async () => {
    orgId = (await new MemoryOrganizationRepository().create({ name: 'O', slug: 'dir' })).id;
    service = new DirectoryService(new MemoryDirectoryRepository());
  });

  it('searches directory entries', async () => {
    await service.create(orgId, { displayName: 'Jane Doe', email: 'jane@acme.test', department: 'Engineering' });
    const result = await service.search(orgId, { page: 1, limit: 20, sortOrder: 'desc', q: 'jane' });
    expect(result.items.length).toBe(1);
  });
});
`,
  health: `
import { describe, it, expect } from 'vitest';
import { HealthService } from '../../src/modules/health/service.js';
import { MemoryHealthRepository } from '../../src/modules/health/memory.repository.js';

describe('HealthService', () => {
  it('returns liveness status', async () => {
    const service = new HealthService(new MemoryHealthRepository(false));
    const status = await service.liveness();
    expect(status.status).toBe('ok');
    expect(status.version).toBeDefined();
  });

  it('returns readiness with db check', async () => {
    const service = new HealthService(new MemoryHealthRepository(false));
    const status = await service.readiness(true);
    expect(status.ready).toBe(true);
  });
});
`,
};

for (const [file, content] of libTests) write(file, content);
for (const [mod, content] of Object.entries(moduleTests)) write(`modules/${mod}/service.test.ts`, content);

// Integration / route tests
const integrationTests = [
  ['integration/health.routes.test.ts', `
import { describe, it, expect, afterEach } from 'vitest';
import { createTestApp } from '../helpers/setup.js';

describe('Health routes', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>['app'];
  afterEach(async () => { await app?.close(); });

  it('GET /api/v1/health', async () => {
    ({ app } = await createTestApp());
    const res = await app.inject({ method: 'GET', url: '/api/v1/health' });
    expect(res.statusCode).toBe(200);
    expect(res.json().data.status).toBe('ok');
  });
});
`],
  ['integration/organizations.routes.test.ts', `
import { describe, it, expect, afterEach } from 'vitest';
import { createTestApp } from '../helpers/setup.js';

describe('Organization routes', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>['app'];
  afterEach(async () => { await app?.close(); });

  it('creates and lists organizations', async () => {
    ({ app } = await createTestApp());
    const create = await app.inject({
      method: 'POST', url: '/api/v1/organizations',
      payload: { name: 'Waypoint Labs', slug: 'waypoint-labs' },
    });
    expect(create.statusCode).toBe(201);
    const list = await app.inject({ method: 'GET', url: '/api/v1/organizations' });
    expect(list.json().data.items.length).toBeGreaterThan(0);
  });
});
`],
  ['integration/auth.routes.test.ts', `
import { describe, it, expect, afterEach } from 'vitest';
import { seedTestContext } from '../helpers/setup.js';

describe('Auth routes', () => {
  let ctx: Awaited<ReturnType<typeof seedTestContext>>;
  afterEach(async () => { await ctx?.app.close(); });

  it('logs in with valid credentials', async () => {
    ctx = await seedTestContext();
    const res = await ctx.app.inject({
      method: 'POST', url: '/api/v1/auth/login',
      payload: { email: 'user@acme.test', password: 'password123', organizationId: ctx.orgId },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().data.token).toBeDefined();
  });

  it('rejects protected route without token', async () => {
    ctx = await seedTestContext();
    const res = await ctx.app.inject({ method: 'GET', url: '/api/v1/spaces' });
    expect(res.statusCode).toBe(401);
  });
});
`],
  ['integration/spaces.routes.test.ts', `
import { describe, it, expect, afterEach } from 'vitest';
import { seedTestContext } from '../helpers/setup.js';

describe('Space routes', () => {
  let ctx: Awaited<ReturnType<typeof seedTestContext>>;
  afterEach(async () => { await ctx?.app.close(); });

  it('creates space with auth', async () => {
    ctx = await seedTestContext();
    const res = await ctx.app.inject({
      method: 'POST', url: '/api/v1/spaces',
      headers: { authorization: ctx.authToken },
      payload: { name: 'HQ', type: 'office', capacity: 100 },
    });
    expect(res.statusCode).toBe(201);
  });
});
`],
  ['integration/bookings.routes.test.ts', `
import { describe, it, expect, afterEach } from 'vitest';
import { seedTestContext } from '../helpers/setup.js';

describe('Booking routes', () => {
  let ctx: Awaited<ReturnType<typeof seedTestContext>>;
  afterEach(async () => { await ctx?.app.close(); });

  it('rejects overlapping bookings via API', async () => {
    ctx = await seedTestContext();
    const space = await ctx.repos.spaces.create({ organizationId: ctx.orgId, name: 'S', type: 'office' });
    const desk = await ctx.repos.desks.create({ organizationId: ctx.orgId, spaceId: space.id, label: 'D1' });
    const headers = { authorization: ctx.authToken };
    const payload = {
      deskId: desk.id, title: 'Work',
      startTime: '2026-06-01T09:00:00.000Z', endTime: '2026-06-01T12:00:00.000Z',
    };
    const first = await ctx.app.inject({ method: 'POST', url: '/api/v1/bookings', headers, payload });
    expect(first.statusCode).toBe(201);
    const second = await ctx.app.inject({
      method: 'POST', url: '/api/v1/bookings', headers,
      payload: { ...payload, title: 'Overlap', startTime: '2026-06-01T11:00:00.000Z', endTime: '2026-06-01T13:00:00.000Z' },
    });
    expect(second.statusCode).toBe(409);
  });
});
`],
  ['integration/tenant-isolation.test.ts', `
import { describe, it, expect, afterEach } from 'vitest';
import { seedTestContext, seedOrganization, seedUser, authHeader } from '../helpers/setup.js';

describe('Tenant isolation', () => {
  let ctx: Awaited<ReturnType<typeof seedTestContext>>;
  afterEach(async () => { await ctx?.app.close(); });

  it('cannot access another org spaces', async () => {
    ctx = await seedTestContext();
    const otherOrg = await seedOrganization(ctx.repos, 'other-corp');
    const space = await ctx.repos.spaces.create({ organizationId: otherOrg, name: 'Secret', type: 'office' });
    const res = await ctx.app.inject({
      method: 'GET', url: \`/api/v1/spaces/\${space.id}\`,
      headers: { authorization: ctx.authToken },
    });
    expect(res.statusCode).toBe(404);
  });
});
`],
  ['middleware/tenant.test.ts', `
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
`],
  ['middleware/auth.test.ts', `
import { describe, it, expect } from 'vitest';
import { encodeJwt } from '../../src/middleware/auth.js';

describe('JWT encoding', () => {
  it('produces three-part token', () => {
    const token = encodeJwt({ userId: 'u1', organizationId: 'o1', role: 'admin', email: 'a@b.com' }, 'test-secret-16chars!!');
    expect(token.split('.')).toHaveLength(3);
  });
});
`],
  ['config/config.test.ts', `
import { describe, it, expect, beforeEach } from 'vitest';
import { loadConfig, resetConfig } from '../../src/config/index.js';

describe('config', () => {
  beforeEach(() => resetConfig());

  it('loads defaults in test mode', () => {
    process.env.NODE_ENV = 'test';
    const config = loadConfig();
    expect(config.PORT).toBe(3000);
  });
});
`],
  ['modules/bookings/repository.test.ts', `
import { describe, it, expect } from 'vitest';
import { MemoryBookingRepository } from '../../src/modules/bookings/memory.repository.js';

describe('MemoryBookingRepository conflicts', () => {
  it('finds overlapping bookings', async () => {
    const repo = new MemoryBookingRepository();
    await repo.create({
      organizationId: 'org1', userId: 'u1', deskId: 'd1', spaceId: null,
      title: 'A', startTime: new Date('2026-01-01T09:00:00Z'), endTime: new Date('2026-01-01T11:00:00Z'),
    });
    const conflicts = await repo.findConflicts({
      organizationId: 'org1', deskId: 'd1',
      startTime: new Date('2026-01-01T10:00:00Z'), endTime: new Date('2026-01-01T12:00:00Z'),
    });
    expect(conflicts).toHaveLength(1);
  });
});
`],
  ['modules/organizations/repository.test.ts', `
import { describe, it, expect } from 'vitest';
import { MemoryOrganizationRepository } from '../../src/modules/organizations/memory.repository.js';

describe('MemoryOrganizationRepository', () => {
  it('finds by slug', async () => {
    const repo = new MemoryOrganizationRepository();
    await repo.create({ name: 'X', slug: 'x-corp' });
    const found = await repo.findBySlug('x-corp');
    expect(found?.name).toBe('X');
  });
});
`],
  ['modules/users/repository.test.ts', `
import { describe, it, expect } from 'vitest';
import { MemoryUserRepository } from '../../src/modules/users/memory.repository.js';

describe('MemoryUserRepository tenant scoping', () => {
  it('scopes findById to organization', async () => {
    const repo = new MemoryUserRepository();
    const user = await repo.create({ organizationId: 'org1', email: 'a@t.com', name: 'A' });
    expect(await repo.findById('org2', user.id)).toBeNull();
    expect(await repo.findById('org1', user.id)).not.toBeNull();
  });
});
`],
  ['modules/spaces/repository.test.ts', `
import { describe, it, expect } from 'vitest';
import { MemorySpaceRepository } from '../../src/modules/spaces/memory.repository.js';

describe('MemorySpaceRepository', () => {
  it('counts spaces per tenant', async () => {
    const repo = new MemorySpaceRepository();
    await repo.create({ organizationId: 'o1', name: 'S1', type: 'office' });
    await repo.create({ organizationId: 'o1', name: 'S2', type: 'office' });
    await repo.create({ organizationId: 'o2', name: 'S3', type: 'office' });
    expect(await repo.count('o1')).toBe(2);
  });
});
`],
  ['modules/desks/repository.test.ts', `
import { describe, it, expect } from 'vitest';
import { MemoryDeskRepository } from '../../src/modules/desks/memory.repository.js';

describe('MemoryDeskRepository', () => {
  it('lists desks by space', async () => {
    const repo = new MemoryDeskRepository();
    await repo.create({ organizationId: 'o1', spaceId: 's1', label: 'A' });
    await repo.create({ organizationId: 'o1', spaceId: 's2', label: 'B' });
    expect((await repo.findBySpace('o1', 's1')).length).toBe(1);
  });
});
`],
  ['modules/visitors/repository.test.ts', `
import { describe, it, expect } from 'vitest';
import { MemoryVisitorRepository } from '../../src/modules/visitors/memory.repository.js';

describe('MemoryVisitorRepository', () => {
  it('stores visitor with window', async () => {
    const repo = new MemoryVisitorRepository();
    const v = await repo.create({
      organizationId: 'o1', hostUserId: 'h1', name: 'G',
      expectedArrival: new Date(), checkInWindowStart: new Date(), checkInWindowEnd: new Date(),
    });
    expect(v.status).toBe('expected');
  });
});
`],
  ['modules/amenities/repository.test.ts', `
import { describe, it, expect } from 'vitest';
import { MemoryAmenityRepository } from '../../src/modules/amenities/memory.repository.js';

describe('MemoryAmenityRepository occupancy', () => {
  it('counts party sizes in overlapping slots', async () => {
    const repo = new MemoryAmenityRepository();
    await repo.createReservation({
      organizationId: 'o1', amenityId: 'a1', userId: 'u1',
      startTime: new Date('2026-01-01T09:00:00Z'), endTime: new Date('2026-01-01T10:00:00Z'), partySize: 3,
    });
    const count = await repo.countOccupancy('o1', 'a1', new Date('2026-01-01T09:30:00Z'), new Date('2026-01-01T09:45:00Z'));
    expect(count).toBe(3);
  });
});
`],
  ['modules/access/repository.test.ts', `
import { describe, it, expect } from 'vitest';
import { MemoryAccessPolicyRepository } from '../../src/modules/access/memory.repository.js';

describe('MemoryAccessPolicyRepository', () => {
  it('orders policies by priority', async () => {
    const repo = new MemoryAccessPolicyRepository();
    await repo.create({ organizationId: 'o1', name: 'Low', action: 'book_desk', effect: 'allow', priority: 100, conditions: {} });
    await repo.create({ organizationId: 'o1', name: 'High', action: 'book_desk', effect: 'deny', priority: 1, conditions: {} });
    const policies = await repo.findByAction('o1', 'book_desk');
    expect(policies[0].name).toBe('High');
  });
});
`],
  ['modules/notifications/repository.test.ts', `
import { describe, it, expect } from 'vitest';
import { MemoryNotificationRepository } from '../../src/modules/notifications/memory.repository.js';

describe('MemoryNotificationRepository', () => {
  it('marks notification read', async () => {
    const repo = new MemoryNotificationRepository();
    const n = await repo.create({ organizationId: 'o1', userId: 'u1', channel: 'email', subject: 'S', body: 'B' });
    const updated = await repo.markRead('o1', n.id);
    expect(updated?.status).toBe('read');
  });
});
`],
  ['modules/billing/repository.test.ts', `
import { describe, it, expect } from 'vitest';
import { MemoryBillingRepository } from '../../src/modules/billing/memory.repository.js';

describe('MemoryBillingRepository', () => {
  it('upserts subscription', async () => {
    const repo = new MemoryBillingRepository();
    const sub = await repo.upsertSubscription('o1', 'starter', 25);
    expect(sub.plan).toBe('starter');
    expect(await repo.getSubscription('o1')).not.toBeNull();
  });
});
`],
  ['modules/integrations/repository.test.ts', `
import { describe, it, expect } from 'vitest';
import { MemoryIntegrationRepository } from '../../src/modules/integrations/memory.repository.js';

describe('MemoryIntegrationRepository', () => {
  it('lists integrations per org', async () => {
    const repo = new MemoryIntegrationRepository();
    await repo.create({ organizationId: 'o1', provider: 'slack', name: 'S', config: { webhookUrl: 'x' } });
    const list = await repo.list('o1', { page: 1, limit: 10, sortOrder: 'desc' });
    expect(list.total).toBe(1);
  });
});
`],
  ['modules/directory/repository.test.ts', `
import { describe, it, expect } from 'vitest';
import { MemoryDirectoryRepository } from '../../src/modules/directory/memory.repository.js';

describe('MemoryDirectoryRepository search', () => {
  it('filters hidden entries', async () => {
    const repo = new MemoryDirectoryRepository();
    const e = await repo.create({ organizationId: 'o1', displayName: 'Hidden', email: 'h@t.com' });
    await repo.update('o1', e.id, { isVisible: false });
    const results = await repo.search('o1', { page: 1, limit: 10, sortOrder: 'desc', q: 'Hidden' });
    expect(results.items).toHaveLength(0);
  });
});
`],
  ['integration/billing.routes.test.ts', `
import { describe, it, expect, afterEach } from 'vitest';
import { seedTestContext } from '../helpers/setup.js';

describe('Billing routes', () => {
  let ctx: Awaited<ReturnType<typeof seedTestContext>>;
  afterEach(async () => { await ctx?.app.close(); });

  it('returns usage snapshot', async () => {
    ctx = await seedTestContext();
    const res = await ctx.app.inject({
      method: 'GET', url: '/api/v1/billing/usage',
      headers: { authorization: ctx.authToken },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().data.organizationId).toBe(ctx.orgId);
  });
});
`],
  ['integration/analytics.routes.test.ts', `
import { describe, it, expect, afterEach } from 'vitest';
import { seedTestContext } from '../helpers/setup.js';

describe('Analytics routes', () => {
  let ctx: Awaited<ReturnType<typeof seedTestContext>>;
  afterEach(async () => { await ctx?.app.close(); });

  it('returns dashboard', async () => {
    ctx = await seedTestContext();
    const res = await ctx.app.inject({
      method: 'GET', url: '/api/v1/analytics/dashboard',
      headers: { authorization: ctx.authToken },
    });
    expect(res.statusCode).toBe(200);
  });
});
`],
  ['integration/visitors.routes.test.ts', `
import { describe, it, expect, afterEach } from 'vitest';
import { seedTestContext } from '../helpers/setup.js';

describe('Visitor routes', () => {
  let ctx: Awaited<ReturnType<typeof seedTestContext>>;
  afterEach(async () => { await ctx?.app.close(); });

  it('registers expected visitor', async () => {
    ctx = await seedTestContext();
    const res = await ctx.app.inject({
      method: 'POST', url: '/api/v1/visitors',
      headers: { authorization: ctx.authToken },
      payload: { hostUserId: ctx.userId, name: 'Guest', expectedArrival: new Date().toISOString() },
    });
    expect(res.statusCode).toBe(201);
  });
});
`],
  ['integration/desks.routes.test.ts', `
import { describe, it, expect, afterEach } from 'vitest';
import { seedTestContext } from '../helpers/setup.js';

describe('Desk routes', () => {
  let ctx: Awaited<ReturnType<typeof seedTestContext>>;
  afterEach(async () => { await ctx?.app.close(); });

  it('creates desk under space', async () => {
    ctx = await seedTestContext();
    const space = await ctx.repos.spaces.create({ organizationId: ctx.orgId, name: 'Floor', type: 'floor' });
    const res = await ctx.app.inject({
      method: 'POST', url: '/api/v1/desks',
      headers: { authorization: ctx.authToken },
      payload: { spaceId: space.id, label: 'D-42' },
    });
    expect(res.statusCode).toBe(201);
  });
});
`],
  ['integration/directory.routes.test.ts', `
import { describe, it, expect, afterEach } from 'vitest';
import { seedTestContext } from '../helpers/setup.js';

describe('Directory routes', () => {
  let ctx: Awaited<ReturnType<typeof seedTestContext>>;
  afterEach(async () => { await ctx?.app.close(); });

  it('creates directory entry', async () => {
    ctx = await seedTestContext();
    const res = await ctx.app.inject({
      method: 'POST', url: '/api/v1/directory',
      headers: { authorization: ctx.authToken },
      payload: { displayName: 'Alex', email: 'alex@acme.test' },
    });
    expect(res.statusCode).toBe(201);
  });
});
`],
  ['integration/access.routes.test.ts', `
import { describe, it, expect, afterEach } from 'vitest';
import { seedTestContext } from '../helpers/setup.js';

describe('Access routes', () => {
  let ctx: Awaited<ReturnType<typeof seedTestContext>>;
  afterEach(async () => { await ctx?.app.close(); });

  it('creates access policy', async () => {
    ctx = await seedTestContext();
    const res = await ctx.app.inject({
      method: 'POST', url: '/api/v1/access/policies',
      headers: { authorization: ctx.authToken },
      payload: { name: 'Allow all', action: 'book_desk', effect: 'allow', conditions: {} },
    });
    expect(res.statusCode).toBe(201);
  });
});
`],
  ['integration/integrations.routes.test.ts', `
import { describe, it, expect, afterEach } from 'vitest';
import { seedTestContext } from '../helpers/setup.js';

describe('Integration routes', () => {
  let ctx: Awaited<ReturnType<typeof seedTestContext>>;
  afterEach(async () => { await ctx?.app.close(); });

  it('creates webhook integration', async () => {
    ctx = await seedTestContext();
    const res = await ctx.app.inject({
      method: 'POST', url: '/api/v1/integrations',
      headers: { authorization: ctx.authToken },
      payload: { provider: 'webhook', name: 'Events', config: { url: 'https://hooks.example.com/w' } },
    });
    expect(res.statusCode).toBe(201);
  });
});
`],
  ['integration/notifications.routes.test.ts', `
import { describe, it, expect, afterEach } from 'vitest';
import { seedTestContext } from '../helpers/setup.js';

describe('Notification routes', () => {
  let ctx: Awaited<ReturnType<typeof seedTestContext>>;
  afterEach(async () => { await ctx?.app.close(); });

  it('lists my notifications', async () => {
    ctx = await seedTestContext();
    const res = await ctx.app.inject({
      method: 'GET', url: '/api/v1/notifications/me',
      headers: { authorization: ctx.authToken },
    });
    expect(res.statusCode).toBe(200);
  });
});
`],
  ['integration/amenities.routes.test.ts', `
import { describe, it, expect, afterEach } from 'vitest';
import { seedTestContext } from '../helpers/setup.js';

describe('Amenity routes', () => {
  let ctx: Awaited<ReturnType<typeof seedTestContext>>;
  afterEach(async () => { await ctx?.app.close(); });

  it('creates amenity', async () => {
    ctx = await seedTestContext();
    const space = await ctx.repos.spaces.create({ organizationId: ctx.orgId, name: 'Gym Zone', type: 'zone' });
    const res = await ctx.app.inject({
      method: 'POST', url: '/api/v1/amenities',
      headers: { authorization: ctx.authToken },
      payload: { spaceId: space.id, name: 'Fitness Center', type: 'gym', capacity: 20 },
    });
    expect(res.statusCode).toBe(201);
  });
});
`],
];

for (const [file, content] of integrationTests) write(file, content);

console.log('Generated tests:', libTests.length + Object.keys(moduleTests).length + integrationTests.length);
