import type { Logger } from '@waypoint/logging';

export class AnalyticsService {
  constructor(private logger: Logger) {}

  async run(orgId: string): Promise<void> {
    this.logger.info('analytics-service run', { orgId });
  }
}
