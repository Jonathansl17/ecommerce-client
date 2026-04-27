'use client';

import { Profile } from '@/features/clients/components/Profile';
import { PROFILE_STRINGS } from '@/features/clients/constants/clients.constants';
import { ProfilePageViewProps } from '@/features/clients/types/profile.interface';

export function ProfilePageView({
  initials,
  fullName,
  email,
  accountStatus,
  formattedCreatedAt,
  userId,
}: ProfilePageViewProps) {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">{PROFILE_STRINGS.page.title}</h1>
        <p className="text-muted-foreground mt-1">{PROFILE_STRINGS.page.subtitle}</p>
      </div>

      {/* Card de perfil */}
      <div className="border border-border rounded-lg bg-card p-6 shadow-sm">
        <Profile
          initials={initials}
          fullName={fullName}
          email={email}
          accountStatus={accountStatus}
          createdAt={formattedCreatedAt}
          userId={userId}
        />
      </div>

      {/* Info extra */}
      <div className="mt-6 p-4 bg-accent/5 border border-border rounded-lg">
        <p className="text-sm text-muted-foreground">{PROFILE_STRINGS.page.supportMessage}</p>
      </div>
    </div>
  );
}
