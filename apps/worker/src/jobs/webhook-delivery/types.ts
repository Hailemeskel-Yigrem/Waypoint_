export interface WebhookDeliveryJobData {
  endpointId: string;
  event: string;
  payload: Record<string, unknown>;
  url: string;
  secret: string;
}
