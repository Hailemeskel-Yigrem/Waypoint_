import type { TemplateDefinition } from '../types.js';

export const booking_confirmedTemplate: TemplateDefinition = {
  key: 'booking_confirmed',
  channel: 'email',
  subject: 'Booking confirmed',
  body: 'Your booking for {{spaceName}} on {{date}} is confirmed.',
  requiredVariables: ['spaceName', 'date'],
};
