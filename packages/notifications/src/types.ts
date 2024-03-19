export type Channel = 'email' | 'sms' | 'push' | 'slack' | 'webhook';

export interface TemplateDefinition {
  key: string;
  channel: Channel;
  subject: string;
  body: string;
  requiredVariables: string[];
}

export interface RenderedMessage {
  channel: Channel;
  subject: string;
  body: string;
}
