import type { FastifyInstance } from 'fastify';
import { registerOrganizationRoutes } from './modules/organizations/routes.js';
import { registerUserRoutes } from './modules/users/routes.js';
import { registerSpaceRoutes } from './modules/spaces/routes.js';
import { registerDeskRoutes } from './modules/desks/routes.js';
import { registerBookingRoutes } from './modules/bookings/routes.js';
import { registerVisitorRoutes } from './modules/visitors/routes.js';
import { registerAmenityRoutes } from './modules/amenities/routes.js';
import { registerAccessRoutes } from './modules/access/routes.js';
import { registerNotificationRoutes } from './modules/notifications/routes.js';
import { registerAnalyticsRoutes } from './modules/analytics/routes.js';
import { registerBillingRoutes } from './modules/billing/routes.js';
import { registerIntegrationRoutes } from './modules/integrations/routes.js';
import { registerDirectoryRoutes } from './modules/directory/routes.js';
import { registerHealthRoutes } from './modules/health/routes.js';

export function registerRoutes(app: FastifyInstance): void {
  app.register(
    async (api) => {
      registerHealthRoutes(api);
      registerOrganizationRoutes(api);
      registerUserRoutes(api);
      registerSpaceRoutes(api);
      registerDeskRoutes(api);
      registerBookingRoutes(api);
      registerVisitorRoutes(api);
      registerAmenityRoutes(api);
      registerAccessRoutes(api);
      registerNotificationRoutes(api);
      registerAnalyticsRoutes(api);
      registerBillingRoutes(api);
      registerIntegrationRoutes(api);
      registerDirectoryRoutes(api);
    },
    { prefix: '/api/v1' },
  );
}
