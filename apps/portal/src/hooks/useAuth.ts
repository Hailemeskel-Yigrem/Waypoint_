import { useCallback, useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout, type AuthResponse } from '../api/auth.js';

interface AuthState {
  user: AuthResponse['user'] | null;
  loading: boolean;
}

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
