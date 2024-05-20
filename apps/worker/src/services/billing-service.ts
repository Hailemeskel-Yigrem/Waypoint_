import type { Logger } from '@waypoint/logging';

export class BillingService {
  constructor(private logger: Logger) {}

  async run(orgId: string): Promise<void> {
    this.logger.info('billing-service run', { orgId });
  }
}
