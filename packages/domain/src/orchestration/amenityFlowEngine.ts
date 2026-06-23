import {
  OperationalRuleEngine,
  type OperationalRuleInput,
  type OperationalRuleResult,
} from '@waypoint/shared';

export type AmenityFlowEngineInput = OperationalRuleInput;
export type AmenityFlowEngineResult = OperationalRuleResult;

export class AmenityFlowEngine extends OperationalRuleEngine {
  constructor() {
    super({ codePrefix: 'Amenity', ruleCount: 35 });
  }
}
