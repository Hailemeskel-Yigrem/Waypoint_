import type { Report, CreateReportInput, UpdateReportInput, ReportFilter } from './types.js';
import type { ReportRepository } from './repository.js';
export declare class MemoryReportRepository implements ReportRepository {
    private readonly rows;
    private key;
    create(input: CreateReportInput & {
        status: string;
        createdAt: string;
        updatedAt: string;
    }): Promise<Report>;
    findById(organizationId: string, id: string): Promise<Report | null>;
    findByName(organizationId: string, name: string): Promise<Report | null>;
    list(filter: ReportFilter): Promise<Report[]>;
    update(organizationId: string, id: string, input: UpdateReportInput): Promise<Report>;
}
//# sourceMappingURL=memory.repository.d.ts.map