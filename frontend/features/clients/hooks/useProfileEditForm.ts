'use client';

import { useEffect, useState } from 'react';
import { useProfileEdit } from './useProfileEdit';
import { ProfileEditDialogProps } from '../types/profile.interface';
import { PROFILE_STRINGS, PROFILE_REDIRECT_DELAY_MS } from '../constants/clients.constants';

export function useProfileEditForm({
  isOpen,
  onClose,
  fullName: currentFullName,
  email: currentEmail,
  onSuccess,
}: ProfileEditDialogProps) {
  const [fullName, setFullName] = useState(currentFullName);
  const [email, setEmail] = useState(currentEmail);
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { updateProfile, isLoading, error, clearError } = useProfileEdit();

  useEffect(() => {
    if (isOpen) {
      setFullName(currentFullName);
      setEmail(currentEmail);
      setPassword('');
      setSuccessMessage(null);
      clearError();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleClose = () => {
    onClose();
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);

    const success = await updateProfile({
      fullName: fullName.trim() !== currentFullName ? fullName.trim() : undefined,
      email: email.trim() !== currentEmail ? email.trim() : undefined,
      password,
    });

    if (success) {
      setSuccessMessage(PROFILE_STRINGS.editDialog.successMessage);
      setPassword('');
      setTimeout(() => {
        onClose();
        onSuccess?.();
      }, PROFILE_REDIRECT_DELAY_MS);
    }
  };

  return {
    fullName,
    email,
    password,
    successMessage,
    isLoading,
    error,
    canSubmit: !isLoading && !!password && !!fullName.trim() && !!email.trim(),
    setFullName,
    setEmail,
    setPassword,
    handleClose,
    handleSubmit,
  };
}
