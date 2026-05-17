'use client';

import { useProfileEditForm } from '@/features/clients/hooks/useProfileEditForm';
import { PROFILE_STRINGS } from '@/features/clients/constants/clients.constants';
import { ProfileEditDialogProps } from '../types/profile.interface';
import { ProfileEditForm } from './ProfileEditDialog/ProfileEditForm';

export function ProfileEditDialog(props: ProfileEditDialogProps) {
  const form = useProfileEditForm(props);

  if (!props.isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border rounded-lg shadow-lg max-w-md w-full">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-xl font-bold text-foreground">{PROFILE_STRINGS.editDialog.title}</h2>
        </div>

        <ProfileEditForm
          fullName={form.fullName}
          email={form.email}
          password={form.password}
          successMessage={form.successMessage}
          isLoading={form.isLoading}
          error={form.error}
          canSubmit={form.canSubmit}
          onFullNameChange={form.setFullName}
          onEmailChange={form.setEmail}
          onPasswordChange={form.setPassword}
          onSubmit={form.handleSubmit}
          onClose={form.handleClose}
        />
      </div>
    </div>
  );
}
