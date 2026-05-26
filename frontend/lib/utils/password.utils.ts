import type { PasswordRequirements } from '@/features/clients/types/profile.interface';

export function meetsRequirements(password: string): PasswordRequirements {
  return {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };
}

export function isPasswordValid(password: string): boolean {
  const r = meetsRequirements(password);
  return r.minLength && r.uppercase && r.lowercase && r.number;
}
