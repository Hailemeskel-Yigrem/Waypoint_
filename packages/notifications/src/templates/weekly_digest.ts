import type { TemplateDefinition } from '../types.js';

export const weekly_digestTemplate: TemplateDefinition = {
  key: 'weekly_digest',
  channel: 'email',
  subject: 'Weekly workplace digest',
  body: 'This week: {{bookings}} bookings, {{visitors}} visitors, {{utilization}}% utilization.',
  requiredVariables: ['bookings', 'visitors', 'utilization'],
};
