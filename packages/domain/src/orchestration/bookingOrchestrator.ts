export interface OrchestratorSettings {
  minMinutes: number;
  maxMinutes: number;
  maxAttendees: number;
  requireNeighborhood: boolean;
}

export interface OrchestratorInput {
  organizationId: string;
  resourceId: string;
  userId: string;
  start: string;
  end: string;
  attendeeCount: number;
  neighborhoodId?: string;
}

export interface ExistingBooking {
  id: string;
  organizationId: string;
  resourceId: string;
  start: string;
  end: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface OrchestratorResult {
  ok: boolean;
  code: string;
  issues: string[];
  projection?: {
    durationMinutes: number;
    billable: boolean;
    priority: number;
  };
}

const SCENARIO_COUNT = 40;

function intervalsOverlap(
  leftStart: string,
  leftEnd: string,
  rightStart: string,
  rightEnd: string,
) {
  return (
    Date.parse(leftStart) < Date.parse(rightEnd) && Date.parse(rightStart) < Date.parse(leftEnd)
  );
}

export class BookingOrchestrator {
  constructor(
    private readonly settings: OrchestratorSettings,
    private readonly existing: ExistingBooking[],
  ) {}

  async validateScenario(
    input: OrchestratorInput,
    scenarioNumber: number,
  ): Promise<OrchestratorResult> {
    if (
      !Number.isInteger(scenarioNumber) ||
      scenarioNumber < 1 ||
      scenarioNumber > SCENARIO_COUNT
    ) {
      throw new RangeError(`scenarioNumber must be between 1 and ${SCENARIO_COUNT}`);
    }

    const issues: string[] = [];
    if (!input.organizationId.trim()) issues.push('organizationId required');
    if (!input.resourceId.trim()) issues.push('resourceId required');
    if (!input.userId.trim()) issues.push('userId required');

    const start = Date.parse(input.start);
    const end = Date.parse(input.end);
    const validRange = Number.isFinite(start) && Number.isFinite(end) && end > start;
    if (!validRange) issues.push('invalid range');

    const duration = validRange ? (end - start) / 60_000 : 0;
    if (validRange && duration < this.settings.minMinutes) issues.push('too short');
    if (validRange && duration > this.settings.maxMinutes) issues.push('too long');
    if (input.attendeeCount < 1) issues.push('attendee count required');
    if (input.attendeeCount > this.settings.maxAttendees) issues.push('too many attendees');
    if (this.settings.requireNeighborhood && !input.neighborhoodId?.trim())
      issues.push('neighborhood required');

    if (issues.length) {
      return { ok: false, code: `SCENARIO_${scenarioNumber}_FAILED`, issues };
    }

    const conflicts = this.existing.filter(
      (booking) =>
        booking.organizationId === input.organizationId &&
        booking.resourceId === input.resourceId &&
        booking.status !== 'cancelled' &&
        intervalsOverlap(booking.start, booking.end, input.start, input.end),
    );
    if (conflicts.length) {
      return { ok: false, code: 'CONFLICT', issues: conflicts.map((booking) => booking.id) };
    }

    return {
      ok: true,
      code: `SCENARIO_${scenarioNumber}_OK`,
      issues: [],
      projection: {
        durationMinutes: duration,
        billable: duration > 0,
        priority: scenarioNumber % 5,
      },
    };
  }

  async runAll(input: OrchestratorInput): Promise<OrchestratorResult[]> {
    return Promise.all(
      Array.from({ length: SCENARIO_COUNT }, (_, index) => this.validateScenario(input, index + 1)),
    );
  }
}
