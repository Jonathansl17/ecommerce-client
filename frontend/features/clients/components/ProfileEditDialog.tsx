'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useProfileEdit } from '@/features/clients/hooks/useProfileEdit';
import { PROFILE_STRINGS } from '@/features/clients/constants/clients.constants';

interface ProfileEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  fullName: string;
  email: string;
  onSuccess?: () => void;
}

export function ProfileEditDialog({
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

  // Sync form values whenever the dialog opens or the user data changes
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
      }, 1500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border rounded-lg shadow-lg max-w-md w-full">
        {/* Encabezado */}
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-xl font-bold text-foreground">{PROFILE_STRINGS.editDialog.title}</h2>
        </div>

        {/* Contenido */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error */}
          {error && (
            <div className="flex gap-3 p-3 bg-destructive/10 border border-destructive rounded-md">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Éxito */}
          {successMessage && (
            <div className="flex gap-3 p-3 bg-green-500/10 border border-green-500 rounded-md">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-600">{successMessage}</p>
            </div>
          )}

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {PROFILE_STRINGS.editDialog.fullNameLabel}
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              minLength={2}
              maxLength={100}
              required
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {PROFILE_STRINGS.editDialog.emailLabel}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Contraseña actual */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {PROFILE_STRINGS.editDialog.passwordLabel}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={PROFILE_STRINGS.editDialog.passwordPlaceholder}
              required
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {PROFILE_STRINGS.editDialog.passwordHint}
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-foreground border border-input rounded-md hover:bg-accent transition-colors"
            >
              {PROFILE_STRINGS.editDialog.cancel}
            </button>
            <button
              type="submit"
              disabled={isLoading || !password || !fullName.trim() || !email.trim()}
              className="flex-1 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {isLoading ? PROFILE_STRINGS.editDialog.saving : PROFILE_STRINGS.editDialog.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
