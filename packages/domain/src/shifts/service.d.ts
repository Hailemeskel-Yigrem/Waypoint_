import { type Result } from '../result.js';
import type { Shift, CreateShiftInput, UpdateShiftInput, ShiftFilter } from './types.js';
import type { ShiftRepository } from './repository.js';
export declare class ShiftService {
    private readonly repo;
    constructor(repo: ShiftRepository);
    create(input: CreateShiftInput): Promise<Result<Shift, Error>>;
    get(organizationId: string, id: string): Promise<Result<Shift, Error>>;
    list(filter: ShiftFilter): Promise<Result<Shift[], Error>>;
    update(organizationId: string, id: string, input: UpdateShiftInput, actorRole: string): Promise<Result<Shift, Error>>;
    archive(organizationId: string, id: string, actorRole: string): Promise<Result<Shift, Error>>;
}
//# sourceMappingURL=service.d.ts.map