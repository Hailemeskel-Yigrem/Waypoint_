import { AppError } from '../../lib/errors.js';
import { ok, err, type Result } from '../../lib/result.js';
import type { AmenityRepository } from './repository.js';
import type {
  Amenity,
  AmenityReservation,
  CreateAmenityInput,
  CreateReservationInput,
} from './types.js';
import type { PaginationQuery, PaginatedResult } from '../../lib/pagination.js';
import type { SpaceRepository } from '../spaces/repository.js';

export class AmenityService {
  constructor(
    private readonly repo: AmenityRepository,
    private readonly spaceRepo: SpaceRepository,
  ) {}

  async create(
    organizationId: string,
    input: Omit<CreateAmenityInput, 'organizationId'>,
  ): Promise<Result<Amenity>> {
    const space = await this.spaceRepo.findById(organizationId, input.spaceId);
    if (!space) return err(AppError.notFound('Space', input.spaceId));
    const amenity = await this.repo.create({ ...input, organizationId });
    return ok(amenity);
  }

  async getById(organizationId: string, id: string): Promise<Result<Amenity>> {
    const amenity = await this.repo.findById(organizationId, id);
    if (!amenity) return err(AppError.notFound('Amenity', id));
    return ok(amenity);
  }

  async list(organizationId: string, query: PaginationQuery): Promise<PaginatedResult<Amenity>> {
    return this.repo.list(organizationId, query);
  }

  async reserve(
    organizationId: string,
    userId: string,
    input: Omit<CreateReservationInput, 'organizationId' | 'userId'>,
  ): Promise<Result<AmenityReservation>> {
    const amenity = await this.repo.findById(organizationId, input.amenityId);
    if (!amenity) return err(AppError.notFound('Amenity', input.amenityId));
    if (!amenity.isActive) return err(AppError.validation('Amenity is not active'));

    const currentOccupancy = await this.repo.countOccupancy(
      organizationId,
      input.amenityId,
      input.startTime,
      input.endTime,
    );

    if (currentOccupancy + input.partySize > amenity.capacity) {
      return err(
        AppError.capacityExceeded('Amenity capacity exceeded for requested time slot', {
          capacity: amenity.capacity,
          currentOccupancy,
          requested: input.partySize,
        }),
      );
    }

    const reservation = await this.repo.createReservation({
      ...input,
      organizationId,
      userId,
    });
    return ok(reservation);
  }
}
