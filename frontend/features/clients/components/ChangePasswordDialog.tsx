'use client';

import { useChangePasswordForm } from '@/features/clients/hooks/useChangePasswordForm';
import { PROFILE_STRINGS } from '@/features/clients/constants/clients.constants';
import { ChangePasswordDialogProps } from '../types/profile.interface';
import { ChangePasswordForm } from './ChangePasswordDialog/ChangePasswordForm';
import { ConfirmationLinkCard } from './ChangePasswordDialog/ConfirmationLinkCard';

export function ChangePasswordDialog(props: ChangePasswordDialogProps) {
  const form = useChangePasswordForm(props);

  if (!props.isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border rounded-lg shadow-lg max-w-md w-full">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-xl font-bold text-foreground">{PROFILE_STRINGS.passwordDialog.title}</h2>
        </div>

        <div className="p-6 space-y-4">
          {form.confirmationLink ? (
            <ConfirmationLinkCard
              onClose={form.handleClose}
            />
          ) : (
            <ChangePasswordForm
              currentPassword={form.currentPassword}
              newPassword={form.newPassword}
              confirmPassword={form.confirmPassword}
              passwordsMatch={form.passwordsMatch}
              reqs={form.requirements}
              canSubmit={form.canSubmit}
              isLoading={form.isLoading}
              error={form.error}
              clearError={form.clearError}
              onCurrentPasswordChange={form.setCurrentPassword}
              onNewPasswordChange={form.handleNewPasswordChange}
              onConfirmPasswordChange={form.handleConfirmPasswordChange}
              onSubmit={form.handleSubmit}
              onCancel={props.onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}
