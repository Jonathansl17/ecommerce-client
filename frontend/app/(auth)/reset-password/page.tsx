'use client';

import { useSearchParams } from 'next/navigation';
import { ResetPasswordForm } from '@/features/password-recovery/components/ResetPasswordForm';
import { useResetPasswordForm } from '@/features/password-recovery/hooks/useResetPasswordForm';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const {
    formData,
    loading,
    validatingToken,
    isTokenValid,
    passwordsMatch,
    requirements,
    canSubmit,
    successMessage,
    generalMessage,
    handleChange,
    handleSubmit,
    fieldError,
  } = useResetPasswordForm(token);

  return (
    <ResetPasswordForm
      formData={formData}
      loading={loading}
      validatingToken={validatingToken}
      isTokenValid={isTokenValid}
      passwordsMatch={passwordsMatch}
      requirements={requirements}
      canSubmit={canSubmit}
      successMessage={successMessage}
      generalMessage={generalMessage}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      fieldError={fieldError}
    />
  );
}
