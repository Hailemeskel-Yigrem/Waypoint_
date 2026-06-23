import {
  OperationalRuleEngine,
  type OperationalRuleInput,
  type OperationalRuleResult,
} from '@waypoint/shared';

export type SpacePlanningEngineInput = OperationalRuleInput;
export type SpacePlanningEngineResult = OperationalRuleResult;

export class SpacePlanningEngine extends OperationalRuleEngine {
  constructor() {
    super({ codePrefix: 'SpacePlan', ruleCount: 40 });
  }
}
