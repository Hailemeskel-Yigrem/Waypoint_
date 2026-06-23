import {
  OperationalRuleEngine,
  type OperationalRuleInput,
  type OperationalRuleResult,
} from '@waypoint/shared';

export type IntegrationFlowEngineInput = OperationalRuleInput;
export type IntegrationFlowEngineResult = OperationalRuleResult;

export class IntegrationFlowEngine extends OperationalRuleEngine {
  constructor() {
    super({ codePrefix: 'Integrate', ruleCount: 35 });
  }
}
