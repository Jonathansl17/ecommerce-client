import { NOTIFICATION_STRINGS } from '../../constants/notifications.constants';
import type { ProductCustomizationImagesProps } from '../../types/notifications.types';

export function ProductCustomizationImages({ images }: ProductCustomizationImagesProps) {
  return (
    <div className="mt-2">
      <p className="text-xs font-medium text-muted-foreground mb-1.5">
        {NOTIFICATION_STRINGS.customizationImagesLabel}
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {images.map((url, index) => (
          <a
            key={url}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 block rounded-md overflow-hidden border border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={NOTIFICATION_STRINGS.customizationImageAlt(index + 1)}
          >
            <img
              src={url}
              alt={NOTIFICATION_STRINGS.customizationImageAlt(index + 1)}
              width={72}
              height={72}
              className="object-cover w-[72px] h-[72px]"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
