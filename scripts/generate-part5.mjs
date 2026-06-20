#!/usr/bin/env node
/** Part 5: web + portal apps */
import { mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function write(relPath, content) {
  const full = join(ROOT, relPath);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content, 'utf8');
}

function viteApp(name, port, title) {
  write(`apps/${name}/package.json`, JSON.stringify({
    name: `@waypoint/${name}`,
    version: '0.1.0',
    private: true,
    type: 'module',
    scripts: {
      dev: `vite --port ${port}`,
      build: 'tsc -p tsconfig.json && vite build',
      preview: `vite preview --port ${port}`,
      test: 'vitest run',
      typecheck: 'tsc --noEmit',
      lint: 'eslint src',
      clean: 'rimraf dist',
    },
    dependencies: {
      '@waypoint/shared': 'workspace:*',
      '@waypoint/ui': 'workspace:*',
      react: '^19.0.0',
      'react-dom': '^19.0.0',
      'react-router-dom': '^7.1.1',
    },
    devDependencies: {
      '@types/react': '^19.0.2',
      '@types/react-dom': '^19.0.2',
      '@vitejs/plugin-react': '^4.3.4',
      typescript: '^5.7.3',
      vite: '^6.0.7',
      vitest: '^2.1.8',
      '@testing-library/react': '^16.1.0',
      jsdom: '^25.0.1',
      rimraf: '^6.0.1',
    },
  }, null, 2));

  write(`apps/${name}/tsconfig.json`, JSON.stringify({
    extends: '../../tsconfig.base.json',
    compilerOptions: { outDir: './dist', rootDir: './src', jsx: 'react-jsx', module: 'ESNext', moduleResolution: 'bundler', noEmit: true },
    include: ['src/**/*'],
    references: [{ path: '../../packages/shared' }, { path: '../../packages/ui' }],
  }, null, 2));

  write(`apps/${name}/vite.config.ts`, `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: ${port} },
  resolve: { alias: { '@': '/src' } },
});
`);

  write(`apps/${name}/index.html`, `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`);

  write(`apps/${name}/vitest.config.ts`, `import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react()], test: { globals: true, environment: 'jsdom' } });
`);

  write(`apps/${name}/src/vite-env.d.ts`, `/// <reference types="vite/client" />
interface ImportMetaEnv { readonly VITE_API_URL: string; readonly VITE_APP_NAME: string; }
interface ImportMeta { readonly env: ImportMetaEnv; }
`);

  write(`apps/${name}/src/styles/global.css`, `*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, -apple-system, sans-serif; color: #0f172a; background: #f8fafc; }
a { color: #2563eb; text-decoration: none; }
a:hover { text-decoration: underline; }
`);
}

// Shared API client for both apps
function writeApiClient(app) {
  write(`apps/${app}/src/api/client.ts`, `const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export class ApiError extends Error {
  constructor(public status: number, message: string, public code?: string) {
    super(message);
    this.name = 'ApiError';
  }
}

function getToken(): string | null {
  return localStorage.getItem('waypoint_token');
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  };
  const token = getToken();
  if (token) headers.Authorization = \`Bearer \${token}\`;

  const res = await fetch(\`\${BASE}\${path}\`, { ...init, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.message ?? res.statusText, body.code);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export function setAuthToken(token: string | null): void {
  if (token) localStorage.setItem('waypoint_token', token);
  else localStorage.removeItem('waypoint_token');
}
`);

  write(`apps/${app}/src/api/auth.ts`, `import { apiRequest, setAuthToken } from './client.js';
import type { LoginInput } from '@waypoint/shared';

export interface AuthResponse { token: string; user: { id: string; email: string; firstName: string; lastName: string; role: string; orgId: string; }; }

export async function login(input: LoginInput): Promise<AuthResponse> {
  const data = await apiRequest<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(input) });
  setAuthToken(data.token);
  return data;
}

export function logout(): void { setAuthToken(null); }
`);

  write(`apps/${app}/src/api/bookings.ts`, `import { apiRequest } from './client.js';
import type { Booking, CreateBookingInput } from '@waypoint/shared';

export async function listBookings(): Promise<Booking[]> {
  const res = await apiRequest<{ data: Booking[] }>('/bookings');
  return res.data;
}

export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  const res = await apiRequest<{ data: Booking }>('/bookings', { method: 'POST', body: JSON.stringify(input) });
  return res.data;
}

export async function cancelBooking(id: string): Promise<void> {
  await apiRequest(\`/bookings/\${id}/cancel\`, { method: 'POST' });
}
`);

  write(`apps/${app}/src/api/spaces.ts`, `import { apiRequest } from './client.js';
import type { Space, Desk, CreateSpaceInput } from '@waypoint/shared';

export async function listSpaces(): Promise<Space[]> {
  const res = await apiRequest<{ data: Space[] }>('/spaces');
  return res.data;
}

export async function createSpace(input: CreateSpaceInput): Promise<Space> {
  const res = await apiRequest<{ data: Space }>('/spaces', { method: 'POST', body: JSON.stringify(input) });
  return res.data;
}

export async function listDesks(spaceId?: string): Promise<Desk[]> {
  const q = spaceId ? \`?spaceId=\${spaceId}\` : '';
  const res = await apiRequest<{ data: Desk[] }>(\`/desks\${q}\`);
  return res.data;
}
`);

  write(`apps/${app}/src/api/visitors.ts`, `import { apiRequest } from './client.js';
import type { Visitor, CreateVisitorInput } from '@waypoint/shared';

export async function listVisitors(): Promise<Visitor[]> {
  const res = await apiRequest<{ data: Visitor[] }>('/visitors');
  return res.data;
}

export async function createVisitor(input: CreateVisitorInput): Promise<Visitor> {
  const res = await apiRequest<{ data: Visitor }>('/visitors', { method: 'POST', body: JSON.stringify(input) });
  return res.data;
}
`);

  write(`apps/${app}/src/api/amenities.ts`, `import { apiRequest } from './client.js';
import type { Amenity } from '@waypoint/shared';

export async function listAmenities(): Promise<Amenity[]> {
  const res = await apiRequest<{ data: Amenity[] }>('/amenities');
  return res.data;
}
`);

  write(`apps/${app}/src/api/org.ts`, `import { apiRequest } from './client.js';
import type { Organization, UpdateOrgInput } from '@waypoint/shared';

export async function getOrg(): Promise<Organization> {
  const res = await apiRequest<{ data: Organization }>('/org');
  return res.data;
}

export async function updateOrg(input: UpdateOrgInput): Promise<Organization> {
  const res = await apiRequest<{ data: Organization }>('/org', { method: 'PATCH', body: JSON.stringify(input) });
  return res.data;
}
`);

  write(`apps/${app}/src/api/analytics.ts`, `import { apiRequest } from './client.js';
import type { AnalyticsRollup } from '@waypoint/shared';

export async function getAnalytics(days = 30): Promise<AnalyticsRollup[]> {
  const res = await apiRequest<{ data: AnalyticsRollup[] }>(\`/analytics?days=\${days}\`);
  return res.data;
}
`);

  write(`apps/${app}/src/api/billing.ts`, `import { apiRequest } from './client.js';
import type { Invoice } from '@waypoint/shared';

export async function listInvoices(): Promise<Invoice[]> {
  const res = await apiRequest<{ data: Invoice[] }>('/billing/invoices');
  return res.data;
}
`);

  write(`apps/${app}/src/api/users.ts`, `import { apiRequest } from './client.js';
import type { UserProfile } from '@waypoint/shared';

export async function listUsers(): Promise<UserProfile[]> {
  const res = await apiRequest<{ data: UserProfile[] }>('/users');
  return res.data;
}

export async function getDirectory(): Promise<UserProfile[]> {
  const res = await apiRequest<{ data: UserProfile[] }>('/directory');
  return res.data;
}
`);

  write(`apps/${app}/src/api/index.ts`, `export * from './client.js';
export * from './auth.js';
export * from './bookings.js';
export * from './spaces.js';
export * from './visitors.js';
export * from './amenities.js';
export * from './org.js';
export * from './analytics.js';
export * from './billing.js';
export * from './users.js';
`);
}

function writeHooks(app) {
  const hooks = {
    'useAuth': `import { useCallback, useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout, type AuthResponse } from '../api/auth.js';

interface AuthState { user: AuthResponse['user'] | null; loading: boolean; }

export function useAuth() {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });

  useEffect(() => {
    const raw = localStorage.getItem('waypoint_user');
    setState({ user: raw ? JSON.parse(raw) : null, loading: false });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiLogin({ email, password });
    localStorage.setItem('waypoint_user', JSON.stringify(res.user));
    setState({ user: res.user, loading: false });
    return res;
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    localStorage.removeItem('waypoint_user');
    setState({ user: null, loading: false });
  }, []);

  return { ...state, login, logout, isAuthenticated: !!state.user };
}
`,
    'useBookings': `import { useCallback, useEffect, useState } from 'react';
import { listBookings, createBooking, cancelBooking } from '../api/bookings.js';
import type { Booking, CreateBookingInput } from '@waypoint/shared';

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setBookings(await listBookings());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const create = useCallback(async (input: CreateBookingInput) => {
    const b = await createBooking(input);
    setBookings((prev) => [...prev, b]);
    return b;
  }, []);

  const cancel = useCallback(async (id: string) => {
    await cancelBooking(id);
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' as const } : b)));
  }, []);

  return { bookings, loading, error, refresh, create, cancel };
}
`,
    'useSpaces': `import { useCallback, useEffect, useState } from 'react';
import { listSpaces, createSpace, listDesks } from '../api/spaces.js';
import type { Space, Desk, CreateSpaceInput } from '@waypoint/shared';

export function useSpaces() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [desks, setDesks] = useState<Desk[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [s, d] = await Promise.all([listSpaces(), listDesks()]);
    setSpaces(s);
    setDesks(d);
    setLoading(false);
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const create = useCallback(async (input: CreateSpaceInput) => {
    const space = await createSpace(input);
    setSpaces((prev) => [...prev, space]);
    return space;
  }, []);

  return { spaces, desks, loading, refresh, create };
}
`,
    'useVisitors': `import { useCallback, useEffect, useState } from 'react';
import { listVisitors, createVisitor } from '../api/visitors.js';
import type { Visitor, CreateVisitorInput } from '@waypoint/shared';

export function useVisitors() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setVisitors(await listVisitors());
    setLoading(false);
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const create = useCallback(async (input: CreateVisitorInput) => {
    const v = await createVisitor(input);
    setVisitors((prev) => [...prev, v]);
    return v;
  }, []);

  return { visitors, loading, refresh, create };
}
`,
    'useAmenities': `import { useCallback, useEffect, useState } from 'react';
import { listAmenities } from '../api/amenities.js';
import type { Amenity } from '@waypoint/shared';

export function useAmenities() {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    listAmenities().then(setAmenities).finally(() => setLoading(false));
  }, []);
  const refresh = useCallback(() => listAmenities().then(setAmenities), []);
  return { amenities, loading, refresh };
}
`,
    'useOrg': `import { useCallback, useEffect, useState } from 'react';
import { getOrg, updateOrg } from '../api/org.js';
import type { Organization, UpdateOrgInput } from '@waypoint/shared';

export function useOrg() {
  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrg().then(setOrg).catch(() => setOrg(null)).finally(() => setLoading(false));
  }, []);

  const update = useCallback(async (input: UpdateOrgInput) => {
    const o = await updateOrg(input);
    setOrg(o);
    return o;
  }, []);

  return { org, loading, update };
}
`,
    'useAnalytics': `import { useEffect, useState } from 'react';
import { getAnalytics } from '../api/analytics.js';
import type { AnalyticsRollup } from '@waypoint/shared';

export function useAnalytics(days = 30) {
  const [data, setData] = useState<AnalyticsRollup[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getAnalytics(days).then(setData).finally(() => setLoading(false));
  }, [days]);
  return { data, loading };
}
`,
    'useBilling': `import { useEffect, useState } from 'react';
import { listInvoices } from '../api/billing.js';
import type { Invoice } from '@waypoint/shared';

export function useBilling() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    listInvoices().then(setInvoices).finally(() => setLoading(false));
  }, []);
  return { invoices, loading };
}
`,
    'useDirectory': `import { useEffect, useState } from 'react';
import { getDirectory } from '../api/users.js';
import type { UserProfile } from '@waypoint/shared';

export function useDirectory() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getDirectory().then(setUsers).finally(() => setLoading(false));
  }, []);
  return { users, loading };
}
`,
  };

  for (const [name, content] of Object.entries(hooks)) {
    write(`apps/${app}/src/hooks/${name}.ts`, content);
  }
  write(`apps/${app}/src/hooks/index.ts`, Object.keys(hooks).map(h => `export * from './${h}.js';`).join('\n') + '\n');
}

// ============ WEB APP ============
viteApp('web', 5173, 'Waypoint Admin');
writeApiClient('web');
writeHooks('web');

write('apps/web/src/main.tsx', `import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from '@waypoint/ui';
import { App } from './App.js';
import './styles/global.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <App />
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
`);

write('apps/web/src/App.tsx', `import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './layouts/AdminLayout.js';
import { LoginPage } from './pages/auth/LoginPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { OrgSettingsPage } from './pages/settings/OrgSettingsPage.js';
import { SpacesListPage } from './pages/spaces/SpacesListPage.js';
import { SpaceDetailPage } from './pages/spaces/SpaceDetailPage.js';
import { DesksPage } from './pages/spaces/DesksPage.js';
import { BookingsPage } from './pages/bookings/BookingsPage.js';
import { BookingsCalendarPage } from './pages/bookings/BookingsCalendarPage.js';
import { VisitorsPage } from './pages/visitors/VisitorsPage.js';
import { AmenitiesPage } from './pages/amenities/AmenitiesPage.js';
import { AnalyticsPage } from './pages/analytics/AnalyticsPage.js';
import { BillingPage } from './pages/billing/BillingPage.js';
import { ProtectedRoute } from './components/ProtectedRoute.js';

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<DashboardPage />} />
        <Route path="settings" element={<OrgSettingsPage />} />
        <Route path="spaces" element={<SpacesListPage />} />
        <Route path="spaces/:id" element={<SpaceDetailPage />} />
        <Route path="desks" element={<DesksPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="bookings/calendar" element={<BookingsCalendarPage />} />
        <Route path="visitors" element={<VisitorsPage />} />
        <Route path="amenities" element={<AmenitiesPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="billing" element={<BillingPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
`);

write('apps/web/src/layouts/AdminLayout.tsx', `import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Button } from '@waypoint/ui';
import { useAuth } from '../hooks/useAuth.js';
import styles from './AdminLayout.module.css';

const nav = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/spaces', label: 'Spaces' },
  { to: '/desks', label: 'Desks' },
  { to: '/bookings', label: 'Bookings' },
  { to: '/bookings/calendar', label: 'Calendar' },
  { to: '/visitors', label: 'Visitors' },
  { to: '/amenities', label: 'Amenities' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/billing', label: 'Billing' },
  { to: '/settings', label: 'Settings' },
];

export function AdminLayout() {
  const { user, logout } = useAuth();
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>Waypoint</div>
        <nav className={styles.nav}>
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => isActive ? styles.active : undefined}>{item.label}</NavLink>
          ))}
        </nav>
      </aside>
      <div className={styles.main}>
        <header className={styles.header}>
          <span>{user?.firstName} {user?.lastName}</span>
          <Button variant="ghost" size="sm" onClick={logout}>Sign out</Button>
        </header>
        <main className={styles.content}><Outlet /></main>
      </div>
    </div>
  );
}
`);

write('apps/web/src/layouts/AdminLayout.module.css', `.shell { display: flex; min-height: 100vh; }
.sidebar { width: 240px; background: #0f172a; color: #e2e8f0; padding: 1.5rem 1rem; }
.brand { font-size: 1.25rem; font-weight: 700; margin-bottom: 2rem; color: #fff; }
.nav { display: flex; flex-direction: column; gap: 0.25rem; }
.nav a { color: #94a3b8; padding: 0.5rem 0.75rem; border-radius: 6px; text-decoration: none; }
.nav a:hover { background: #1e293b; color: #fff; }
.active { background: #2563eb !important; color: #fff !important; }
.main { flex: 1; display: flex; flex-direction: column; }
.header { display: flex; justify-content: flex-end; align-items: center; gap: 1rem; padding: 1rem 1.5rem; background: #fff; border-bottom: 1px solid #e2e8f0; }
.content { padding: 1.5rem; flex: 1; }
`);

write('apps/web/src/components/ProtectedRoute.tsx', `import React from 'react';
import { Navigate } from 'react-router-dom';
import { Spinner } from '@waypoint/ui';
import { useAuth } from '../hooks/useAuth.js';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
`);

// Web pages
const webPages = {
  'auth/LoginPage': `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card, useToast } from '@waypoint/ui';
import { useAuth } from '../../hooks/useAuth.js';
import styles from './LoginPage.module.css';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { push } = useToast();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch {
      push('Invalid credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <Card title="Sign in to Waypoint">
        <form onSubmit={onSubmit} className={styles.form}>
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" loading={loading}>Sign in</Button>
        </form>
      </Card>
    </div>
  );
}
`,
  'DashboardPage': `import React from 'react';
import { PageHeader, Card, Grid, Spinner } from '@waypoint/ui';
import { useBookings } from '../hooks/useBookings.js';
import { useVisitors } from '../hooks/useVisitors.js';
import { useAnalytics } from '../hooks/useAnalytics.js';

export function DashboardPage() {
  const { bookings, loading: lb } = useBookings();
  const { visitors, loading: lv } = useVisitors();
  const { data: analytics, loading: la } = useAnalytics(7);

  if (lb || lv || la) return <Spinner />;

  const todayBookings = bookings.filter((b) => b.status === 'confirmed').length;
  const expectedVisitors = visitors.filter((v) => v.status === 'expected').length;
  const avgOccupancy = analytics.length
    ? Math.round(analytics.reduce((s, a) => s + a.occupancyRate, 0) / analytics.length)
    : 0;

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Overview of your workplace" />
      <Grid cols={3}>
        <Card title="Today's bookings"><strong>{todayBookings}</strong></Card>
        <Card title="Expected visitors"><strong>{expectedVisitors}</strong></Card>
        <Card title="Avg occupancy (7d)"><strong>{avgOccupancy}%</strong></Card>
      </Grid>
    </>
  );
}
`,
  'settings/OrgSettingsPage': `import React, { useState, useEffect } from 'react';
import { PageHeader, Input, Button, Card, useToast } from '@waypoint/ui';
import { useOrg } from '../../hooks/useOrg.js';

export function OrgSettingsPage() {
  const { org, loading, update } = useOrg();
  const [name, setName] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const { push } = useToast();

  useEffect(() => {
    if (org) { setName(org.name); setTimezone(org.timezone); }
  }, [org]);

  if (loading) return null;

  const save = async () => {
    await update({ name, timezone });
    push('Settings saved', 'success');
  };

  return (
    <>
      <PageHeader title="Organization settings" />
      <Card>
        <Input label="Organization name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Timezone" value={timezone} onChange={(e) => setTimezone(e.target.value)} />
        <Button onClick={save}>Save changes</Button>
      </Card>
    </>
  );
}
`,
  'spaces/SpacesListPage': `import React, { useState } from 'react';
import { PageHeader, Table, Button, Badge, Modal, Input, Select, Spinner, useToast } from '@waypoint/ui';
import { useSpaces } from '../../hooks/useSpaces.js';
import { Link } from 'react-router-dom';

export function SpacesListPage() {
  const { spaces, loading, create } = useSpaces();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('meeting_room');
  const { push } = useToast();

  const onCreate = async () => {
    await create({ name, slug: name.toLowerCase().replace(/\\s+/g, '-'), type: type as any, capacity: 1 });
    push('Space created', 'success');
    setOpen(false);
    setName('');
  };

  if (loading) return <Spinner />;

  return (
    <>
      <PageHeader title="Spaces" actions={<Button onClick={() => setOpen(true)}>Add space</Button>} />
      <Table
        columns={[
          { key: 'name', header: 'Name', render: (r) => <Link to={\`/spaces/\${r.id}\`}>{String(r.name)}</Link> },
          { key: 'type', header: 'Type', render: (r) => <Badge>{String(r.type)}</Badge> },
          { key: 'capacity', header: 'Capacity' },
          { key: 'floor', header: 'Floor' },
        ]}
        data={spaces as any}
      />
      <Modal open={open} title="New space" onClose={() => setOpen(false)} footer={<Button onClick={onCreate}>Create</Button>}>
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Select label="Type" value={type} onChange={(e) => setType(e.target.value)} options={[
          { value: 'meeting_room', label: 'Meeting room' },
          { value: 'open_area', label: 'Open area' },
          { value: 'phone_booth', label: 'Phone booth' },
        ]} />
      </Modal>
    </>
  );
}
`,
  'spaces/SpaceDetailPage': `import React from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader, Card, Badge, Spinner } from '@waypoint/ui';
import { useSpaces } from '../../hooks/useSpaces.js';

export function SpaceDetailPage() {
  const { id } = useParams();
  const { spaces, loading } = useSpaces();
  const space = spaces.find((s) => s.id === id);

  if (loading) return <Spinner />;
  if (!space) return <p>Space not found</p>;

  return (
    <>
      <PageHeader title={space.name} subtitle={space.slug} />
      <Card title="Details">
        <p>Type: <Badge>{space.type}</Badge></p>
        <p>Capacity: {space.capacity}</p>
        <p>Floor: {space.floor ?? '—'}</p>
      </Card>
    </>
  );
}
`,
  'spaces/DesksPage': `import React from 'react';
import { PageHeader, Table, Badge, Spinner } from '@waypoint/ui';
import { useSpaces } from '../../hooks/useSpaces.js';

export function DesksPage() {
  const { desks, spaces, loading } = useSpaces();
  if (loading) return <Spinner />;

  return (
    <>
      <PageHeader title="Desks" subtitle="Manage bookable desks" />
      <Table
        columns={[
          { key: 'label', header: 'Label' },
          { key: 'spaceId', header: 'Space', render: (r) => spaces.find((s) => s.id === r.spaceId)?.name ?? r.spaceId },
          { key: 'isBookable', header: 'Bookable', render: (r) => <Badge variant={r.isBookable ? 'success' : 'default'}>{r.isBookable ? 'Yes' : 'No'}</Badge> },
        ]}
        data={desks as any}
      />
    </>
  );
}
`,
  'bookings/BookingsPage': `import React from 'react';
import { PageHeader, Table, Badge, Button, Spinner } from '@waypoint/ui';
import { useBookings } from '../../hooks/useBookings.js';
import { formatDuration, minutesBetween, parseISODate } from '@waypoint/shared';

export function BookingsPage() {
  const { bookings, loading, cancel } = useBookings();
  if (loading) return <Spinner />;

  return (
    <>
      <PageHeader title="Bookings" subtitle="All workspace reservations" />
      <Table
        columns={[
          { key: 'resourceType', header: 'Resource' },
          { key: 'startAt', header: 'Start', render: (r) => new Date(String(r.startAt)).toLocaleString() },
          { key: 'duration', header: 'Duration', render: (r) => formatDuration(minutesBetween(parseISODate(String(r.startAt)), parseISODate(String(r.endAt)))) },
          { key: 'status', header: 'Status', render: (r) => <Badge variant={r.status === 'confirmed' ? 'success' : 'default'}>{String(r.status)}</Badge> },
          { key: 'actions', header: '', render: (r) => r.status === 'confirmed' ? <Button size="sm" variant="ghost" onClick={() => cancel(String(r.id))}>Cancel</Button> : null },
        ]}
        data={bookings as any}
      />
    </>
  );
}
`,
  'bookings/BookingsCalendarPage': `import React, { useMemo } from 'react';
import { PageHeader, Card, Spinner } from '@waypoint/ui';
import { useBookings } from '../../hooks/useBookings.js';
import { isSameDay } from '@waypoint/shared';
import styles from './BookingsCalendarPage.module.css';

export function BookingsCalendarPage() {
  const { bookings, loading } = useBookings();
  const days = useMemo(() => {
    const result: Date[] = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      result.push(d);
    }
    return result;
  }, []);

  if (loading) return <Spinner />;

  return (
    <>
      <PageHeader title="Bookings calendar" subtitle="Next 7 days" />
      <div className={styles.grid}>
        {days.map((day) => {
          const dayBookings = bookings.filter((b) => isSameDay(parseISODate(b.startAt), day) && b.status !== 'cancelled');
          return (
            <Card key={day.toISOString()} title={day.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}>
              {dayBookings.length === 0 ? <p className={styles.empty}>No bookings</p> : (
                <ul className={styles.list}>
                  {dayBookings.map((b) => (
                    <li key={b.id}>{new Date(b.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — {b.resourceType}</li>
                  ))}
                </ul>
              )}
            </Card>
          );
        })}
      </div>
    </>
  );
}
`,
  'visitors/VisitorsPage': `import React, { useState } from 'react';
import { PageHeader, Table, Badge, Button, Modal, Input, Spinner, useToast } from '@waypoint/ui';
import { useVisitors } from '../../hooks/useVisitors.js';
import { useAuth } from '../../hooks/useAuth.js';

export function VisitorsPage() {
  const { visitors, loading, create } = useVisitors();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', expectedAt: '' });
  const { push } = useToast();

  const onCreate = async () => {
    if (!user) return;
    await create({ ...form, hostUserId: user.id, expectedAt: new Date(form.expectedAt).toISOString() });
    push('Visitor registered', 'success');
    setOpen(false);
  };

  if (loading) return <Spinner />;

  return (
    <>
      <PageHeader title="Visitors" actions={<Button onClick={() => setOpen(true)}>Register visitor</Button>} />
      <Table
        columns={[
          { key: 'name', header: 'Name', render: (r) => \`\${r.firstName} \${r.lastName}\` },
          { key: 'email', header: 'Email' },
          { key: 'expectedAt', header: 'Expected', render: (r) => new Date(String(r.expectedAt)).toLocaleString() },
          { key: 'status', header: 'Status', render: (r) => <Badge>{String(r.status)}</Badge> },
        ]}
        data={visitors as any}
      />
      <Modal open={open} title="Register visitor" onClose={() => setOpen(false)} footer={<Button onClick={onCreate}>Save</Button>}>
        <Input label="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
        <Input label="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
        <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input label="Expected at" type="datetime-local" value={form.expectedAt} onChange={(e) => setForm({ ...form, expectedAt: e.target.value })} />
      </Modal>
    </>
  );
}
`,
  'amenities/AmenitiesPage': `import React from 'react';
import { PageHeader, Table, Badge, Spinner, EmptyState } from '@waypoint/ui';
import { useAmenities } from '../../hooks/useAmenities.js';

export function AmenitiesPage() {
  const { amenities, loading } = useAmenities();
  if (loading) return <Spinner />;

  return (
    <>
      <PageHeader title="Amenities" />
      {amenities.length === 0 ? (
        <EmptyState title="No amenities" description="Configure parking, lockers, and more." />
      ) : (
        <Table
          columns={[
            { key: 'name', header: 'Name' },
            { key: 'type', header: 'Type', render: (r) => <Badge>{String(r.type)}</Badge> },
            { key: 'capacity', header: 'Capacity' },
            { key: 'isActive', header: 'Status', render: (r) => <Badge variant={r.isActive ? 'success' : 'default'}>{r.isActive ? 'Active' : 'Inactive'}</Badge> },
          ]}
          data={amenities as any}
        />
      )}
    </>
  );
}
`,
  'analytics/AnalyticsPage': `import React from 'react';
import { PageHeader, Card, Table, Spinner } from '@waypoint/ui';
import { useAnalytics } from '../../hooks/useAnalytics.js';
import { formatMoney, money } from '@waypoint/shared';

export function AnalyticsPage() {
  const { data, loading } = useAnalytics(30);
  if (loading) return <Spinner />;

  const totalBookings = data.reduce((s, d) => s + d.bookingsCount, 0);
  const totalRevenue = data.reduce((s, d) => s + d.revenueCents, 0);

  return (
    <>
      <PageHeader title="Analytics" subtitle="Last 30 days" />
      <Card title="Summary">
        <p>Total bookings: <strong>{totalBookings}</strong></p>
        <p>Total revenue: <strong>{formatMoney(money(totalRevenue))}</strong></p>
      </Card>
      <Table
        columns={[
          { key: 'date', header: 'Date' },
          { key: 'bookingsCount', header: 'Bookings' },
          { key: 'visitorsCount', header: 'Visitors' },
          { key: 'occupancyRate', header: 'Occupancy %', render: (r) => \`\${r.occupancyRate}%\` },
        ]}
        data={data as any}
      />
    </>
  );
}
`,
  'billing/BillingPage': `import React from 'react';
import { PageHeader, Table, Badge, Spinner } from '@waypoint/ui';
import { useBilling } from '../../hooks/useBilling.js';
import { formatMoney } from '@waypoint/shared';

export function BillingPage() {
  const { invoices, loading } = useBilling();
  if (loading) return <Spinner />;

  const statusVariant = (s: string) => {
    if (s === 'paid') return 'success';
    if (s === 'overdue') return 'error';
    if (s === 'sent') return 'info';
    return 'default';
  };

  return (
    <>
      <PageHeader title="Billing" subtitle="Invoices and payments" />
      <Table
        columns={[
          { key: 'number', header: 'Invoice #' },
          { key: 'period', header: 'Period', render: (r) => \`\${r.periodStart} — \${r.periodEnd}\` },
          { key: 'total', header: 'Total', render: (r) => formatMoney(r.total as any) },
          { key: 'status', header: 'Status', render: (r) => <Badge variant={statusVariant(String(r.status))}>{String(r.status)}</Badge> },
          { key: 'dueAt', header: 'Due', render: (r) => new Date(String(r.dueAt)).toLocaleDateString() },
        ]}
        data={invoices as any}
      />
    </>
  );
}
`,
};

for (const [path, content] of Object.entries(webPages)) {
  write(`apps/web/src/pages/${path}.tsx`, content);
}
write('apps/web/src/pages/auth/LoginPage.module.css', `.page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1rem; }
.form { display: flex; flex-direction: column; gap: 1rem; }
`);
write('apps/web/src/pages/bookings/BookingsCalendarPage.module.css', `.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; }
.list { margin: 0; padding-left: 1.25rem; font-size: 0.875rem; }
.empty { color: #64748b; font-size: 0.875rem; margin: 0; }
`);

write('apps/web/src/api/client.test.ts', `import { describe, it, expect } from 'vitest';
import { ApiError } from './client.js';

describe('ApiError', () => {
  it('stores status', () => {
    const e = new ApiError(404, 'Not found');
    expect(e.status).toBe(404);
  });
});
`);

// ============ PORTAL APP ============
viteApp('portal', 5174, 'Waypoint Portal');
writeApiClient('portal');
writeHooks('portal');

write('apps/portal/src/main.tsx', `import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from '@waypoint/ui';
import { App } from './App.js';
import './styles/global.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <App />
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
`);

write('apps/portal/src/App.tsx', `import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PortalLayout } from './layouts/PortalLayout.js';
import { LoginPage } from './pages/auth/LoginPage.js';
import { HomePage } from './pages/HomePage.js';
import { BookDeskPage } from './pages/book/BookDeskPage.js';
import { BookSpacePage } from './pages/book/BookSpacePage.js';
import { MyBookingsPage } from './pages/bookings/MyBookingsPage.js';
import { InviteVisitorPage } from './pages/visitors/InviteVisitorPage.js';
import { AmenitiesPage } from './pages/amenities/AmenitiesPage.js';
import { DirectoryPage } from './pages/directory/DirectoryPage.js';
import { ProtectedRoute } from './components/ProtectedRoute.js';

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute><PortalLayout /></ProtectedRoute>}>
        <Route index element={<HomePage />} />
        <Route path="book/desk" element={<BookDeskPage />} />
        <Route path="book/space" element={<BookSpacePage />} />
        <Route path="bookings" element={<MyBookingsPage />} />
        <Route path="visitors/invite" element={<InviteVisitorPage />} />
        <Route path="amenities" element={<AmenitiesPage />} />
        <Route path="directory" element={<DirectoryPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
`);

write('apps/portal/src/layouts/PortalLayout.tsx', `import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Button, Avatar } from '@waypoint/ui';
import { useAuth } from '../hooks/useAuth.js';
import styles from './PortalLayout.module.css';

const nav = [
  { to: '/', label: 'Home', end: true },
  { to: '/book/desk', label: 'Book desk' },
  { to: '/book/space', label: 'Book space' },
  { to: '/bookings', label: 'My bookings' },
  { to: '/visitors/invite', label: 'Invite visitor' },
  { to: '/amenities', label: 'Amenities' },
  { to: '/directory', label: 'Directory' },
];

export function PortalLayout() {
  const { user, logout } = useAuth();
  const name = user ? \`\${user.firstName} \${user.lastName}\` : '';
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <span className={styles.brand}>Waypoint Portal</span>
        <nav className={styles.nav}>
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end}>{item.label}</NavLink>
          ))}
        </nav>
        <div className={styles.user}>
          {user && <Avatar name={name} size="sm" />}
          <Button variant="ghost" size="sm" onClick={logout}>Sign out</Button>
        </div>
      </header>
      <main className={styles.content}><Outlet /></main>
    </div>
  );
}
`);

write('apps/portal/src/layouts/PortalLayout.module.css', `.shell { min-height: 100vh; display: flex; flex-direction: column; }
.header { display: flex; align-items: center; gap: 2rem; padding: 1rem 1.5rem; background: #fff; border-bottom: 1px solid #e2e8f0; flex-wrap: wrap; }
.brand { font-weight: 700; font-size: 1.125rem; color: #2563eb; }
.nav { display: flex; gap: 1rem; flex: 1; flex-wrap: wrap; }
.nav a { color: #475569; text-decoration: none; font-size: 0.9375rem; }
.nav a:hover, .nav a:global(.active) { color: #2563eb; }
.user { display: flex; align-items: center; gap: 0.5rem; }
.content { padding: 1.5rem; max-width: 960px; margin: 0 auto; width: 100%; }
`);

write('apps/portal/src/components/ProtectedRoute.tsx', `import React from 'react';
import { Navigate } from 'react-router-dom';
import { Spinner } from '@waypoint/ui';
import { useAuth } from '../hooks/useAuth.js';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
`);

const portalPages = {
  'auth/LoginPage': `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card, useToast } from '@waypoint/ui';
import { useAuth } from '../../hooks/useAuth.js';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { push } = useToast();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch {
      push('Login failed', 'error');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card title="Waypoint Portal">
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit">Sign in</Button>
        </form>
      </Card>
    </div>
  );
}
`,
  'HomePage': `import React from 'react';
import { PageHeader, Card, Grid, Button } from '@waypoint/ui';
import { Link } from 'react-router-dom';
import { useBookings } from '../hooks/useBookings.js';

export function HomePage() {
  const { bookings } = useBookings();
  const upcoming = bookings.filter((b) => b.status === 'confirmed' && new Date(b.startAt) > new Date()).slice(0, 3);

  return (
    <>
      <PageHeader title="Welcome back" subtitle="Quick actions for your workday" />
      <Grid cols={2}>
        <Card title="Book workspace">
          <p>Reserve a desk or meeting room.</p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <Link to="/book/desk"><Button size="sm">Book desk</Button></Link>
            <Link to="/book/space"><Button size="sm" variant="secondary">Book space</Button></Link>
          </div>
        </Card>
        <Card title="Upcoming bookings">
          {upcoming.length === 0 ? <p>No upcoming bookings.</p> : (
            <ul>{upcoming.map((b) => <li key={b.id}>{new Date(b.startAt).toLocaleString()} — {b.resourceType}</li>)}</ul>
          )}
          <Link to="/bookings">View all</Link>
        </Card>
      </Grid>
    </>
  );
}
`,
  'book/BookDeskPage': `import React, { useState } from 'react';
import { PageHeader, Select, Input, Button, Card, useToast } from '@waypoint/ui';
import { useSpaces } from '../../hooks/useSpaces.js';
import { useBookings } from '../../hooks/useBookings.js';
import { addHours } from '@waypoint/shared';

export function BookDeskPage() {
  const { desks, loading } = useSpaces();
  const { create } = useBookings();
  const [deskId, setDeskId] = useState('');
  const [date, setDate] = useState('');
  const { push } = useToast();

  const bookable = desks.filter((d) => d.isBookable);

  const submit = async () => {
    const start = new Date(date);
    await create({ resourceType: 'desk', resourceId: deskId, startAt: start.toISOString(), endAt: addHours(start, 8).toISOString() });
    push('Desk booked!', 'success');
  };

  if (loading) return null;

  return (
    <>
      <PageHeader title="Book a desk" />
      <Card>
        <Select label="Desk" value={deskId} onChange={(e) => setDeskId(e.target.value)} options={[
          { value: '', label: 'Select desk...' },
          ...bookable.map((d) => ({ value: d.id, label: d.label })),
        ]} />
        <Input label="Date & time" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
        <Button onClick={submit} disabled={!deskId || !date}>Confirm booking</Button>
      </Card>
    </>
  );
}
`,
  'book/BookSpacePage': `import React, { useState } from 'react';
import { PageHeader, Select, Input, Button, Card, useToast } from '@waypoint/ui';
import { useSpaces } from '../../hooks/useSpaces.js';
import { useBookings } from '../../hooks/useBookings.js';
import { addHours } from '@waypoint/shared';

export function BookSpacePage() {
  const { spaces } = useSpaces();
  const { create } = useBookings();
  const [spaceId, setSpaceId] = useState('');
  const [date, setDate] = useState('');
  const { push } = useToast();

  const rooms = spaces.filter((s) => s.type === 'meeting_room' || s.type === 'phone_booth');

  const submit = async () => {
    const start = new Date(date);
    await create({ resourceType: 'space', resourceId: spaceId, startAt: start.toISOString(), endAt: addHours(start, 1).toISOString() });
    push('Space booked!', 'success');
  };

  return (
    <>
      <PageHeader title="Book a space" />
      <Card>
        <Select label="Space" value={spaceId} onChange={(e) => setSpaceId(e.target.value)} options={[
          { value: '', label: 'Select space...' },
          ...rooms.map((s) => ({ value: s.id, label: s.name })),
        ]} />
        <Input label="Start time" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
        <Button onClick={submit} disabled={!spaceId || !date}>Confirm booking</Button>
      </Card>
    </>
  );
}
`,
  'bookings/MyBookingsPage': `import React from 'react';
import { PageHeader, Table, Badge, Button, Spinner } from '@waypoint/ui';
import { useBookings } from '../../hooks/useBookings.js';

export function MyBookingsPage() {
  const { bookings, loading, cancel } = useBookings();
  if (loading) return <Spinner />;

  return (
    <>
      <PageHeader title="My bookings" />
      <Table
        columns={[
          { key: 'resourceType', header: 'Type' },
          { key: 'startAt', header: 'When', render: (r) => new Date(String(r.startAt)).toLocaleString() },
          { key: 'status', header: 'Status', render: (r) => <Badge>{String(r.status)}</Badge> },
          { key: 'actions', header: '', render: (r) => r.status === 'confirmed' ? <Button size="sm" variant="ghost" onClick={() => cancel(String(r.id))}>Cancel</Button> : null },
        ]}
        data={bookings as any}
      />
    </>
  );
}
`,
  'visitors/InviteVisitorPage': `import React, { useState } from 'react';
import { PageHeader, Input, Button, Card, useToast } from '@waypoint/ui';
import { useVisitors } from '../../hooks/useVisitors.js';
import { useAuth } from '../../hooks/useAuth.js';

export function InviteVisitorPage() {
  const { create } = useVisitors();
  const { user } = useAuth();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', expectedAt: '' });
  const { push } = useToast();

  const submit = async () => {
    if (!user) return;
    await create({ ...form, hostUserId: user.id, expectedAt: new Date(form.expectedAt).toISOString() });
    push('Visitor invited', 'success');
    setForm({ firstName: '', lastName: '', email: '', expectedAt: '' });
  };

  return (
    <>
      <PageHeader title="Invite a visitor" subtitle="Pre-register guests for a smooth check-in" />
      <Card>
        <Input label="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
        <Input label="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
        <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input label="Expected arrival" type="datetime-local" value={form.expectedAt} onChange={(e) => setForm({ ...form, expectedAt: e.target.value })} />
        <Button onClick={submit}>Send invitation</Button>
      </Card>
    </>
  );
}
`,
  'amenities/AmenitiesPage': `import React from 'react';
import { PageHeader, Card, Grid, Badge, Spinner } from '@waypoint/ui';
import { useAmenities } from '../../hooks/useAmenities.js';

export function AmenitiesPage() {
  const { amenities, loading } = useAmenities();
  if (loading) return <Spinner />;

  return (
    <>
      <PageHeader title="Amenities" subtitle="Available workplace amenities" />
      <Grid cols={3}>
        {amenities.map((a) => (
          <Card key={a.id} title={a.name}>
            <Badge>{a.type}</Badge>
            <p>Capacity: {a.capacity}</p>
          </Card>
        ))}
      </Grid>
    </>
  );
}
`,
  'directory/DirectoryPage': `import React, { useState } from 'react';
import { PageHeader, Input, Grid, Card, Avatar, Spinner } from '@waypoint/ui';
import { useDirectory } from '../../hooks/useDirectory.js';

export function DirectoryPage() {
  const { users, loading } = useDirectory();
  const [query, setQuery] = useState('');

  if (loading) return <Spinner />;

  const filtered = users.filter((u) => {
    const q = query.toLowerCase();
    return u.firstName.toLowerCase().includes(q) || u.lastName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  return (
    <>
      <PageHeader title="Employee directory" />
      <Input placeholder="Search by name or email..." value={query} onChange={(e) => setQuery(e.target.value)} />
      <Grid cols={2}>
        {filtered.map((u) => (
          <Card key={u.id}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Avatar name={\`\${u.firstName} \${u.lastName}\`} src={u.avatarUrl} />
              <div>
                <strong>{u.firstName} {u.lastName}</strong>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>{u.title ?? u.role} · {u.email}</p>
              </div>
            </div>
          </Card>
        ))}
      </Grid>
    </>
  );
}
`,
};

for (const [path, content] of Object.entries(portalPages)) {
  write(`apps/portal/src/pages/${path}.tsx`, content);
}

console.log('Generated web and portal apps');
