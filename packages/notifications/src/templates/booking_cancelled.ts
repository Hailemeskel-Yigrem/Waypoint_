import type { TemplateDefinition } from '../types.js';

export const booking_cancelledTemplate: TemplateDefinition = {
  key: 'booking_cancelled',
  channel: 'email',
  subject: 'Booking cancelled',
  body: 'Your booking {{bookingId}} was cancelled.',
  requiredVariables: ['bookingId'],
};
