import type { TemplateDefinition } from '../types.js';

export const booking_reminderTemplate: TemplateDefinition = {
  key: 'booking_reminder',
  channel: 'email',
  subject: 'Booking reminder',
  body: 'Reminder: {{spaceName}} starts at {{startTime}}.',
  requiredVariables: ['spaceName', 'startTime'],
};
