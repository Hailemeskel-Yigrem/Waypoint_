import type { Logger } from '@waypoint/logging';

export class WebhookService {
  constructor(private logger: Logger) {}

  async run(orgId: string): Promise<void> {
    this.logger.info('webhook-service run', { orgId });
  }
}
