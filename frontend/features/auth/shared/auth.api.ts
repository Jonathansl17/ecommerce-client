import { apiFetch, ApiError } from '@/lib/http/apiFetch';
import { REQUEST_TIMEOUT_MS } from '@/lib/constants/api.constants';
import type {
  RegisterFormData,
  ApiErrorResponse,
  LoginFormData,
  LoginResponse,
  AuthUser,
  ReactivateAccountData,
} from '@/features/auth/types/auth.types';

export async function registerUser(data: RegisterFormData): Promise<ApiErrorResponse | null> {
  try {
    await apiFetch('/auth/register', {
      method: 'POST',
      body: data as unknown as Record<string, unknown>,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    return null;
  } catch (err) {
    if (err instanceof ApiError) {
      const body = (err.body ?? {}) as ApiErrorResponse;
      return { error: body.error, errors: body.errors };
    }
    throw err;
  }
}

export async function loginUser(data: LoginFormData): Promise<LoginResponse> {
  try {
    return await apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: data as unknown as Record<string, unknown>,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      skipAuthRetry: true,
    });
  } catch (err) {
    if (err instanceof ApiError) {
      throw (err.body ?? {}) as ApiErrorResponse;
    }
    throw err;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await apiFetch('/auth/logout', {
      method: 'POST',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      skipAuthRetry: true,
    });
  } catch {
    // best-effort: el contexto limpia el estado local de todos modos
  }
}

export async function reactivateAccount(data: ReactivateAccountData): Promise<void> {
  try {
    await apiFetch('/clients/reactivate', {
      method: 'POST',
      body: data as unknown as Record<string, unknown>,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      skipAuthRetry: true,
    });
  } catch (err) {
    if (err instanceof ApiError) {
      throw (err.body ?? {}) as ApiErrorResponse;
    }
    throw err;
  }
}

export async function fetchCurrentUser(signal?: AbortSignal): Promise<AuthUser | null> {
  try {
    const data = await apiFetch<{ usuario: AuthUser }>('/auth/me', {
      method: 'GET',
      signal,
      skipAuthRetry: false,
    });
    return data.usuario;
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return null;
    return null;
  }
}
