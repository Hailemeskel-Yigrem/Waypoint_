import { randomBytes } from 'node:crypto';

export const TEST_PASSWORD = `T3st-${randomBytes(18).toString('base64url')}!`;
