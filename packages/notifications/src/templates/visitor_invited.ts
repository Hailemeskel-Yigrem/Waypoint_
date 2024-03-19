import type { TemplateDefinition } from '../types.js';

export const visitor_invitedTemplate: TemplateDefinition = {
  key: 'visitor_invited',
  channel: 'email',
  subject: 'Visitor invited',
  body: '{{visitorName}} is invited to visit on {{date}}.',
  requiredVariables: ['visitorName', 'date'],
};
