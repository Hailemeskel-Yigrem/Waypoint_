import {
  OperationalRuleEngine,
  type OperationalRuleInput,
  type OperationalRuleResult,
} from '@waypoint/shared';

export type AuditPipelineEngineInput = OperationalRuleInput;
export type AuditPipelineEngineResult = OperationalRuleResult;

export class AuditPipelineEngine extends OperationalRuleEngine {
  constructor() {
    super({ codePrefix: 'AuditPipe', ruleCount: 40 });
  }
}
