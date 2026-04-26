import { Mail, User, Calendar } from 'lucide-react';
import { PROFILE_STRINGS } from '@/features/clients/constants/clients.constants';
import { ProfileInfoItem } from './ProfileInfoItem';

interface ProfileDetailsProps {
  email: string;
  createdAt?: string;
  userId?: string;
}

export function ProfileDetails({ email, createdAt, userId }: ProfileDetailsProps) {
  return (
    <div className="mt-6 space-y-4">
      <ProfileInfoItem
        icon={<Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />}
        label={PROFILE_STRINGS.sections.email.label}
        value={email}
      />

      {createdAt && (
        <ProfileInfoItem
          icon={<Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0" />}
          label={PROFILE_STRINGS.sections.createdAt.label}
          value={createdAt}
        />
      )}

      {userId && (
        <ProfileInfoItem
          icon={<User className="h-5 w-5 text-muted-foreground flex-shrink-0" />}
          label={PROFILE_STRINGS.sections.userId.label}
          value={userId}
          isBordered
          isMonospace
        />
      )}
    </div>
  );
}
