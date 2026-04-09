import { API_BASE_URL } from '@/lib/constants/api.constants';
import type {
  RegisterFormData,
  ApiErrorResponse,
  LoginFormData,
  LoginResponse,
} from '@/lib/types/auth.types';

async function extractApiError(res: Response): Promise<ApiErrorResponse> {
  const body = await res.json().catch(() => ({}));
  return body as ApiErrorResponse;
}

export async function registerUser(data: RegisterFormData): Promise<ApiErrorResponse | null> {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (res.status === 400) {
    const body: ApiErrorResponse = await res.json();
    return body;
  }

  if (!res.ok) {
    const body = await extractApiError(res);
    return { error: body.error };
  }

  return null;
}

export async function loginUser(data: LoginFormData): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const body = await extractApiError(res);
    throw body;
  }

  return res.json() as Promise<LoginResponse>;
}
