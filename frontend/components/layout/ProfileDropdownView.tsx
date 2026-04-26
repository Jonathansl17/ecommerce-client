'use client';

import Link from 'next/link';
import { LogOut, User } from 'lucide-react';
import { PROFILE_STRINGS } from '@/features/clients/constants/clients.constants';
import { ROUTES } from '@/lib/constants/routes.constants';

interface ProfileDropdownViewProps {
  initials: string;
  isOpen: boolean;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  toggleDropdown: () => void;
  closeDropdown: () => void;
  handleLogout: () => void;
}

export function ProfileDropdownView({
  initials,
  isOpen,
  dropdownRef,
  toggleDropdown,
  closeDropdown,
  handleLogout,
}: ProfileDropdownViewProps) {
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón del avatar */}
      <button
        onClick={toggleDropdown}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
        aria-label={PROFILE_STRINGS.dropdown.ariaLabel}
        aria-expanded={isOpen}
      >
        {initials}
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md border border-border bg-background shadow-lg z-50">
          {/* Opciones del menú */}
          <div className="py-2">
            <Link
              href={ROUTES.PROFILE}
              onClick={closeDropdown}
              className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <User className="h-4 w-4" />
              <span>{PROFILE_STRINGS.dropdown.myProfile}</span>
            </Link>
          </div>

          {/* Botón de logout */}
          <div className="border-t border-border py-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>{PROFILE_STRINGS.dropdown.logout}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
