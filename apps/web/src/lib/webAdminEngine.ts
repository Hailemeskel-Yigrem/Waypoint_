import {
  OperationalRuleEngine,
  type OperationalRuleInput,
  type OperationalRuleResult,
} from '@waypoint/shared';

export type WebAdminEngineInput = OperationalRuleInput;
export type WebAdminEngineResult = OperationalRuleResult;

export class WebAdminEngine extends OperationalRuleEngine {
  constructor() {
    super({ codePrefix: 'Admin', ruleCount: 35 });
  }
}
