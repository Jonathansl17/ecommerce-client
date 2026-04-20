'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AUTH_STORAGE_KEYS } from '@/features/auth/constants/auth.constants';
import { ROUTES } from '@/lib/constants/routes.constants';
import { logoutUser } from '@/features/auth/shared/auth.api';
import type { AuthContextValue, AuthProviderProps, AuthUser } from '@/features/auth/types/auth.types';

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEYS.USER);

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser({ ...(JSON.parse(storedUser) as AuthUser) });
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
        localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
      }
    }

    setIsLoading(false);
  }, []);

  const login = useCallback((newToken: string, newUser: AuthUser) => {
    localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, newToken);
    localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(async () => {
    if (token) {
      try {
        await logoutUser(token);
      } catch {
        // Best-effort: siempre limpiar estado local aunque falle el servidor
      }
    }

    localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
    setToken(null);
    setUser(null);
    router.push(ROUTES.LOGIN);
  }, [router, token]);

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
