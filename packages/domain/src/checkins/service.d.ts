import { type Result } from '../result.js';
import type { CheckIn, CreateCheckInInput, UpdateCheckInInput, CheckInFilter } from './types.js';
import type { CheckInRepository } from './repository.js';
export declare class CheckInService {
    private readonly repo;
    constructor(repo: CheckInRepository);
    create(input: CreateCheckInInput): Promise<Result<CheckIn, Error>>;
    get(organizationId: string, id: string): Promise<Result<CheckIn, Error>>;
    list(filter: CheckInFilter): Promise<Result<CheckIn[], Error>>;
    update(organizationId: string, id: string, input: UpdateCheckInInput, actorRole: string): Promise<Result<CheckIn, Error>>;
    archive(organizationId: string, id: string, actorRole: string): Promise<Result<CheckIn, Error>>;
}
//# sourceMappingURL=service.d.ts.map