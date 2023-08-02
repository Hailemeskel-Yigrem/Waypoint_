import type { Report, CreateReportInput, UpdateReportInput, ReportFilter } from './types.js';

export interface ReportRepository {
  create(
    input: CreateReportInput & { status: string; createdAt: string; updatedAt: string },
  ): Promise<Report>;
  findById(organizationId: string, id: string): Promise<Report | null>;
  findByName(organizationId: string, name: string): Promise<Report | null>;
  list(filter: ReportFilter): Promise<Report[]>;
  update(organizationId: string, id: string, input: UpdateReportInput): Promise<Report>;
}
