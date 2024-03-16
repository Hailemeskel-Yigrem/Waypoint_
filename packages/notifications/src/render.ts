import type { TemplateDefinition, RenderedMessage } from './types.js';

export function renderTemplate(
  template: TemplateDefinition,
  variables: Record<string, string>,
): RenderedMessage {
  for (const key of template.requiredVariables) {
    if (variables[key] === undefined || variables[key] === '') {
      throw new Error(`missing template variable: ${key}`);
    }
  }
  const replace = (input: string) =>
    input.replace(/\{\{(\w+)\}\}/g, (_, name: string) => variables[name] ?? '');
  return {
    channel: template.channel,
    subject: replace(template.subject),
    body: replace(template.body),
  };
}
