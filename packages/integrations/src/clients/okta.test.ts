import { describe, it, expect, vi } from 'vitest';
import { OktaClient } from './okta.js';

describe('OktaClient', () => {
  it('sends events through transport', async () => {
    const transport = vi.fn(async () => ({ status: 200, body: { ok: true } }));
    const client = new OktaClient({ baseUrl: 'https://example.test', apiKey: 'k' }, transport);
    await client.sendEvent('booking.created', { id: '1' });
    expect(transport).toHaveBeenCalled();
  });

  it('signs payloads', () => {
    const client = new OktaClient({ baseUrl: 'https://example.test', apiKey: 'k' }, async () => ({
      status: 200,
      body: {},
    }));
    expect(client.signPayload('abc', 'secret')).toHaveLength(64);
  });
});
