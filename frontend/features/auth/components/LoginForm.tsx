import Link from 'next/link';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthField } from '@/components/auth/AuthField';
import { FormGeneralError } from '@/components/auth/FormGeneralError';
import { Button } from '@/components/ui/Button';
import { AUTH_STRINGS } from '@/features/auth/constants/auth.constants';
import { ROUTES } from '@/lib/constants/routes.constants';
import type { LoginFormProps } from '@/features/auth/types/auth.types';

const strings = AUTH_STRINGS.login;
const inactiveStrings = AUTH_STRINGS.inactiveAccount;

export function LoginForm({
  formData,
  loading,
  handleChange,
  handleSubmit,
  fieldError,
  isAccountInactive,
  reactivating,
  reactivationSuccess,
  onReactivate,
  onCancelReactivation,
}: LoginFormProps) {
  return (
    <AuthLayout title={strings.title} subtitle={strings.subtitle}>
      {/* Panel de cuenta reactivada con éxito */}
      {reactivationSuccess && (
        <div className="flex items-start gap-3 p-4 mb-4 bg-green-500/10 border border-green-500 rounded-md">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-700 font-medium">{inactiveStrings.successMessage}</p>
        </div>
      )}

      {/* Panel de cuenta inactiva */}
      {isAccountInactive && (
        <div className="mb-4 border border-destructive/40 rounded-md bg-destructive/5 p-4 space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-destructive">{inactiveStrings.title}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{inactiveStrings.description}</p>
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onCancelReactivation}
              className="flex-1 px-3 py-2 text-sm font-medium text-foreground border border-input rounded-md hover:bg-accent transition-colors"
            >
              {inactiveStrings.cancelButton}
            </button>
            <button
              type="button"
              onClick={onReactivate}
              disabled={reactivating}
              className="flex-1 px-3 py-2 text-sm font-medium text-white bg-destructive rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {reactivating ? inactiveStrings.reactivatingButton : inactiveStrings.reactivateButton}
            </button>
          </div>
        </div>
      )}

      <FormGeneralError message={fieldError('general')} />

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <AuthField
          id="email"
          label={strings.emailLabel}
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          placeholder={strings.emailPlaceholder}
          autoComplete="email"
          error={fieldError('email')}
        />

        <AuthField
          id="password"
          label={strings.passwordLabel}
          type="password"
          value={formData.password}
          onChange={handleChange('password')}
          placeholder={strings.passwordPlaceholder}
          autoComplete="current-password"
          error={fieldError('password')}
        />

        <div className="text-right text-sm">
          <Link
            href={ROUTES.FORGOT_PASSWORD}
            className="font-medium text-foreground underline"
          >
            {strings.forgotPasswordLink}
          </Link>
        </div>

        <Button
          type="submit"
          isLoading={loading}
          loadingText={strings.submittingButton}
        >
          {strings.submitButton}
        </Button>
      </form>

      <div className="space-y-2 text-center text-sm text-foreground/70">
        <p>
          {strings.noAccountText}{' '}
          <Link href={ROUTES.REGISTER} className="font-medium text-foreground underline">
            {strings.registerLink}
          </Link>
        </p>
        <p>
          <Link href={ROUTES.DASHBOARD} className="font-medium text-foreground/50 hover:text-foreground underline transition-colors">
            {strings.backToStore}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
