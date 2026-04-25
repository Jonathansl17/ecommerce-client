'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AUTH_STRINGS } from '@/features/auth/constants/auth.constants';
import { ROUTES } from '@/lib/constants/routes.constants';
import { validateLoginForm, getFieldError } from '@/features/auth/shared/auth.validation';
import { loginUser } from '@/features/auth/shared/auth.api';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import type { FieldError, LoginFormData, ApiErrorResponse } from '@/features/auth/types/auth.types';

const INITIAL_FORM_DATA: LoginFormData = {
  email: '',
  password: '',
};

export function useLoginForm() {
  const [formData, setFormData] = useState<LoginFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();

  function handleChange(field: keyof LoginFormData) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  function fieldError(field: string): string | undefined {
    return getFieldError(errors, field);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors([]);

    const validationErrors = validateLoginForm(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await loginUser(formData);
      auth.login(response.usuario);
      router.push(ROUTES.DASHBOARD);
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      if (apiError.errors && apiError.errors.length > 0) {
        setErrors(apiError.errors);
      } else if (apiError.error) {
        setErrors([{ field: 'general', message: AUTH_STRINGS.errors.invalidCredentials }]);
      } else {
        setErrors([{ field: 'general', message: AUTH_STRINGS.errors.connectionError }]);
      }
    } finally {
      setLoading(false);
    }
  }

  return {
    formData,
    loading,
    handleChange,
    handleSubmit,
    fieldError,
  };
}
