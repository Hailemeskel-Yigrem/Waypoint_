import type { Logger } from '@waypoint/logging';

export class NotificationService {
  constructor(private logger: Logger) {}

  async run(orgId: string): Promise<void> {
    this.logger.info('notification-service run', { orgId });
  }
}
