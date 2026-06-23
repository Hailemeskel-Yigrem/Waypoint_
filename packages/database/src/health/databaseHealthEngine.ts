import {
  OperationalRuleEngine,
  type OperationalRuleInput,
  type OperationalRuleResult,
} from '@waypoint/shared';

export type DatabaseHealthEngineInput = OperationalRuleInput;
export type DatabaseHealthEngineResult = OperationalRuleResult;

export class DatabaseHealthEngine extends OperationalRuleEngine {
  constructor() {
    super({ codePrefix: 'DbHealth', ruleCount: 30 });
  }
}
