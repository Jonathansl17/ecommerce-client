import { ProfileHeader } from './Profile/ProfileHeader';
import { ProfileDetails } from './Profile/ProfileDetails';

export { ProfileLoadingState } from './Profile/ProfileLoadingState';
export { ProfileInfoItem } from './Profile/ProfileInfoItem';
export { ProfileHeader } from './Profile/ProfileHeader';
export { ProfileDetails } from './Profile/ProfileDetails';

interface ProfileProps {
  initials: string;
  fullName: string;
  email: string;
  accountStatus: string;
  createdAt?: string;
  userId?: string;
}

export function Profile({ initials, fullName, email, accountStatus, createdAt, userId }: ProfileProps) {
  return (
    <>
      <ProfileHeader initials={initials} fullName={fullName} accountStatus={accountStatus} />
      <ProfileDetails email={email} createdAt={createdAt} userId={userId} />
    </>
  );
}
