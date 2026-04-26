'use client';

import { useState } from 'react';
import { useProfile } from '@/features/clients/hooks/useProfile';
import { ProfileHeader, ProfileDetails, ProfileLoadingState } from '@/features/clients/components/Profile';
import { ProfileEditDialog } from '@/features/clients/components/ProfileEditDialog';
import { ChangePasswordDialog } from '@/features/clients/components/ChangePasswordDialog';
import { DeactivateAccountDialog } from '@/features/clients/components/DeactivateAccountDialog';
import { PROFILE_STRINGS } from '@/features/clients/constants/clients.constants';

export default function ProfilePage() {
  const { isLoading, user, getInitials, getFormattedCreatedAt } = useProfile();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

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

  const handleProfileUpdated = () => {
    // Forzar actualización del componente
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="max-w-2xl mx-auto" key={refreshKey}>
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

      {/* Botones de acción */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => setIsEditDialogOpen(true)}
          className="flex-1 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-md hover:opacity-90 transition-opacity"
        >
          {PROFILE_STRINGS.editButtons.editProfile}
        </button>
        <button
          onClick={() => setIsPasswordDialogOpen(true)}
          className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground font-medium rounded-md hover:opacity-90 transition-opacity"
        >
          {PROFILE_STRINGS.editButtons.changePassword}
        </button>
      </div>

      {/* Info extra */}
      <div className="mt-6 p-4 bg-accent/5 border border-border rounded-lg">
        <p className="text-sm text-muted-foreground">{PROFILE_STRINGS.page.supportMessage}</p>
      </div>

      {/* Zona de peligro */}
      <div className="mt-6 border border-destructive/40 rounded-lg p-5">
        <h2 className="text-sm font-semibold text-destructive mb-1">
          {PROFILE_STRINGS.dangerZone.title}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {PROFILE_STRINGS.dangerZone.description}
        </p>
        <button
          onClick={() => setIsDeactivateDialogOpen(true)}
          className="px-4 py-2 text-sm font-medium text-destructive border border-destructive rounded-md hover:bg-destructive/10 transition-colors"
        >
          {PROFILE_STRINGS.dangerZone.deactivateButton}
        </button>
      </div>

      {/* Diálogos */}
      <ProfileEditDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        fullName={user.fullName}
        email={user.email}
        onSuccess={handleProfileUpdated}
      />

      <ChangePasswordDialog
        isOpen={isPasswordDialogOpen}
        onClose={() => setIsPasswordDialogOpen(false)}
        onSuccess={handleProfileUpdated}
      />

      <DeactivateAccountDialog
        isOpen={isDeactivateDialogOpen}
        onClose={() => setIsDeactivateDialogOpen(false)}
      />
    </div>
  );
}
