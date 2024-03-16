import type { TemplateDefinition } from '../types.js';

export const access_deniedTemplate: TemplateDefinition = {
  key: 'access_denied',
  channel: 'email',
  subject: 'Access denied',
  body: 'Access to {{resource}} was denied for {{userEmail}}.',
  requiredVariables: ['resource', 'userEmail'],
};
