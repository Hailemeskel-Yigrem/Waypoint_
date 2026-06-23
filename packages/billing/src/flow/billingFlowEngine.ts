import {
  OperationalRuleEngine,
  type OperationalRuleInput,
  type OperationalRuleResult,
} from '@waypoint/shared';

export type BillingFlowEngineInput = OperationalRuleInput;
export type BillingFlowEngineResult = OperationalRuleResult;

export class BillingFlowEngine extends OperationalRuleEngine {
  constructor() {
    super({ codePrefix: 'Bill', ruleCount: 35 });
  }
}
