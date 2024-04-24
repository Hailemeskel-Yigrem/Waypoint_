export interface NotificationDispatchJobData {
  orgId: string;
  userId: string;
  channel: 'email' | 'push' | 'sms';
  subject: string;
  body: string;
}
