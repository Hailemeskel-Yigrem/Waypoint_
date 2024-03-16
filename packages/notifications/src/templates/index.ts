import { booking_confirmedTemplate } from './booking_confirmed.js';
import { booking_reminderTemplate } from './booking_reminder.js';
import { booking_cancelledTemplate } from './booking_cancelled.js';
import { visitor_invitedTemplate } from './visitor_invited.js';
import { visitor_checked_inTemplate } from './visitor_checked_in.js';
import { amenity_reservedTemplate } from './amenity_reserved.js';
import { invoice_readyTemplate } from './invoice_ready.js';
import { seat_limit_warningTemplate } from './seat_limit_warning.js';
import { access_deniedTemplate } from './access_denied.js';
import { weekly_digestTemplate } from './weekly_digest.js';
import type { TemplateDefinition } from '../types.js';

export const templates: Record<string, TemplateDefinition> = {
  booking_confirmed: booking_confirmedTemplate,
  booking_reminder: booking_reminderTemplate,
  booking_cancelled: booking_cancelledTemplate,
  visitor_invited: visitor_invitedTemplate,
  visitor_checked_in: visitor_checked_inTemplate,
  amenity_reserved: amenity_reservedTemplate,
  invoice_ready: invoice_readyTemplate,
  seat_limit_warning: seat_limit_warningTemplate,
  access_denied: access_deniedTemplate,
  weekly_digest: weekly_digestTemplate,
};

export function getTemplate(key: string): TemplateDefinition {
  const template = templates[key];
  if (!template) throw new Error(`unknown template: ${key}`);
  return template;
}
