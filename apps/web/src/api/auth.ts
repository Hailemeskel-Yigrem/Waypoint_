import { apiRequest, setAuthToken } from './client.js';
import type { LoginInput } from '@waypoint/shared';

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    orgId: string;
  };
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  const data = await apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  setAuthToken(data.token);
  return data;
}

export function logout(): void {
  setAuthToken(null);
}
