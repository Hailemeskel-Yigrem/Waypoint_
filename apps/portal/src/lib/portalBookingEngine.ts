import {
  OperationalRuleEngine,
  type OperationalRuleInput,
  type OperationalRuleResult,
} from '@waypoint/shared';

export type PortalBookingEngineInput = OperationalRuleInput;
export type PortalBookingEngineResult = OperationalRuleResult;

export class PortalBookingEngine extends OperationalRuleEngine {
  constructor() {
    super({ codePrefix: 'PortalBook', ruleCount: 35 });
  }
}
