'use client';

import { useState } from 'react';
import { useProfile } from '@/features/clients/hooks/useProfile';
import { ProfileLoadingState } from '@/features/clients/components/Profile';
import { ProfilePageView } from './pageView';

export default function ProfilePage() {
  const { isLoading, user, getInitials, getFormattedCreatedAt } = useProfile();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return isLoading ? (
    <ProfileLoadingState />
  ) : !user ? null : (
    <ProfilePageView
      key={refreshKey}
      initials={getInitials(user.fullName)}
      fullName={user.fullName}
      email={user.email}
      accountStatus={user.accountStatus || 'active'}
      formattedCreatedAt={getFormattedCreatedAt(user.createdAt)}
      userId={user.id}
      isEditDialogOpen={isEditDialogOpen}
      isPasswordDialogOpen={isPasswordDialogOpen}
      onOpenEditDialog={() => setIsEditDialogOpen(true)}
      onOpenPasswordDialog={() => setIsPasswordDialogOpen(true)}
      onCloseEditDialog={() => setIsEditDialogOpen(false)}
      onClosePasswordDialog={() => setIsPasswordDialogOpen(false)}
      onProfileUpdated={() => {
        setIsEditDialogOpen(false);
        setIsPasswordDialogOpen(false);
        setRefreshKey((prev) => prev + 1);
      }}
    />
  );
}
