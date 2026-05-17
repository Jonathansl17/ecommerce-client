'use client';

import { useEffect, useState } from 'react';
import { usePasswordChange } from './usePasswordChange';
import { ChangePasswordDialogProps } from '../types/profile.interface';

function meetsRequirements(password: string) {
  return {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };
}

function isPasswordValid(password: string): boolean {
  const r = meetsRequirements(password);
  return r.minLength && r.uppercase && r.lowercase && r.number;
}

export function useChangePasswordForm({ isOpen, onClose, onSuccess }: ChangePasswordDialogProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const { changePassword, isLoading, error, confirmationLink, clearError, clearConfirmationLink } =
    usePasswordChange();

  useEffect(() => {
    if (isOpen) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordsMatch(true);
      clearError();
      clearConfirmationLink();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    if (confirmPassword) setPasswordsMatch(value === confirmPassword);
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setPasswordsMatch(newPassword === value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch || !isPasswordValid(newPassword)) return;

    const success = await changePassword({ currentPassword, newPassword });

    if (success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      if (!confirmationLink) {
        setTimeout(() => {
          onClose();
          onSuccess?.();
        }, 2000);
      }
    }
  };

  const handleClose = () => {
    onClose();
    onSuccess?.();
    clearConfirmationLink();
  };

  const handleCopyLink = async () => {
    if (confirmationLink) {
      await navigator.clipboard.writeText(confirmationLink);
    }
  };

  return {
    currentPassword,
    newPassword,
    confirmPassword,
    passwordsMatch,
    requirements: meetsRequirements(newPassword),
    canSubmit: !isLoading && !!currentPassword && isPasswordValid(newPassword) && !!confirmPassword && passwordsMatch,
    isLoading,
    error,
    confirmationLink,
    clearError,
    setCurrentPassword,
    handleNewPasswordChange,
    handleConfirmPasswordChange,
    handleSubmit,
    handleClose,
    handleCopyLink,
  };
}
