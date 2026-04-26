'use client';

import { useProfileDropdown } from '@/features/clients/hooks/useProfileDropdown';
import { ProfileDropdownView } from './ProfileDropdownView';

interface ProfileDropdownProps {
  initials: string;
}

export function ProfileDropdown({ initials }: ProfileDropdownProps) {
  const { isOpen, dropdownRef, toggleDropdown, closeDropdown, handleLogout } = useProfileDropdown();

  return (
    <ProfileDropdownView
      initials={initials}
      isOpen={isOpen}
      dropdownRef={dropdownRef}
      toggleDropdown={toggleDropdown}
      closeDropdown={closeDropdown}
      handleLogout={handleLogout}
    />
  );
}
