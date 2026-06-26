import { type Result } from '../result.js';
import type { Report, CreateReportInput, UpdateReportInput, ReportFilter } from './types.js';
import type { ReportRepository } from './repository.js';
export declare class ReportService {
    private readonly repo;
    constructor(repo: ReportRepository);
    create(input: CreateReportInput): Promise<Result<Report, Error>>;
    get(organizationId: string, id: string): Promise<Result<Report, Error>>;
    list(filter: ReportFilter): Promise<Result<Report[], Error>>;
    update(organizationId: string, id: string, input: UpdateReportInput, actorRole: string): Promise<Result<Report, Error>>;
    archive(organizationId: string, id: string, actorRole: string): Promise<Result<Report, Error>>;
}
//# sourceMappingURL=service.d.ts.map