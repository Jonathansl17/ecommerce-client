'use client';

import { useProfile } from '@/features/clients/hooks/useProfile';
import { ProfileHeader, ProfileDetails, ProfileLoadingState } from '@/features/clients/components/Profile';
import { PROFILE_STRINGS } from '@/features/clients/constants/clients.constants';

export default function ProfilePage() {
  const { isLoading, user, getInitials, getFormattedCreatedAt } = useProfile();

  // Mostrar mientras verifica autenticación
  if (isLoading) {
    return <ProfileLoadingState />;
  }

  // No renderizar si no hay usuario
  if (!user) {
    return null;
  }

  const initials = getInitials(user.fullName);
  const formattedCreatedAt = getFormattedCreatedAt(user.createdAt);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">{PROFILE_STRINGS.page.title}</h1>
        <p className="text-muted-foreground mt-1">{PROFILE_STRINGS.page.subtitle}</p>
      </div>

      {/* Card de perfil */}
      <div className="border border-border rounded-lg bg-card p-6 shadow-sm">
        <ProfileHeader
          initials={initials}
          fullName={user.fullName}
          accountStatus={user.accountStatus || 'active'}
        />

        <ProfileDetails email={user.email} createdAt={formattedCreatedAt} userId={user.id} />
      </div>

      {/* Info extra */}
      <div className="mt-6 p-4 bg-accent/5 border border-border rounded-lg">
        <p className="text-sm text-muted-foreground">{PROFILE_STRINGS.page.supportMessage}</p>
      </div>
    </div>
  );
}
