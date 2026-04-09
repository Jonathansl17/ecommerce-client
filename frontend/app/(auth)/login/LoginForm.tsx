import Link from 'next/link';
import { AuthLayout } from '@/components/ui/AuthLayout';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AUTH_STRINGS } from '@/lib/constants/auth.constants';
import { ROUTES } from '@/lib/constants/routes.constants';
import type { LoginFormData } from '@/lib/types/auth.types';

const strings = AUTH_STRINGS.login;

interface LoginFormProps {
  formData: LoginFormData;
  loading: boolean;
  handleChange: (field: keyof LoginFormData) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  fieldError: (field: string) => string | undefined;
}

export function LoginForm({
  formData,
  loading,
  handleChange,
  handleSubmit,
  fieldError,
}: LoginFormProps) {
  const generalError = fieldError('general');

  return (
    <AuthLayout title={strings.title} subtitle={strings.subtitle}>
      {generalError && (
        <p role="alert" aria-live="assertive" className="text-center text-sm text-red-500">
          {generalError}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormField
          id="email"
          label={strings.emailLabel}
          error={fieldError('email')}
        >
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            placeholder={strings.emailPlaceholder}
            hasError={!!fieldError('email')}
            aria-describedby={fieldError('email') ? 'email-error' : undefined}
            autoComplete="email"
          />
        </FormField>

        <FormField
          id="password"
          label={strings.passwordLabel}
          error={fieldError('password')}
        >
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange('password')}
            placeholder={strings.passwordPlaceholder}
            hasError={!!fieldError('password')}
            aria-describedby={fieldError('password') ? 'password-error' : undefined}
            autoComplete="current-password"
          />
        </FormField>

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
