import {
  OperationalRuleEngine,
  type OperationalRuleInput,
  type OperationalRuleResult,
} from '../operationalRuleEngine.js';

export type SharedGuardEngineInput = OperationalRuleInput;
export type SharedGuardEngineResult = OperationalRuleResult;

export class SharedGuardEngine extends OperationalRuleEngine {
  constructor() {
    super({ codePrefix: 'SharedGuard', ruleCount: 30 });
  }
}
