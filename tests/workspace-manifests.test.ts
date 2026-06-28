import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

interface PackageManifest {
  name: string;
  dependencies?: Record<string, string>;
  scripts?: Record<string, string>;
  workspaces?: string[];
}

function manifest(path: string): PackageManifest {
  return JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), 'utf8'));
}

describe('workspace package contracts', () => {
  it('declares application and package workspaces for package-manager tooling', () => {
    expect(manifest('package.json').workspaces).toEqual(['apps/*', 'packages/*']);
  });

  it.each([
    ['apps/api/package.json', ['@waypoint/database', 'fastify', 'pg', 'zod']],
    ['apps/web/package.json', ['react', 'react-dom']],
    ['apps/portal/package.json', ['react', 'react-dom']],
    ['apps/worker/package.json', ['@waypoint/database', 'ioredis']],
  ])('%s declares its runtime libraries as production dependencies', (path, dependencies) => {
    const packageJson = manifest(path);

    for (const dependency of dependencies) {
      expect(
        packageJson.dependencies,
        `${packageJson.name} must declare ${dependency}`,
      ).toHaveProperty(dependency);
    }
  });

  it.each([
    'apps/api/package.json',
    'apps/web/package.json',
    'apps/portal/package.json',
    'apps/worker/package.json',
    'packages/database/package.json',
  ])('%s exposes a runnable test command', (path) => {
    expect(manifest(path).scripts?.test).toMatch(/vitest run/);
  });
});
