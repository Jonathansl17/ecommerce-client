export interface ProfilePageViewProps {
  initials: string;
  fullName: string;
  email: string;
  accountStatus: string;
  formattedCreatedAt: string;
  userId: string;
}
export interface ProfileDropdownProps {
  initials: string;
}

export interface ProfileDropdownViewProps {
  initials: string;
  isOpen: boolean;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  toggleDropdown: () => void;
  closeDropdown: () => void;
  handleLogout: () => void;
}

export interface ProfileDetailsProps {
  email: string;
  createdAt?: string;
  userId?: string;
}
export interface ProfileHeaderProps {
  initials: string;
  fullName: string;
  accountStatus: string;
}

export interface ProfileInfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  isBordered?: boolean;
  isMonospace?: boolean;
}
