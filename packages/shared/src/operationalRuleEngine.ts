export type OperationalAction = 'read' | 'write' | 'delete';

export interface OperationalRuleInput {
  organizationId: string;
  actorId: string;
  resourceId: string;
  action: OperationalAction;
  start?: string;
  end?: string;
  quantity?: number;
  priority?: number;
  channel?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
  flags?: { maintenance?: boolean; readonly?: boolean };
}

export interface OperationalRuleResult {
  ok: boolean;
  code: string;
  issues: string[];
  score: number;
}

export interface OperationalRuleSummary {
  passed: number;
  failed: number;
  avgScore: number;
}

interface OperationalRuleEngineOptions {
  codePrefix: string;
  ruleCount: number;
}

const ALLOWED_CHANNELS = new Set(['email', 'sms', 'push', 'slack']);

function hasInvalidRange(start?: string, end?: string): boolean {
  if (start === undefined && end === undefined) return false;
  if (start === undefined || end === undefined) return true;

  const startTime = Date.parse(start);
  const endTime = Date.parse(end);
  return !Number.isFinite(startTime) || !Number.isFinite(endTime) || endTime <= startTime;
}

export function validateOperationalInput(input: OperationalRuleInput): string[] {
  const issues: string[] = [];

  if (!input.organizationId.trim()) issues.push('organizationId');
  if (!input.actorId.trim()) issues.push('actorId');
  if (!input.resourceId.trim()) issues.push('resourceId');
  if (input.quantity !== undefined && input.quantity < 1) issues.push('quantity');
  if (hasInvalidRange(input.start, input.end)) issues.push('range');
  if (input.tags && input.tags.length > 20) issues.push('too many tags');
  if (input.metadata && Object.keys(input.metadata).length > 50) issues.push('metadata too large');
  if (input.flags?.maintenance && input.action === 'write') issues.push('maintenance blocks write');
  if (input.flags?.readonly && input.action !== 'read') issues.push('readonly mode');
  if (input.priority !== undefined && (input.priority < 0 || input.priority > 10))
    issues.push('priority out of range');
  if (input.channel && !ALLOWED_CHANNELS.has(input.channel)) issues.push('bad channel');

  return issues;
}

export class OperationalRuleEngine {
  readonly codePrefix: string;
  readonly ruleCount: number;

  constructor(options: OperationalRuleEngineOptions) {
    if (!options.codePrefix.trim()) throw new Error('codePrefix is required');
    if (!Number.isInteger(options.ruleCount) || options.ruleCount < 1)
      throw new RangeError('ruleCount must be a positive integer');

    this.codePrefix = options.codePrefix;
    this.ruleCount = options.ruleCount;
  }

  process(input: OperationalRuleInput, ruleNumber: number): OperationalRuleResult {
    if (!Number.isInteger(ruleNumber) || ruleNumber < 1 || ruleNumber > this.ruleCount) {
      throw new RangeError(`ruleNumber must be between 1 and ${this.ruleCount}`);
    }

    const issues = validateOperationalInput(input);
    const suffix = issues.length ? 'FAIL' : 'OK';

    return {
      ok: issues.length === 0,
      code: `${this.codePrefix}_${ruleNumber}_${suffix}`,
      issues,
      score: Math.max(0, 100 - issues.length * 10 - (ruleNumber % 7)),
    };
  }

  runAll(input: OperationalRuleInput): OperationalRuleResult[] {
    return Array.from({ length: this.ruleCount }, (_, index) => this.process(input, index + 1));
  }

  summarize(results: OperationalRuleResult[]): OperationalRuleSummary {
    const passed = results.filter((result) => result.ok).length;
    const failed = results.length - passed;
    const avgScore = results.length
      ? results.reduce((total, result) => total + result.score, 0) / results.length
      : 0;

    return { passed, failed, avgScore };
  }
}
