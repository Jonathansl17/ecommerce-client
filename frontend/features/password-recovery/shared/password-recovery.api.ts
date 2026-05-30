import { apiFetch } from '@/lib/http/apiFetch';
import { REQUEST_TIMEOUT_MS } from '@/lib/constants/api.constants';
import type {
  ForgotPasswordFormData,
  ForgotPasswordResponse,
  ResetPasswordFormData,
  ResetPasswordResponse,
} from '@/features/password-recovery/types/password-recovery.types';

const PASSWORD_RECOVERY_TIMEOUT_MS = 30_000;

export async function requestPasswordRecovery(
  data: ForgotPasswordFormData,
): Promise<ForgotPasswordResponse> {
  return apiFetch<ForgotPasswordResponse>('/password-recovery/request', {
    method: 'POST',
    body: data as unknown as Record<string, unknown>,
    signal: AbortSignal.timeout(PASSWORD_RECOVERY_TIMEOUT_MS),
    skipAuthRetry: true,
  });
}

export async function validatePasswordRecoveryToken(token: string): Promise<void> {
  return apiFetch('/password-recovery/validate-token', {
    method: 'POST',
    body: { token },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    skipAuthRetry: true,
  });
}

export async function resetPassword(
  data: ResetPasswordFormData & { token: string },
): Promise<ResetPasswordResponse> {
  return apiFetch<ResetPasswordResponse>('/password-recovery/reset', {
    method: 'POST',
    body: data as unknown as Record<string, unknown>,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    skipAuthRetry: true,
  });
}
