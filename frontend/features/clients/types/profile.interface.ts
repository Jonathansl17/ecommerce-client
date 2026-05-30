export interface ProfilePageViewProps {
  initials: string;
  fullName: string;
  email: string;
  accountStatus: string;
  formattedCreatedAt: string;
  userId: string;
  isEditDialogOpen: boolean;
  isPasswordDialogOpen: boolean;
  isDeactivateDialogOpen: boolean;
  onOpenEditDialog: () => void;
  onOpenPasswordDialog: () => void;
  onOpenDeactivateDialog: () => void;
  onCloseEditDialog: () => void;
  onClosePasswordDialog: () => void;
  onCloseDeactivateDialog: () => void;
  onProfileUpdated: () => void;
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

export interface RequirementRowProps {
  met: boolean;
  text: string;
}

export interface ChangePasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export interface ProfileEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  fullName: string;
  email: string;
  onSuccess?: () => void;
}

export interface PasswordRequirements {
  minLength: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
}

export interface ChangePasswordFormProps {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  passwordsMatch: boolean;
  reqs: PasswordRequirements;
  canSubmit: boolean;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  onCurrentPasswordChange: (v: string) => void;
  onNewPasswordChange: (v: string) => void;
  onConfirmPasswordChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export interface ConfirmationLinkCardProps {
  confirmationLink: string;
  onCopy: () => void;
  onClose: () => void;
}

export interface ProfileEditFormProps {
  fullName: string;
  email: string;
  password: string;
  successMessage: string | null;
  isLoading: boolean;
  error: string | null;
  canSubmit: boolean;
  onFullNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface PasswordChangeResponse {
  message: string;
  confirmationLink?: string;
}
export interface UpdateProfileData {
  fullName?: string;
  email?: string;
  password: string;
}

export interface UpdateProfileResponse {
  message: string;
  cliente: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface DeactivateAccountData {
  password: string;
}