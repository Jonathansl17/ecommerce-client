import { Mail, User, Calendar } from 'lucide-react';
import { PROFILE_STRINGS, PROFILE_AVATAR_SIZE } from '@/features/clients/constants/clients.constants';

interface ProfileInfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  isBordered?: boolean;
}

export function ProfileInfoItem({ icon, label, value, isBordered = false }: ProfileInfoItemProps) {
  return (
    <div className={`flex items-center gap-4 ${isBordered ? 'pt-4 border-t border-border' : ''}`}>
      {icon}
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        {label === PROFILE_STRINGS.sections.userId.label ? (
          <p className="text-foreground font-mono text-sm">{value}</p>
        ) : (
          <p className="text-foreground font-medium">{value}</p>
        )}
      </div>
    </div>
  );
}

interface ProfileHeaderProps {
  initials: string;
  fullName: string;
  accountStatus: string;
}

export function ProfileHeader({ initials, fullName, accountStatus }: ProfileHeaderProps) {
  return (
    <div className="flex items-start gap-4 pb-6 border-b border-border">
      <div
        className={`flex items-center justify-center rounded-full bg-primary text-primary-foreground font-bold ${PROFILE_AVATAR_SIZE.detail.className}`}
      >
        {initials}
      </div>
      <div>
        <h2 className="text-2xl font-bold text-foreground">{fullName}</h2>
        <p className="text-sm text-muted-foreground">
          {PROFILE_STRINGS.sections.status.label}:{' '}
          <span className="capitalize font-medium text-foreground">{accountStatus}</span>
        </p>
      </div>
    </div>
  );
}

interface ProfileDetailsProps {
  email: string;
  createdAt?: string;
  userId?: string;
}

export function ProfileDetails({ email, createdAt, userId }: ProfileDetailsProps) {
  return (
    <div className="mt-6 space-y-4">
      {/* Email */}
      <ProfileInfoItem
        icon={<Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />}
        label={PROFILE_STRINGS.sections.email.label}
        value={email}
      />

      {/* Cuenta creada */}
      {createdAt && (
        <ProfileInfoItem
          icon={<Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0" />}
          label={PROFILE_STRINGS.sections.createdAt.label}
          value={createdAt}
        />
      )}

      {/* ID del usuario */}
      {userId && (
        <ProfileInfoItem
          icon={<User className="h-5 w-5 text-muted-foreground flex-shrink-0" />}
          label={PROFILE_STRINGS.sections.userId.label}
          value={userId}
          isBordered
        />
      )}
    </div>
  );
}

export function ProfileLoadingState() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-muted-foreground">{PROFILE_STRINGS.page.loadingText}</p>
      </div>
    </div>
  );
}
