import {
  OperationalRuleEngine,
  type OperationalRuleInput,
  type OperationalRuleResult,
} from '@waypoint/shared';

export type ReportPipelineEngineInput = OperationalRuleInput;
export type ReportPipelineEngineResult = OperationalRuleResult;

export class ReportPipelineEngine extends OperationalRuleEngine {
  constructor() {
    super({ codePrefix: 'ReportPipe', ruleCount: 40 });
  }
}
