'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Copy } from 'lucide-react';
import { usePasswordChange } from '@/features/clients/hooks/usePasswordChange';
import { PROFILE_STRINGS } from '@/features/clients/constants/clients.constants';

interface ChangePasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const { requirements } = PROFILE_STRINGS.passwordDialog;

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

interface RequirementRowProps {
  met: boolean;
  text: string;
}

function RequirementRow({ met, text }: RequirementRowProps) {
  return (
    <li className={`flex items-center gap-1.5 text-xs ${met ? 'text-green-600' : 'text-muted-foreground'}`}>
      <CheckCircle className={`h-3.5 w-3.5 flex-shrink-0 ${met ? 'text-green-600' : 'text-muted-foreground/40'}`} />
      {text}
    </li>
  );
}

export function ChangePasswordDialog({ isOpen, onClose, onSuccess }: ChangePasswordDialogProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const { changePassword, isLoading, error, confirmationLink, clearError, clearConfirmationLink } =
    usePasswordChange();

  // Reset all state whenever the dialog opens
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
      // confirmationLink is shown in-dialog; auto-close handled by the close button
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

  if (!isOpen) return null;

  const req = meetsRequirements(newPassword);
  const canSubmit =
    !isLoading &&
    !!currentPassword &&
    isPasswordValid(newPassword) &&
    !!confirmPassword &&
    passwordsMatch;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border rounded-lg shadow-lg max-w-md w-full">
        {/* Encabezado */}
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-xl font-bold text-foreground">{PROFILE_STRINGS.passwordDialog.title}</h2>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-4">
          {/* Error */}
          {error && (
            <div className="flex gap-3 p-3 bg-destructive/10 border border-destructive rounded-md">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Enlace de confirmación */}
          {confirmationLink && (
            <div className="flex gap-3 p-3 bg-blue-500/10 border border-blue-500 rounded-md">
              <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-blue-600 font-medium mb-2">¡Contraseña cambiada!</p>
                <p className="text-xs text-blue-600 mb-2">Enlace de confirmación:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={confirmationLink}
                    readOnly
                    className="flex-1 px-2 py-1 text-xs bg-background border border-input rounded text-foreground font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-2 py-1 bg-blue-600 text-white rounded hover:opacity-90 transition-opacity"
                    title="Copiar enlace"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Formulario */}
          {!confirmationLink && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Contraseña actual */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {PROFILE_STRINGS.passwordDialog.currentPasswordLabel}
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder={PROFILE_STRINGS.passwordDialog.passwordPlaceholder}
                  required
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Nueva contraseña */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {PROFILE_STRINGS.passwordDialog.newPasswordLabel}
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => handleNewPasswordChange(e.target.value)}
                  placeholder={PROFILE_STRINGS.passwordDialog.passwordPlaceholder}
                  required
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {newPassword && (
                  <ul className="mt-2 space-y-1">
                    <RequirementRow met={req.minLength} text={requirements.minLength} />
                    <RequirementRow met={req.uppercase} text={requirements.uppercase} />
                    <RequirementRow met={req.lowercase} text={requirements.lowercase} />
                    <RequirementRow met={req.number} text={requirements.number} />
                  </ul>
                )}
              </div>

              {/* Confirmar contraseña */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {PROFILE_STRINGS.passwordDialog.confirmPasswordLabel}
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                  placeholder={PROFILE_STRINGS.passwordDialog.passwordPlaceholder}
                  required
                  className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                    !passwordsMatch && confirmPassword
                      ? 'border-destructive focus:ring-destructive'
                      : 'border-input'
                  }`}
                />
                {!passwordsMatch && confirmPassword && (
                  <p className="text-xs text-destructive mt-1">
                    {PROFILE_STRINGS.passwordDialog.passwordMismatch}
                  </p>
                )}
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    clearError();
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-foreground border border-input rounded-md hover:bg-accent transition-colors"
                >
                  {PROFILE_STRINGS.passwordDialog.cancel}
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="flex-1 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {isLoading ? PROFILE_STRINGS.passwordDialog.changing : PROFILE_STRINGS.passwordDialog.change}
                </button>
              </div>
            </form>
          )}

          {/* Botón de cierre cuando se muestra el confirmationLink */}
          {confirmationLink && (
            <button
              type="button"
              onClick={handleClose}
              className="w-full px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:opacity-90 transition-opacity"
            >
              Cerrar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
