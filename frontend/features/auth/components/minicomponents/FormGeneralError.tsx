import type { FormGeneralErrorProps } from '@/features/auth/types/auth.types';

export function FormGeneralError({ message }: FormGeneralErrorProps) {
  if (!message) return null;

  return (
    <p role="alert" aria-live="assertive" className="text-center text-sm text-red-500">
      {message}
    </p>
  );
}
