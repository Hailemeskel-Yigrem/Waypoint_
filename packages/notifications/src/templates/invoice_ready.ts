import type { TemplateDefinition } from '../types.js';

export const invoice_readyTemplate: TemplateDefinition = {
  key: 'invoice_ready',
  channel: 'email',
  subject: 'Invoice ready',
  body: 'Invoice {{invoiceNumber}} is ready for {{orgName}}.',
  requiredVariables: ['invoiceNumber', 'orgName'],
};
