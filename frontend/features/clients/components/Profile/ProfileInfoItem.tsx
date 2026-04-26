interface ProfileInfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  isBordered?: boolean;
  isMonospace?: boolean;
}

export function ProfileInfoItem({ icon, label, value, isBordered = false, isMonospace = false }: ProfileInfoItemProps) {
  return (
    <div className={`flex items-center gap-4 ${isBordered ? 'pt-4 border-t border-border' : ''}`}>
      {icon}
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className={`text-foreground ${isMonospace ? 'font-mono text-sm' : 'font-medium'}`}>{value}</p>
      </div>
    </div>
  );
}
