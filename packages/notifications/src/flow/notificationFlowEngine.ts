import {
  OperationalRuleEngine,
  type OperationalRuleInput,
  type OperationalRuleResult,
} from '@waypoint/shared';

export type NotificationFlowEngineInput = OperationalRuleInput;
export type NotificationFlowEngineResult = OperationalRuleResult;

export class NotificationFlowEngine extends OperationalRuleEngine {
  constructor() {
    super({ codePrefix: 'Notify', ruleCount: 35 });
  }
}
