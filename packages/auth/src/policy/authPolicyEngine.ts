import {
  OperationalRuleEngine,
  type OperationalRuleInput,
  type OperationalRuleResult,
} from '@waypoint/shared';

export type AuthPolicyEngineInput = OperationalRuleInput;
export type AuthPolicyEngineResult = OperationalRuleResult;

export class AuthPolicyEngine extends OperationalRuleEngine {
  constructor() {
    super({ codePrefix: 'AuthPol', ruleCount: 40 });
  }
}
