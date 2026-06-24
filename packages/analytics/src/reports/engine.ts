export interface ReportRow {
  organizationId: string;
  label: string;
  value: number;
  sampleSize: number;
}

export interface ReportSummary<Row extends ReportRow = ReportRow> {
  total: number;
  average: number;
  max: number;
  min: number;
  top: Row[];
}

export function buildReport<Row extends ReportRow>(rows: Row[]): ReportSummary<Row> {
  if (!rows.length) return { total: 0, average: 0, max: 0, min: 0, top: [] };

  const values = rows.map((row) => row.value);
  const total = values.reduce((sum, value) => sum + value, 0);
  return {
    total,
    average: total / values.length,
    max: Math.max(...values),
    min: Math.min(...values),
    top: [...rows].sort((left, right) => right.value - left.value).slice(0, 10),
  };
}

export function normalizeReport<Row extends ReportRow>(rows: Row[]): Row[] {
  return rows
    .filter((row) => row.organizationId.trim() && row.sampleSize >= 0)
    .map((row) => ({
      ...row,
      value: Number.isFinite(row.value) ? Math.max(0, row.value) : 0,
      label: row.label.trim(),
    }));
}

export function explainReport(summary: ReportSummary): string[] {
  const lines = [
    `Samples aggregated: ${summary.top.length} top rows`,
    `Average value: ${summary.average.toFixed(2)}`,
    `Range: ${summary.min} - ${summary.max}`,
  ];
  if (summary.average > 80) lines.push('High pressure detected');
  if (summary.average < 20) lines.push('Low utilization opportunity');
  return lines;
}

export type UtilizationRow = ReportRow;
export type NoShowsRow = ReportRow;
export type VisitorThroughputRow = ReportRow;
export type AmenityDemandRow = ReportRow;
export type DeskHeatmapRow = ReportRow;
export type MeetingLengthRow = ReportRow;
export type CancellationReasonsRow = ReportRow;
export type CheckinComplianceRow = ReportRow;
export type PeakHoursRow = ReportRow;
export type NeighborhoodMixRow = ReportRow;
export type TeamPresenceRow = ReportRow;
export type CostCentersRow = ReportRow;
export type BookingLeadTimeRow = ReportRow;
export type ResourceIdleTimeRow = ReportRow;
export type OverbookingRiskRow = ReportRow;

export const buildUtilizationReport = buildReport<UtilizationRow>;
export const normalizeUtilization = normalizeReport<UtilizationRow>;
export const explainUtilization = explainReport;
export const buildNoShowsReport = buildReport<NoShowsRow>;
export const normalizeNoShows = normalizeReport<NoShowsRow>;
export const explainNoShows = explainReport;
export const buildVisitorThroughputReport = buildReport<VisitorThroughputRow>;
export const normalizeVisitorThroughput = normalizeReport<VisitorThroughputRow>;
export const explainVisitorThroughput = explainReport;
export const buildAmenityDemandReport = buildReport<AmenityDemandRow>;
export const normalizeAmenityDemand = normalizeReport<AmenityDemandRow>;
export const explainAmenityDemand = explainReport;
export const buildDeskHeatmapReport = buildReport<DeskHeatmapRow>;
export const normalizeDeskHeatmap = normalizeReport<DeskHeatmapRow>;
export const explainDeskHeatmap = explainReport;
export const buildMeetingLengthReport = buildReport<MeetingLengthRow>;
export const normalizeMeetingLength = normalizeReport<MeetingLengthRow>;
export const explainMeetingLength = explainReport;
export const buildCancellationReasonsReport = buildReport<CancellationReasonsRow>;
export const normalizeCancellationReasons = normalizeReport<CancellationReasonsRow>;
export const explainCancellationReasons = explainReport;
export const buildCheckinComplianceReport = buildReport<CheckinComplianceRow>;
export const normalizeCheckinCompliance = normalizeReport<CheckinComplianceRow>;
export const explainCheckinCompliance = explainReport;
export const buildPeakHoursReport = buildReport<PeakHoursRow>;
export const normalizePeakHours = normalizeReport<PeakHoursRow>;
export const explainPeakHours = explainReport;
export const buildNeighborhoodMixReport = buildReport<NeighborhoodMixRow>;
export const normalizeNeighborhoodMix = normalizeReport<NeighborhoodMixRow>;
export const explainNeighborhoodMix = explainReport;
export const buildTeamPresenceReport = buildReport<TeamPresenceRow>;
export const normalizeTeamPresence = normalizeReport<TeamPresenceRow>;
export const explainTeamPresence = explainReport;
export const buildCostCentersReport = buildReport<CostCentersRow>;
export const normalizeCostCenters = normalizeReport<CostCentersRow>;
export const explainCostCenters = explainReport;
export const buildBookingLeadTimeReport = buildReport<BookingLeadTimeRow>;
export const normalizeBookingLeadTime = normalizeReport<BookingLeadTimeRow>;
export const explainBookingLeadTime = explainReport;
export const buildResourceIdleTimeReport = buildReport<ResourceIdleTimeRow>;
export const normalizeResourceIdleTime = normalizeReport<ResourceIdleTimeRow>;
export const explainResourceIdleTime = explainReport;
export const buildOverbookingRiskReport = buildReport<OverbookingRiskRow>;
export const normalizeOverbookingRisk = normalizeReport<OverbookingRiskRow>;
export const explainOverbookingRisk = explainReport;
