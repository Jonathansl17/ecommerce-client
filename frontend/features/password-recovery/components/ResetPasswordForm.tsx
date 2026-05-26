'use client';

import Link from 'next/link';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { PASSWORD_RECOVERY_STRINGS } from '@/features/password-recovery/constants/password-recovery.constants';
import { PROFILE_STRINGS } from '@/features/clients/constants/clients.constants';
import { ROUTES } from '@/lib/constants/routes.constants';
import type { ResetPasswordFormProps } from '@/features/password-recovery/types/password-recovery.types';

const strings = PASSWORD_RECOVERY_STRINGS.resetPassword;
const { requirements: reqStrings, passwordMismatch, passwordPlaceholder } = PROFILE_STRINGS.passwordDialog;

function RequirementRow({ met, text }: { met: boolean; text: string }) {
  return (
    <li className={`flex items-center gap-1.5 text-xs ${met ? 'text-green-600' : 'text-muted-foreground'}`}>
      <CheckCircle className={`h-3.5 w-3.5 flex-shrink-0 ${met ? 'text-green-600' : 'text-muted-foreground/40'}`} />
      {text}
    </li>
  );
}

export function ResetPasswordForm({
  formData,
  loading,
  validatingToken,
  passwordsMatch,
  requirements,
  canSubmit,
  successMessage,
  generalMessage,
  handleChange,
  handleSubmit,
  fieldError,
}: ResetPasswordFormProps) {
  const generalError = fieldError('general') || generalMessage;

  return (
    <AuthLayout title={strings.title} subtitle={strings.subtitle}>
      {generalError && (
        <div className="flex gap-3 p-3 bg-destructive/10 border border-destructive rounded-md">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{generalError}</p>
        </div>
      )}

      {successMessage && (
        <div className="flex gap-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-md">
          <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-emerald-900">{successMessage}</p>
        </div>
      )}

      {!successMessage && (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {strings.passwordLabel}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              placeholder={passwordPlaceholder}
              autoComplete="new-password"
              required
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {fieldError('password') && (
              <p className="text-xs text-destructive mt-1">{fieldError('password')}</p>
            )}
            {formData.password && (
              <ul className="mt-2 space-y-1">
                <RequirementRow met={requirements.minLength} text={reqStrings.minLength} />
                <RequirementRow met={requirements.uppercase} text={reqStrings.uppercase} />
                <RequirementRow met={requirements.lowercase} text={reqStrings.lowercase} />
                <RequirementRow met={requirements.number} text={reqStrings.number} />
              </ul>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {strings.confirmPasswordLabel}
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              placeholder={passwordPlaceholder}
              autoComplete="new-password"
              required
              className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                !passwordsMatch && formData.confirmPassword ? 'border-destructive focus:ring-destructive' : 'border-input'
              }`}
            />
            {!passwordsMatch && formData.confirmPassword && (
              <p className="text-xs text-destructive mt-1">{passwordMismatch}</p>
            )}
            {fieldError('confirmPassword') && (
              <p className="text-xs text-destructive mt-1">{fieldError('confirmPassword')}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading || validatingToken
              ? validatingToken ? strings.validatingToken : strings.submittingButton
              : strings.submitButton}
          </button>
        </form>
      )}

      <p className="text-center text-sm text-foreground/70">
        <Link href={ROUTES.LOGIN} className="font-medium text-foreground underline">
          {strings.backToLogin}
        </Link>
      </p>
    </AuthLayout>
  );
}
