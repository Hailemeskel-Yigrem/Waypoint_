import { z } from 'zod';

export const createNotificationSchema = z.object({
  userId: z.string().min(1),
  channel: z.enum(['email', 'sms', 'push', 'in_app']),
  subject: z.string().min(1).max(200),
  body: z.string().min(1).max(5000),
  metadata: z.record(z.string()).optional(),
});

export const notificationIdParamSchema = z.object({ notificationId: z.string().min(1) });

export type CreateNotificationDto = z.infer<typeof createNotificationSchema>;
