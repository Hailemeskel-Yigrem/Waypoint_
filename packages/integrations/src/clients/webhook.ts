import { createHmac } from 'node:crypto';
import { requestJson, type HttpTransport } from '../http.js';

/** signed outbound webhooks */
export interface GenericWebhookConfig {
  baseUrl: string;
  apiKey: string;
  timeoutMs?: number;
}

export class GenericWebhookClient {
  constructor(
    private readonly config: GenericWebhookConfig,
    private readonly transport: HttpTransport,
  ) {}

  private headers(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': 'waypoint-integrations/0.1',
    };
  }

  async ping(): Promise<boolean> {
    await requestJson(this.transport, {
      method: 'GET',
      url: `${this.config.baseUrl}/health`,
      headers: this.headers(),
      timeoutMs: this.config.timeoutMs ?? 5000,
    });
    return true;
  }

  async sendEvent(eventType: string, payload: Record<string, unknown>): Promise<void> {
    if (!eventType.trim()) throw new Error('eventType is required');
    await requestJson(this.transport, {
      method: 'POST',
      url: `${this.config.baseUrl}/events`,
      headers: this.headers(),
      body: { eventType, payload, source: 'waypoint' },
      timeoutMs: this.config.timeoutMs ?? 10000,
    });
  }

  signPayload(payload: string, secret: string): string {
    return createHmac('sha256', secret).update(payload).digest('hex');
  }
}
