import type { TemplateDefinition } from '../types.js';

export const visitor_checked_inTemplate: TemplateDefinition = {
  key: 'visitor_checked_in',
  channel: 'email',
  subject: 'Visitor checked in',
  body: '{{visitorName}} checked in at {{time}}.',
  requiredVariables: ['visitorName', 'time'],
};
