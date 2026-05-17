'use client';

import { AlertCircle, CheckCircle } from 'lucide-react';
import { PROFILE_STRINGS } from '@/features/clients/constants/clients.constants';
import { ProfileEditFormProps } from '../../types/profile.interface';

const { editDialog } = PROFILE_STRINGS;

export function ProfileEditForm({
  fullName,
  email,
  password,
  successMessage,
  isLoading,
  error,
  canSubmit,
  onFullNameChange,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onClose,
}: ProfileEditFormProps) {
  return (
    <form onSubmit={onSubmit} className="p-6 space-y-4">
      {error && (
        <div className="flex gap-3 p-3 bg-destructive/10 border border-destructive rounded-md">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="flex gap-3 p-3 bg-green-500/10 border border-green-500 rounded-md">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-600">{successMessage}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">{editDialog.fullNameLabel}</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => onFullNameChange(e.target.value)}
          minLength={2}
          maxLength={100}
          required
          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">{editDialog.emailLabel}</label>
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">{editDialog.passwordLabel}</label>
        <input
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder={editDialog.passwordPlaceholder}
          required
          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <p className="text-xs text-muted-foreground mt-1">{editDialog.passwordHint}</p>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 text-sm font-medium text-foreground border border-input rounded-md hover:bg-accent transition-colors"
        >
          {editDialog.cancel}
        </button>
        <button
          type="submit"
          disabled={!canSubmit}
          className="flex-1 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {isLoading ? editDialog.saving : editDialog.save}
        </button>
      </div>
    </form>
  );
}
