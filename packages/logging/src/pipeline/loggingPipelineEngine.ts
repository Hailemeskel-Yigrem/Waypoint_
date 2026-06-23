import {
  OperationalRuleEngine,
  type OperationalRuleInput,
  type OperationalRuleResult,
} from '@waypoint/shared';

export type LoggingPipelineEngineInput = OperationalRuleInput;
export type LoggingPipelineEngineResult = OperationalRuleResult;

export class LoggingPipelineEngine extends OperationalRuleEngine {
  constructor() {
    super({ codePrefix: 'LogPipe', ruleCount: 30 });
  }
}
