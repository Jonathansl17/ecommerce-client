'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/AuthContext';

export function useProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();

  /**
   * Cerrar el dropdown cuando se hace clic fuera
   */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  /**
   * Alterna el estado del dropdown
   */
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  /**
   * Cierra el dropdown
   */
  const closeDropdown = () => {
    setIsOpen(false);
  };

  /**
   * Ejecuta logout y cierra el dropdown
   */
  const handleLogout = async () => {
    closeDropdown();
    await logout();
  };

  return {
    isOpen,
    dropdownRef,
    toggleDropdown,
    closeDropdown,
    handleLogout,
  };
}
