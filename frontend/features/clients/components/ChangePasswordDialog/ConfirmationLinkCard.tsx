'use client';

import { CheckCircle } from 'lucide-react';
import { ConfirmationLinkCardProps } from '../../types/profile.interface';

export function ConfirmationLinkCard({ onClose }: Omit<ConfirmationLinkCardProps, 'confirmationLink' | 'onCopy'>) {
  return (
    <>
      <div className="flex gap-3 p-3 bg-blue-500/10 border border-blue-500 rounded-md">
        <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-blue-600 font-medium">¡Contraseña cambiada exitosamente!</p>
          <p className="text-xs text-blue-600 mt-1">Tu contraseña ha sido actualizada correctamente.</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="w-full px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:opacity-90 transition-opacity"
      >
        Cerrar
      </button>
    </>
  );
}
