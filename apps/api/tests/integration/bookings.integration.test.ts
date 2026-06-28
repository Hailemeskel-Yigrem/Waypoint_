import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import type pg from 'pg';
import { createPool, runMigrations } from '@waypoint/database';
import { PgDatabaseClient } from '../../src/plugins/database.js';
import { PostgresBookingRepository } from '../../src/modules/bookings/postgres.repository.js';
import { BookingService } from '../../src/modules/bookings/service.js';
import type { DeskRepository } from '../../src/modules/desks/repository.js';
import type { SpaceRepository } from '../../src/modules/spaces/repository.js';
import type { BillingService } from '../../src/modules/billing/service.js';
import type { AccessService } from '../../src/modules/access/service.js';
import { ok } from '../../src/lib/result.js';

const ORGANIZATION_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const USER_ID = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const SPACE_ID = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
const DESK_ID = 'dddddddd-dddd-dddd-dddd-dddddddddddd';

function testDatabaseUrl(): string {
  const url = process.env.TEST_DATABASE_URL;
  if (!url) throw new Error('TEST_DATABASE_URL is required for API database integration tests');
  return url;
}

describe('BookingService with PostgreSQL', () => {
  let pool: pg.Pool;
  let service: BookingService;

  beforeAll(async () => {
    pool = createPool(testDatabaseUrl());
    await pool.query('DROP SCHEMA public CASCADE');
    await pool.query('CREATE SCHEMA public');
    await runMigrations(pool);
    await pool.query(
      `INSERT INTO organizations (id, name, slug, plan, status)
       VALUES ($1, 'API Integration', 'api-integration', 'starter', 'active')`,
      [ORGANIZATION_ID],
    );
    await pool.query(
      `INSERT INTO users (id, org_id, email, name, role, status)
       VALUES ($1, $2, 'member@api.test', 'API Member', 'member', 'active')`,
      [USER_ID, ORGANIZATION_ID],
    );
    await pool.query(
      `INSERT INTO spaces (id, org_id, name, slug, type, capacity)
       VALUES ($1, $2, 'API Floor', 'api-floor', 'office', 10)`,
      [SPACE_ID, ORGANIZATION_ID],
    );
    await pool.query(
      `INSERT INTO desks (id, org_id, space_id, label)
       VALUES ($1, $2, $3, 'API-01')`,
      [DESK_ID, ORGANIZATION_ID, SPACE_ID],
    );

    const repository = new PostgresBookingRepository(new PgDatabaseClient(pool));
    const deskRepository = {
      findById: vi.fn().mockResolvedValue({
        id: DESK_ID,
        organizationId: ORGANIZATION_ID,
        spaceId: SPACE_ID,
        label: 'API-01',
        isBookable: true,
        isActive: true,
        amenities: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    } as unknown as DeskRepository;
    const billing = {
      canCreateBooking: vi.fn().mockResolvedValue(ok(undefined)),
    } as unknown as BillingService;
    const access = {
      canBook: vi.fn().mockResolvedValue(ok(undefined)),
    } as unknown as AccessService;

    service = new BookingService(
      repository,
      deskRepository,
      {} as SpaceRepository,
      billing,
      access,
    );
  });

  afterAll(async () => {
    await pool?.end();
  });

  it('persists a booking and reports a conflicting request through the service result', async () => {
    const first = await service.create(ORGANIZATION_ID, USER_ID, {
      deskId: DESK_ID,
      title: 'PostgreSQL booking',
      startTime: new Date('2026-06-28T09:00:00.000Z'),
      endTime: new Date('2026-06-28T10:00:00.000Z'),
    });

    expect(first.ok).toBe(true);
    if (!first.ok) throw first.error;
    await expect(service.getById(ORGANIZATION_ID, first.value.id)).resolves.toEqual(
      expect.objectContaining({
        ok: true,
        value: expect.objectContaining({ title: 'PostgreSQL booking', deskId: DESK_ID }),
      }),
    );

    const conflict = await service.create(ORGANIZATION_ID, USER_ID, {
      deskId: DESK_ID,
      title: 'Conflicting booking',
      startTime: new Date('2026-06-28T09:30:00.000Z'),
      endTime: new Date('2026-06-28T10:30:00.000Z'),
    });

    expect(conflict).toEqual(
      expect.objectContaining({
        ok: false,
        error: expect.objectContaining({ code: 'BOOKING_OVERLAP', statusCode: 409 }),
      }),
    );
    const persisted = await pool.query<{ count: number }>(
      'SELECT COUNT(*)::int AS count FROM bookings WHERE org_id = $1',
      [ORGANIZATION_ID],
    );
    expect(persisted.rows[0]?.count).toBe(1);
  });
});
