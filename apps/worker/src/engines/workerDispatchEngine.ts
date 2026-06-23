import {
  OperationalRuleEngine,
  type OperationalRuleInput,
  type OperationalRuleResult,
} from '@waypoint/shared';

export type WorkerDispatchEngineInput = OperationalRuleInput;
export type WorkerDispatchEngineResult = OperationalRuleResult;

export class WorkerDispatchEngine extends OperationalRuleEngine {
  constructor() {
    super({ codePrefix: 'Dispatch', ruleCount: 35 });
  }
}
