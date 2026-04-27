import { PROFILE_STRINGS, PROFILE_AVATAR_SIZE } from '@/features/clients/constants/clients.constants';
import { ProfileHeaderProps } from '@/features/clients/types/profile.interface';

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
