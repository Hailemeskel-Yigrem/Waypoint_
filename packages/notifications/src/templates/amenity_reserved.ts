import type { TemplateDefinition } from '../types.js';

export const amenity_reservedTemplate: TemplateDefinition = {
  key: 'amenity_reserved',
  channel: 'email',
  subject: 'Amenity reserved',
  body: '{{amenityName}} reserved for {{date}}.',
  requiredVariables: ['amenityName', 'date'],
};
