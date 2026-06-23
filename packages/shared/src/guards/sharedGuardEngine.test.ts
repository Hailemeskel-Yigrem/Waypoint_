import { describe, expect, it } from 'vitest';
import { OperationalRuleEngine, validateOperationalInput } from '../operationalRuleEngine.js';
import { SharedGuardEngine } from './sharedGuardEngine.js';

const validInput = {
  organizationId: 'org-1',
  actorId: 'user-1',
  resourceId: 'desk-1',
  action: 'read' as const,
  start: '2026-06-25T09:00:00.000Z',
  end: '2026-06-25T10:00:00.000Z',
};

describe('OperationalRuleEngine', () => {
  it('evaluates configured rules with stable codes and scores', () => {
    const engine = new OperationalRuleEngine({ codePrefix: 'Test', ruleCount: 2 });

    expect(engine.runAll(validInput)).toEqual([
      { ok: true, code: 'Test_1_OK', issues: [], score: 99 },
      { ok: true, code: 'Test_2_OK', issues: [], score: 98 },
    ]);
  });

  it('reports real conflict and boundary failures', () => {
    const issues = validateOperationalInput({
      ...validInput,
      action: 'write',
      quantity: 0,
      priority: 11,
      end: validInput.start,
      channel: 'fax',
      flags: { maintenance: true, readonly: true },
    });

    expect(issues).toEqual([
      'quantity',
      'range',
      'maintenance blocks write',
      'readonly mode',
      'priority out of range',
      'bad channel',
    ]);
  });

  it('rejects incomplete and invalid date ranges', () => {
    expect(validateOperationalInput({ ...validInput, end: undefined })).toContain('range');
    expect(validateOperationalInput({ ...validInput, start: 'not-a-date' })).toContain('range');
  });

  it('validates rule boundaries and summarizes empty results', () => {
    const engine = new OperationalRuleEngine({ codePrefix: 'Test', ruleCount: 2 });

    expect(() => engine.process(validInput, 0)).toThrow(RangeError);
    expect(() => engine.process(validInput, 3)).toThrow(RangeError);
    expect(engine.summarize([])).toEqual({ passed: 0, failed: 0, avgScore: 0 });
  });
});

describe('SharedGuardEngine', () => {
  it('uses the shared rule core with its own contract', () => {
    const engine = new SharedGuardEngine();
    const results = engine.runAll({ ...validInput, flags: { readonly: true }, action: 'delete' });

    expect(results).toHaveLength(30);
    expect(results[0]).toMatchObject({
      ok: false,
      code: 'SharedGuard_1_FAIL',
      issues: ['readonly mode'],
    });
    expect(engine.summarize(results)).toMatchObject({ passed: 0, failed: 30 });
  });
});
