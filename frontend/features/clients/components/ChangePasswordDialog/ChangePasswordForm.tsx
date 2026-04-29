'use client';

import { AlertCircle, CheckCircle } from 'lucide-react';
import { PROFILE_STRINGS } from '@/features/clients/constants/clients.constants';
import { ChangePasswordFormProps, RequirementRowProps } from '../../types/profile.interface';

const { passwordDialog } = PROFILE_STRINGS;
const { requirements } = passwordDialog;

function RequirementRow({ met, text }: RequirementRowProps) {
  return (
    <li className={`flex items-center gap-1.5 text-xs ${met ? 'text-green-600' : 'text-muted-foreground'}`}>
      <CheckCircle className={`h-3.5 w-3.5 flex-shrink-0 ${met ? 'text-green-600' : 'text-muted-foreground/40'}`} />
      {text}
    </li>
  );
}

export function ChangePasswordForm({
  currentPassword,
  newPassword,
  confirmPassword,
  passwordsMatch,
  reqs,
  canSubmit,
  isLoading,
  error,
  clearError,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  onCancel,
}: ChangePasswordFormProps) {
  return (
    <>
      {error && (
        <div className="flex gap-3 p-3 bg-destructive/10 border border-destructive rounded-md">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {passwordDialog.currentPasswordLabel}
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => onCurrentPasswordChange(e.target.value)}
            placeholder={passwordDialog.passwordPlaceholder}
            required
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {passwordDialog.newPasswordLabel}
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => onNewPasswordChange(e.target.value)}
            placeholder={passwordDialog.passwordPlaceholder}
            required
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {newPassword && (
            <ul className="mt-2 space-y-1">
              <RequirementRow met={reqs.minLength} text={requirements.minLength} />
              <RequirementRow met={reqs.uppercase} text={requirements.uppercase} />
              <RequirementRow met={reqs.lowercase} text={requirements.lowercase} />
              <RequirementRow met={reqs.number} text={requirements.number} />
            </ul>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {passwordDialog.confirmPasswordLabel}
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            placeholder={passwordDialog.passwordPlaceholder}
            required
            className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
              !passwordsMatch && confirmPassword ? 'border-destructive focus:ring-destructive' : 'border-input'
            }`}
          />
          {!passwordsMatch && confirmPassword && (
            <p className="text-xs text-destructive mt-1">{passwordDialog.passwordMismatch}</p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => { onCancel(); clearError(); }}
            className="flex-1 px-4 py-2 text-sm font-medium text-foreground border border-input rounded-md hover:bg-accent transition-colors"
          >
            {passwordDialog.cancel}
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="flex-1 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {isLoading ? passwordDialog.changing : passwordDialog.change}
          </button>
        </div>
      </form>
    </>
  );
}
