import { describe, it, expect } from 'vitest';
import { renderTemplate } from './render.js';

describe('renderTemplate', () => {
  it('renders variables', () => {
    const msg = renderTemplate(
      {
        key: 't',
        channel: 'email',
        subject: 'Hello {{name}}',
        body: 'Welcome {{name}} to {{org}}',
        requiredVariables: ['name', 'org'],
      },
      { name: 'Ada', org: 'Waypoint' },
    );
    expect(msg.subject).toBe('Hello Ada');
    expect(msg.body).toBe('Welcome Ada to Waypoint');
  });

  it('throws on missing variables', () => {
    expect(() =>
      renderTemplate(
        {
          key: 't',
          channel: 'email',
          subject: 'x',
          body: '{{a}}',
          requiredVariables: ['a'],
        },
        {},
      ),
    ).toThrow(/missing template variable/);
  });
});
