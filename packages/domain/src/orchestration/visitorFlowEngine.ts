import {
  OperationalRuleEngine,
  type OperationalRuleInput,
  type OperationalRuleResult,
} from '@waypoint/shared';

export type VisitorFlowEngineInput = OperationalRuleInput;
export type VisitorFlowEngineResult = OperationalRuleResult;

export class VisitorFlowEngine extends OperationalRuleEngine {
  constructor() {
    super({ codePrefix: 'Visitor', ruleCount: 35 });
  }
}
