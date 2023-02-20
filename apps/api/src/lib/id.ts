import { randomBytes, randomUUID } from 'node:crypto';

const PREFIXES = {
  organization: 'org',
  user: 'usr',
  space: 'spc',
  desk: 'dsk',
  booking: 'bkg',
  visitor: 'vis',
  amenity: 'amn',
  accessPolicy: 'acp',
  notification: 'ntf',
  integration: 'int',
  directoryEntry: 'dir',
  apiKey: 'key',
  session: 'ses',
} as const;

export type IdPrefix = keyof typeof PREFIXES;

export function generateId(prefix: IdPrefix): string {
  const p = PREFIXES[prefix];
  const suffix = randomBytes(8).toString('hex');
  return `${p}_${suffix}`;
}

export function generateUuid(): string {
  return randomUUID();
}

export function isValidId(value: string, prefix?: IdPrefix): boolean {
  if (prefix) {
    return value.startsWith(`${PREFIXES[prefix]}_`) && value.length > PREFIXES[prefix].length + 2;
  }
  return /^[a-z]{3}_[a-f0-9]{16}$/.test(value);
}

export function extractPrefix(id: string): string | null {
  const match = id.match(/^([a-z]{3})_/);
  return match ? match[1] : null;
}
