interface AuthorAvatarProps {
  name: string;
}

export function AuthorAvatar({ name }: AuthorAvatarProps) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
      aria-hidden="true"
    >
      {initial}
    </div>
  );
}
