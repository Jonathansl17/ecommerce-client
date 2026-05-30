export interface RecoveryFieldError {
  field: string;
  message: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export interface PasswordRecoveryApiErrorResponse {
  errors?: RecoveryFieldError[];
  error?: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface ForgotPasswordFormProps {
  formData: ForgotPasswordFormData;
  loading: boolean;
  successMessage?: string;
  handleChange: (field: keyof ForgotPasswordFormData) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  fieldError: (field: string) => string | undefined;
}

export interface ResetPasswordFormProps {
  formData: ResetPasswordFormData;
  loading: boolean;
  validatingToken: boolean;
  isTokenValid: boolean;
  passwordsMatch: boolean;
  requirements: { minLength: boolean; uppercase: boolean; lowercase: boolean; number: boolean };
  canSubmit: boolean;
  successMessage?: string;
  generalMessage?: string;
  handleChange: (field: keyof ResetPasswordFormData) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  fieldError: (field: string) => string | undefined;
}
