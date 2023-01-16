export const WaypointEvents = {
  USER_CREATED: 'waypoint.user.created',
  USER_UPDATED: 'waypoint.user.updated',
  USER_DELETED: 'waypoint.user.deleted',
  ORG_CREATED: 'waypoint.org.created',
  ORG_UPDATED: 'waypoint.org.updated',
  BOOKING_CREATED: 'waypoint.booking.created',
  BOOKING_CANCELLED: 'waypoint.booking.cancelled',
  BOOKING_REMINDER: 'waypoint.booking.reminder',
  VISITOR_REGISTERED: 'waypoint.visitor.registered',
  VISITOR_EXPIRED: 'waypoint.visitor.expired',
  VISITOR_CHECKED_IN: 'waypoint.visitor.checked_in',
  NOTIFICATION_DISPATCHED: 'waypoint.notification.dispatched',
  WEBHOOK_DELIVERED: 'waypoint.webhook.delivered',
  WEBHOOK_FAILED: 'waypoint.webhook.failed',
  INVOICE_GENERATED: 'waypoint.invoice.generated',
  ANALYTICS_ROLLUP: 'waypoint.analytics.rollup',
  SPACE_CREATED: 'waypoint.space.created',
  DESK_CREATED: 'waypoint.desk.created',
  AMENITY_BOOKED: 'waypoint.amenity.booked',
} as const;

export type WaypointEventName = (typeof WaypointEvents)[keyof typeof WaypointEvents];

export interface EventPayload<T = Record<string, unknown>> {
  event: WaypointEventName;
  orgId: string;
  timestamp: string;
  data: T;
  correlationId?: string;
}

export function createEventPayload<T>(
  event: WaypointEventName,
  orgId: string,
  data: T,
  correlationId?: string,
): EventPayload<T> {
  return {
    event,
    orgId,
    timestamp: new Date().toISOString(),
    data,
    correlationId,
  };
}
