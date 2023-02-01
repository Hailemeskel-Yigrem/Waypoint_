/** start/end booking validation */

export interface ValidationIssue {
  path: string;
  message: string;
}

export function validateBookingWindow(input: Record<string, unknown>): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (input == null || typeof input !== 'object') {
    return [{ path: '', message: 'input must be an object' }];
  }

  if ('start' in input || 'end' in input) {
    const start = input.start;
    const end = input.end;
    if (typeof start !== 'string' || Number.isNaN(Date.parse(start))) {
      issues.push({ path: 'start', message: 'start must be an ISO datetime' });
    }
    if (typeof end !== 'string' || Number.isNaN(Date.parse(end))) {
      issues.push({ path: 'end', message: 'end must be an ISO datetime' });
    }
    if (typeof start === 'string' && typeof end === 'string') {
      if (Date.parse(end) <= Date.parse(start)) {
        issues.push({ path: 'end', message: 'end must be after start' });
      }
    }
  }

  if ('email' in input) {
    const email = String(input.email ?? '');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      issues.push({ path: 'email', message: 'invalid email' });
    }
  }

  if ('slug' in input) {
    const slug = String(input.slug ?? '');
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      issues.push({ path: 'slug', message: 'slug must be kebab-case' });
    }
  }

  if ('url' in input) {
    const url = String(input.url ?? '');
    if (!url.startsWith('https://')) {
      issues.push({ path: 'url', message: 'url must use https' });
    }
  }

  if ('capacity' in input) {
    const capacity = Number(input.capacity);
    if (!Number.isInteger(capacity) || capacity < 1) {
      issues.push({ path: 'capacity', message: 'capacity must be a positive integer' });
    }
  }

  return issues;
}

export function assertValidBookingWindow(input: Record<string, unknown>): void {
  const issues = validateBookingWindow(input);
  if (issues.length) {
    throw new Error(issues.map((i) => `${i.path}: ${i.message}`).join('; '));
  }
}
