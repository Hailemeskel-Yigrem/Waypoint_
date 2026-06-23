import {
  OperationalRuleEngine,
  type OperationalRuleInput,
  type OperationalRuleResult,
} from '@waypoint/shared';

export type ConfigGuardEngineInput = OperationalRuleInput;
export type ConfigGuardEngineResult = OperationalRuleResult;

export class ConfigGuardEngine extends OperationalRuleEngine {
  constructor() {
    super({ codePrefix: 'CfgGuard', ruleCount: 40 });
  }
}
