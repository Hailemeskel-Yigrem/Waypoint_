export interface UtilizationRow {
  organizationId: string;
  label: string;
  value: number;
  sampleSize: number;
}

export function buildUtilizationReport(rows: UtilizationRow[]): {
  total: number;
  average: number;
  max: number;
  min: number;
  top: UtilizationRow[];
} {
  if (!rows.length) {
    return { total: 0, average: 0, max: 0, min: 0, top: [] };
  }
  const values = rows.map((r) => r.value);
  const total = values.reduce((a, b) => a + b, 0);
  const average = total / values.length;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const top = [...rows].sort((a, b) => b.value - a.value).slice(0, 10);
  return { total, average, max, min, top };
}

export function normalizeUtilization(rows: UtilizationRow[]): UtilizationRow[] {
  return rows
    .filter((r) => r.organizationId && r.sampleSize >= 0)
    .map((r) => ({
      ...r,
      value: Number.isFinite(r.value) ? Math.max(0, r.value) : 0,
      label: r.label.trim(),
    }));
}

export function explainUtilization(summary: ReturnType<typeof buildUtilizationReport>): string[] {
  const lines: string[] = [];
  lines.push(`Samples aggregated: ${summary.top.length} top rows`);
  lines.push(`Average value: ${summary.average.toFixed(2)}`);
  lines.push(`Range: ${summary.min} - ${summary.max}`);
  if (summary.average > 80) lines.push('High pressure detected');
  if (summary.average < 20) lines.push('Low utilization opportunity');
  return lines;
}

export interface NoShowsRow {
  organizationId: string;
  label: string;
  value: number;
  sampleSize: number;
}

export function buildNoShowsReport(rows: NoShowsRow[]): {
  total: number;
  average: number;
  max: number;
  min: number;
  top: NoShowsRow[];
} {
  if (!rows.length) {
    return { total: 0, average: 0, max: 0, min: 0, top: [] };
  }
  const values = rows.map((r) => r.value);
  const total = values.reduce((a, b) => a + b, 0);
  const average = total / values.length;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const top = [...rows].sort((a, b) => b.value - a.value).slice(0, 10);
  return { total, average, max, min, top };
}

export function normalizeNoShows(rows: NoShowsRow[]): NoShowsRow[] {
  return rows
    .filter((r) => r.organizationId && r.sampleSize >= 0)
    .map((r) => ({
      ...r,
      value: Number.isFinite(r.value) ? Math.max(0, r.value) : 0,
      label: r.label.trim(),
    }));
}

export function explainNoShows(summary: ReturnType<typeof buildNoShowsReport>): string[] {
  const lines: string[] = [];
  lines.push(`Samples aggregated: ${summary.top.length} top rows`);
  lines.push(`Average value: ${summary.average.toFixed(2)}`);
  lines.push(`Range: ${summary.min} - ${summary.max}`);
  if (summary.average > 80) lines.push('High pressure detected');
  if (summary.average < 20) lines.push('Low utilization opportunity');
  return lines;
}

export interface VisitorThroughputRow {
  organizationId: string;
  label: string;
  value: number;
  sampleSize: number;
}

export function buildVisitorThroughputReport(rows: VisitorThroughputRow[]): {
  total: number;
  average: number;
  max: number;
  min: number;
  top: VisitorThroughputRow[];
} {
  if (!rows.length) {
    return { total: 0, average: 0, max: 0, min: 0, top: [] };
  }
  const values = rows.map((r) => r.value);
  const total = values.reduce((a, b) => a + b, 0);
  const average = total / values.length;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const top = [...rows].sort((a, b) => b.value - a.value).slice(0, 10);
  return { total, average, max, min, top };
}

export function normalizeVisitorThroughput(rows: VisitorThroughputRow[]): VisitorThroughputRow[] {
  return rows
    .filter((r) => r.organizationId && r.sampleSize >= 0)
    .map((r) => ({
      ...r,
      value: Number.isFinite(r.value) ? Math.max(0, r.value) : 0,
      label: r.label.trim(),
    }));
}

export function explainVisitorThroughput(
  summary: ReturnType<typeof buildVisitorThroughputReport>,
): string[] {
  const lines: string[] = [];
  lines.push(`Samples aggregated: ${summary.top.length} top rows`);
  lines.push(`Average value: ${summary.average.toFixed(2)}`);
  lines.push(`Range: ${summary.min} - ${summary.max}`);
  if (summary.average > 80) lines.push('High pressure detected');
  if (summary.average < 20) lines.push('Low utilization opportunity');
  return lines;
}

export interface AmenityDemandRow {
  organizationId: string;
  label: string;
  value: number;
  sampleSize: number;
}

export function buildAmenityDemandReport(rows: AmenityDemandRow[]): {
  total: number;
  average: number;
  max: number;
  min: number;
  top: AmenityDemandRow[];
} {
  if (!rows.length) {
    return { total: 0, average: 0, max: 0, min: 0, top: [] };
  }
  const values = rows.map((r) => r.value);
  const total = values.reduce((a, b) => a + b, 0);
  const average = total / values.length;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const top = [...rows].sort((a, b) => b.value - a.value).slice(0, 10);
  return { total, average, max, min, top };
}

export function normalizeAmenityDemand(rows: AmenityDemandRow[]): AmenityDemandRow[] {
  return rows
    .filter((r) => r.organizationId && r.sampleSize >= 0)
    .map((r) => ({
      ...r,
      value: Number.isFinite(r.value) ? Math.max(0, r.value) : 0,
      label: r.label.trim(),
    }));
}

export function explainAmenityDemand(
  summary: ReturnType<typeof buildAmenityDemandReport>,
): string[] {
  const lines: string[] = [];
  lines.push(`Samples aggregated: ${summary.top.length} top rows`);
  lines.push(`Average value: ${summary.average.toFixed(2)}`);
  lines.push(`Range: ${summary.min} - ${summary.max}`);
  if (summary.average > 80) lines.push('High pressure detected');
  if (summary.average < 20) lines.push('Low utilization opportunity');
  return lines;
}

export interface DeskHeatmapRow {
  organizationId: string;
  label: string;
  value: number;
  sampleSize: number;
}

export function buildDeskHeatmapReport(rows: DeskHeatmapRow[]): {
  total: number;
  average: number;
  max: number;
  min: number;
  top: DeskHeatmapRow[];
} {
  if (!rows.length) {
    return { total: 0, average: 0, max: 0, min: 0, top: [] };
  }
  const values = rows.map((r) => r.value);
  const total = values.reduce((a, b) => a + b, 0);
  const average = total / values.length;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const top = [...rows].sort((a, b) => b.value - a.value).slice(0, 10);
  return { total, average, max, min, top };
}

export function normalizeDeskHeatmap(rows: DeskHeatmapRow[]): DeskHeatmapRow[] {
  return rows
    .filter((r) => r.organizationId && r.sampleSize >= 0)
    .map((r) => ({
      ...r,
      value: Number.isFinite(r.value) ? Math.max(0, r.value) : 0,
      label: r.label.trim(),
    }));
}

export function explainDeskHeatmap(summary: ReturnType<typeof buildDeskHeatmapReport>): string[] {
  const lines: string[] = [];
  lines.push(`Samples aggregated: ${summary.top.length} top rows`);
  lines.push(`Average value: ${summary.average.toFixed(2)}`);
  lines.push(`Range: ${summary.min} - ${summary.max}`);
  if (summary.average > 80) lines.push('High pressure detected');
  if (summary.average < 20) lines.push('Low utilization opportunity');
  return lines;
}

export interface MeetingLengthRow {
  organizationId: string;
  label: string;
  value: number;
  sampleSize: number;
}

export function buildMeetingLengthReport(rows: MeetingLengthRow[]): {
  total: number;
  average: number;
  max: number;
  min: number;
  top: MeetingLengthRow[];
} {
  if (!rows.length) {
    return { total: 0, average: 0, max: 0, min: 0, top: [] };
  }
  const values = rows.map((r) => r.value);
  const total = values.reduce((a, b) => a + b, 0);
  const average = total / values.length;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const top = [...rows].sort((a, b) => b.value - a.value).slice(0, 10);
  return { total, average, max, min, top };
}

export function normalizeMeetingLength(rows: MeetingLengthRow[]): MeetingLengthRow[] {
  return rows
    .filter((r) => r.organizationId && r.sampleSize >= 0)
    .map((r) => ({
      ...r,
      value: Number.isFinite(r.value) ? Math.max(0, r.value) : 0,
      label: r.label.trim(),
    }));
}

export function explainMeetingLength(
  summary: ReturnType<typeof buildMeetingLengthReport>,
): string[] {
  const lines: string[] = [];
  lines.push(`Samples aggregated: ${summary.top.length} top rows`);
  lines.push(`Average value: ${summary.average.toFixed(2)}`);
  lines.push(`Range: ${summary.min} - ${summary.max}`);
  if (summary.average > 80) lines.push('High pressure detected');
  if (summary.average < 20) lines.push('Low utilization opportunity');
  return lines;
}

export interface CancellationReasonsRow {
  organizationId: string;
  label: string;
  value: number;
  sampleSize: number;
}

export function buildCancellationReasonsReport(rows: CancellationReasonsRow[]): {
  total: number;
  average: number;
  max: number;
  min: number;
  top: CancellationReasonsRow[];
} {
  if (!rows.length) {
    return { total: 0, average: 0, max: 0, min: 0, top: [] };
  }
  const values = rows.map((r) => r.value);
  const total = values.reduce((a, b) => a + b, 0);
  const average = total / values.length;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const top = [...rows].sort((a, b) => b.value - a.value).slice(0, 10);
  return { total, average, max, min, top };
}

export function normalizeCancellationReasons(
  rows: CancellationReasonsRow[],
): CancellationReasonsRow[] {
  return rows
    .filter((r) => r.organizationId && r.sampleSize >= 0)
    .map((r) => ({
      ...r,
      value: Number.isFinite(r.value) ? Math.max(0, r.value) : 0,
      label: r.label.trim(),
    }));
}

export function explainCancellationReasons(
  summary: ReturnType<typeof buildCancellationReasonsReport>,
): string[] {
  const lines: string[] = [];
  lines.push(`Samples aggregated: ${summary.top.length} top rows`);
  lines.push(`Average value: ${summary.average.toFixed(2)}`);
  lines.push(`Range: ${summary.min} - ${summary.max}`);
  if (summary.average > 80) lines.push('High pressure detected');
  if (summary.average < 20) lines.push('Low utilization opportunity');
  return lines;
}

export interface CheckinComplianceRow {
  organizationId: string;
  label: string;
  value: number;
  sampleSize: number;
}

export function buildCheckinComplianceReport(rows: CheckinComplianceRow[]): {
  total: number;
  average: number;
  max: number;
  min: number;
  top: CheckinComplianceRow[];
} {
  if (!rows.length) {
    return { total: 0, average: 0, max: 0, min: 0, top: [] };
  }
  const values = rows.map((r) => r.value);
  const total = values.reduce((a, b) => a + b, 0);
  const average = total / values.length;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const top = [...rows].sort((a, b) => b.value - a.value).slice(0, 10);
  return { total, average, max, min, top };
}

export function normalizeCheckinCompliance(rows: CheckinComplianceRow[]): CheckinComplianceRow[] {
  return rows
    .filter((r) => r.organizationId && r.sampleSize >= 0)
    .map((r) => ({
      ...r,
      value: Number.isFinite(r.value) ? Math.max(0, r.value) : 0,
      label: r.label.trim(),
    }));
}

export function explainCheckinCompliance(
  summary: ReturnType<typeof buildCheckinComplianceReport>,
): string[] {
  const lines: string[] = [];
  lines.push(`Samples aggregated: ${summary.top.length} top rows`);
  lines.push(`Average value: ${summary.average.toFixed(2)}`);
  lines.push(`Range: ${summary.min} - ${summary.max}`);
  if (summary.average > 80) lines.push('High pressure detected');
  if (summary.average < 20) lines.push('Low utilization opportunity');
  return lines;
}

export interface PeakHoursRow {
  organizationId: string;
  label: string;
  value: number;
  sampleSize: number;
}

export function buildPeakHoursReport(rows: PeakHoursRow[]): {
  total: number;
  average: number;
  max: number;
  min: number;
  top: PeakHoursRow[];
} {
  if (!rows.length) {
    return { total: 0, average: 0, max: 0, min: 0, top: [] };
  }
  const values = rows.map((r) => r.value);
  const total = values.reduce((a, b) => a + b, 0);
  const average = total / values.length;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const top = [...rows].sort((a, b) => b.value - a.value).slice(0, 10);
  return { total, average, max, min, top };
}

export function normalizePeakHours(rows: PeakHoursRow[]): PeakHoursRow[] {
  return rows
    .filter((r) => r.organizationId && r.sampleSize >= 0)
    .map((r) => ({
      ...r,
      value: Number.isFinite(r.value) ? Math.max(0, r.value) : 0,
      label: r.label.trim(),
    }));
}

export function explainPeakHours(summary: ReturnType<typeof buildPeakHoursReport>): string[] {
  const lines: string[] = [];
  lines.push(`Samples aggregated: ${summary.top.length} top rows`);
  lines.push(`Average value: ${summary.average.toFixed(2)}`);
  lines.push(`Range: ${summary.min} - ${summary.max}`);
  if (summary.average > 80) lines.push('High pressure detected');
  if (summary.average < 20) lines.push('Low utilization opportunity');
  return lines;
}

export interface NeighborhoodMixRow {
  organizationId: string;
  label: string;
  value: number;
  sampleSize: number;
}

export function buildNeighborhoodMixReport(rows: NeighborhoodMixRow[]): {
  total: number;
  average: number;
  max: number;
  min: number;
  top: NeighborhoodMixRow[];
} {
  if (!rows.length) {
    return { total: 0, average: 0, max: 0, min: 0, top: [] };
  }
  const values = rows.map((r) => r.value);
  const total = values.reduce((a, b) => a + b, 0);
  const average = total / values.length;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const top = [...rows].sort((a, b) => b.value - a.value).slice(0, 10);
  return { total, average, max, min, top };
}

export function normalizeNeighborhoodMix(rows: NeighborhoodMixRow[]): NeighborhoodMixRow[] {
  return rows
    .filter((r) => r.organizationId && r.sampleSize >= 0)
    .map((r) => ({
      ...r,
      value: Number.isFinite(r.value) ? Math.max(0, r.value) : 0,
      label: r.label.trim(),
    }));
}

export function explainNeighborhoodMix(
  summary: ReturnType<typeof buildNeighborhoodMixReport>,
): string[] {
  const lines: string[] = [];
  lines.push(`Samples aggregated: ${summary.top.length} top rows`);
  lines.push(`Average value: ${summary.average.toFixed(2)}`);
  lines.push(`Range: ${summary.min} - ${summary.max}`);
  if (summary.average > 80) lines.push('High pressure detected');
  if (summary.average < 20) lines.push('Low utilization opportunity');
  return lines;
}

export interface TeamPresenceRow {
  organizationId: string;
  label: string;
  value: number;
  sampleSize: number;
}

export function buildTeamPresenceReport(rows: TeamPresenceRow[]): {
  total: number;
  average: number;
  max: number;
  min: number;
  top: TeamPresenceRow[];
} {
  if (!rows.length) {
    return { total: 0, average: 0, max: 0, min: 0, top: [] };
  }
  const values = rows.map((r) => r.value);
  const total = values.reduce((a, b) => a + b, 0);
  const average = total / values.length;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const top = [...rows].sort((a, b) => b.value - a.value).slice(0, 10);
  return { total, average, max, min, top };
}

export function normalizeTeamPresence(rows: TeamPresenceRow[]): TeamPresenceRow[] {
  return rows
    .filter((r) => r.organizationId && r.sampleSize >= 0)
    .map((r) => ({
      ...r,
      value: Number.isFinite(r.value) ? Math.max(0, r.value) : 0,
      label: r.label.trim(),
    }));
}

export function explainTeamPresence(summary: ReturnType<typeof buildTeamPresenceReport>): string[] {
  const lines: string[] = [];
  lines.push(`Samples aggregated: ${summary.top.length} top rows`);
  lines.push(`Average value: ${summary.average.toFixed(2)}`);
  lines.push(`Range: ${summary.min} - ${summary.max}`);
  if (summary.average > 80) lines.push('High pressure detected');
  if (summary.average < 20) lines.push('Low utilization opportunity');
  return lines;
}

export interface CostCentersRow {
  organizationId: string;
  label: string;
  value: number;
  sampleSize: number;
}

export function buildCostCentersReport(rows: CostCentersRow[]): {
  total: number;
  average: number;
  max: number;
  min: number;
  top: CostCentersRow[];
} {
  if (!rows.length) {
    return { total: 0, average: 0, max: 0, min: 0, top: [] };
  }
  const values = rows.map((r) => r.value);
  const total = values.reduce((a, b) => a + b, 0);
  const average = total / values.length;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const top = [...rows].sort((a, b) => b.value - a.value).slice(0, 10);
  return { total, average, max, min, top };
}

export function normalizeCostCenters(rows: CostCentersRow[]): CostCentersRow[] {
  return rows
    .filter((r) => r.organizationId && r.sampleSize >= 0)
    .map((r) => ({
      ...r,
      value: Number.isFinite(r.value) ? Math.max(0, r.value) : 0,
      label: r.label.trim(),
    }));
}

export function explainCostCenters(summary: ReturnType<typeof buildCostCentersReport>): string[] {
  const lines: string[] = [];
  lines.push(`Samples aggregated: ${summary.top.length} top rows`);
  lines.push(`Average value: ${summary.average.toFixed(2)}`);
  lines.push(`Range: ${summary.min} - ${summary.max}`);
  if (summary.average > 80) lines.push('High pressure detected');
  if (summary.average < 20) lines.push('Low utilization opportunity');
  return lines;
}

export interface BookingLeadTimeRow {
  organizationId: string;
  label: string;
  value: number;
  sampleSize: number;
}

export function buildBookingLeadTimeReport(rows: BookingLeadTimeRow[]): {
  total: number;
  average: number;
  max: number;
  min: number;
  top: BookingLeadTimeRow[];
} {
  if (!rows.length) {
    return { total: 0, average: 0, max: 0, min: 0, top: [] };
  }
  const values = rows.map((r) => r.value);
  const total = values.reduce((a, b) => a + b, 0);
  const average = total / values.length;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const top = [...rows].sort((a, b) => b.value - a.value).slice(0, 10);
  return { total, average, max, min, top };
}

export function normalizeBookingLeadTime(rows: BookingLeadTimeRow[]): BookingLeadTimeRow[] {
  return rows
    .filter((r) => r.organizationId && r.sampleSize >= 0)
    .map((r) => ({
      ...r,
      value: Number.isFinite(r.value) ? Math.max(0, r.value) : 0,
      label: r.label.trim(),
    }));
}

export function explainBookingLeadTime(
  summary: ReturnType<typeof buildBookingLeadTimeReport>,
): string[] {
  const lines: string[] = [];
  lines.push(`Samples aggregated: ${summary.top.length} top rows`);
  lines.push(`Average value: ${summary.average.toFixed(2)}`);
  lines.push(`Range: ${summary.min} - ${summary.max}`);
  if (summary.average > 80) lines.push('High pressure detected');
  if (summary.average < 20) lines.push('Low utilization opportunity');
  return lines;
}

export interface ResourceIdleTimeRow {
  organizationId: string;
  label: string;
  value: number;
  sampleSize: number;
}

export function buildResourceIdleTimeReport(rows: ResourceIdleTimeRow[]): {
  total: number;
  average: number;
  max: number;
  min: number;
  top: ResourceIdleTimeRow[];
} {
  if (!rows.length) {
    return { total: 0, average: 0, max: 0, min: 0, top: [] };
  }
  const values = rows.map((r) => r.value);
  const total = values.reduce((a, b) => a + b, 0);
  const average = total / values.length;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const top = [...rows].sort((a, b) => b.value - a.value).slice(0, 10);
  return { total, average, max, min, top };
}

export function normalizeResourceIdleTime(rows: ResourceIdleTimeRow[]): ResourceIdleTimeRow[] {
  return rows
    .filter((r) => r.organizationId && r.sampleSize >= 0)
    .map((r) => ({
      ...r,
      value: Number.isFinite(r.value) ? Math.max(0, r.value) : 0,
      label: r.label.trim(),
    }));
}

export function explainResourceIdleTime(
  summary: ReturnType<typeof buildResourceIdleTimeReport>,
): string[] {
  const lines: string[] = [];
  lines.push(`Samples aggregated: ${summary.top.length} top rows`);
  lines.push(`Average value: ${summary.average.toFixed(2)}`);
  lines.push(`Range: ${summary.min} - ${summary.max}`);
  if (summary.average > 80) lines.push('High pressure detected');
  if (summary.average < 20) lines.push('Low utilization opportunity');
  return lines;
}

export interface OverbookingRiskRow {
  organizationId: string;
  label: string;
  value: number;
  sampleSize: number;
}

export function buildOverbookingRiskReport(rows: OverbookingRiskRow[]): {
  total: number;
  average: number;
  max: number;
  min: number;
  top: OverbookingRiskRow[];
} {
  if (!rows.length) {
    return { total: 0, average: 0, max: 0, min: 0, top: [] };
  }
  const values = rows.map((r) => r.value);
  const total = values.reduce((a, b) => a + b, 0);
  const average = total / values.length;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const top = [...rows].sort((a, b) => b.value - a.value).slice(0, 10);
  return { total, average, max, min, top };
}

export function normalizeOverbookingRisk(rows: OverbookingRiskRow[]): OverbookingRiskRow[] {
  return rows
    .filter((r) => r.organizationId && r.sampleSize >= 0)
    .map((r) => ({
      ...r,
      value: Number.isFinite(r.value) ? Math.max(0, r.value) : 0,
      label: r.label.trim(),
    }));
}

export function explainOverbookingRisk(
  summary: ReturnType<typeof buildOverbookingRiskReport>,
): string[] {
  const lines: string[] = [];
  lines.push(`Samples aggregated: ${summary.top.length} top rows`);
  lines.push(`Average value: ${summary.average.toFixed(2)}`);
  lines.push(`Range: ${summary.min} - ${summary.max}`);
  if (summary.average > 80) lines.push('High pressure detected');
  if (summary.average < 20) lines.push('Low utilization opportunity');
  return lines;
}
