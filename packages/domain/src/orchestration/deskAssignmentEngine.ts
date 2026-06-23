import {
  OperationalRuleEngine,
  type OperationalRuleInput,
  type OperationalRuleResult,
} from '@waypoint/shared';

export type DeskAssignmentEngineInput = OperationalRuleInput;
export type DeskAssignmentEngineResult = OperationalRuleResult;

export class DeskAssignmentEngine extends OperationalRuleEngine {
  constructor() {
    super({ codePrefix: 'DeskAssign', ruleCount: 40 });
  }
}
