'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { useDeactivateAccount } from '@/features/clients/hooks/useDeactivateAccount';
import { PROFILE_STRINGS } from '@/features/clients/constants/clients.constants';

interface DeactivateAccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'warning' | 'confirm';

const { deactivateDialog: S } = PROFILE_STRINGS;

export function DeactivateAccountDialog({ isOpen, onClose }: DeactivateAccountDialogProps) {
  const [step, setStep] = useState<Step>('warning');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const { deactivateAccount, logout, isLoading, error, clearError } = useDeactivateAccount();

  useEffect(() => {
    if (isOpen) {
      setStep('warning');
      setPassword('');
      setSuccess(false);
      clearError();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    const ok = await deactivateAccount({ password });
    if (ok) {
      setSuccess(true);
      setTimeout(() => {
        logout();
      }, 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border rounded-lg shadow-lg max-w-md w-full">
        {/* Encabezado */}
        <div className="border-b border-border px-6 py-4 flex items-center gap-3">
          <ShieldAlert className="h-5 w-5 text-destructive flex-shrink-0" />
          <h2 className="text-xl font-bold text-foreground">{S.title}</h2>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-4">
          {/* Estado de éxito */}
          {success && (
            <div className="flex gap-3 p-4 bg-green-500/10 border border-green-500 rounded-md">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-700">{S.successTitle}</p>
                <p className="text-sm text-green-600 mt-0.5">{S.successMessage}</p>
              </div>
            </div>
          )}

          {!success && step === 'warning' && (
            <>
              {/* Advertencia */}
              <div className="flex gap-3 p-4 bg-destructive/10 border border-destructive/40 rounded-md">
                <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-destructive mb-2">{S.step1Title}</p>
                  <p className="text-sm text-muted-foreground mb-3">{S.step1Warning}</p>
                  <ul className="space-y-1.5">
                    {S.consequences.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-destructive flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 text-sm font-medium text-foreground border border-input rounded-md hover:bg-accent transition-colors"
                >
                  {S.cancel}
                </button>
                <button
                  type="button"
                  onClick={() => setStep('confirm')}
                  className="flex-1 px-4 py-2 text-sm font-medium text-destructive border border-destructive rounded-md hover:bg-destructive/10 transition-colors"
                >
                  {S.continue}
                </button>
              </div>
            </>
          )}

          {!success && step === 'confirm' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-foreground">{S.step2Title}</p>
                <p className="text-sm text-muted-foreground mt-1">{S.step2Description}</p>
              </div>

              {/* Error */}
              {error && (
                <div className="flex gap-3 p-3 bg-destructive/10 border border-destructive rounded-md">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {S.passwordLabel}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={S.passwordPlaceholder}
                  required
                  autoFocus
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-destructive"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep('warning');
                    clearError();
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-foreground border border-input rounded-md hover:bg-accent transition-colors"
                >
                  {S.back}
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !password}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-destructive rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {isLoading ? S.confirming : S.confirm}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
