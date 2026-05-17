import { PROFILE_STRINGS } from '@/features/clients/constants/clients.constants';

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
