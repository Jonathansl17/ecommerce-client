'use client';

import { useState } from 'react';
import { apiFetch, ApiError } from '@/lib/http/apiFetch';
import { extractErrorMessage } from '@/lib/http/extractErrorMessage';
import { ChangePasswordData, PasswordChangeResponse } from '../types/profile.interface';
import { CLIENT_API, PROFILE_ERROR_MESSAGES } from '../constants/clients.constants';

export function usePasswordChange() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationLink, setConfirmationLink] = useState<string | null>(null);

  const changePassword = async (data: ChangePasswordData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setConfirmationLink(null);

    try {
      const result = await apiFetch<PasswordChangeResponse>(CLIENT_API.password, {
        method: 'PUT',
        body: data as unknown as Record<string, unknown>,
        signal: AbortSignal.timeout(10_000),
      });

      if (result.confirmationLink) {
        setConfirmationLink(result.confirmationLink);
      }

      return true;
    } catch (err) {
      if (err instanceof ApiError) {
        setError(extractErrorMessage(err.body, PROFILE_ERROR_MESSAGES.changePassword));
      } else {
        setError(err instanceof Error ? err.message : PROFILE_ERROR_MESSAGES.unknown);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    changePassword,
    isLoading,
    error,
    confirmationLink,
    clearError: () => setError(null),
    clearConfirmationLink: () => setConfirmationLink(null),
  };
}
