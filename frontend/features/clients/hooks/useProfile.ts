'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import { ROUTES } from '@/lib/constants/routes.constants';
import { DATE_FORMAT_OPTIONS, UNAVAILABLE_TEXT } from '@/features/clients/constants/clients.constants';

export function useProfile() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [isAuthenticated, isLoading, router]);

  /**
   * Genera las iniciales del nombre del usuario
   */
  const getInitials = (fullName: string): string => {
    return fullName
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  /**
   * Formatea la fecha de creación de la cuenta
   */
  const getFormattedCreatedAt = (createdAt?: string): string => {
    if (!createdAt) return UNAVAILABLE_TEXT;
    return new Date(createdAt).toLocaleDateString('es-ES', DATE_FORMAT_OPTIONS);
  };

  return {
    isLoading,
    user,
    getInitials,
    getFormattedCreatedAt,
  };
}
