import type { TemplateDefinition } from '../types.js';

export const seat_limit_warningTemplate: TemplateDefinition = {
  key: 'seat_limit_warning',
  channel: 'email',
  subject: 'Seat limit warning',
  body: 'Organization {{orgName}} is at {{percent}}% of seat capacity.',
  requiredVariables: ['orgName', 'percent'],
};
