import type { ProductCustomizationContent } from '../types/notifications.types';

export function parseProductCustomizationContent(raw: string): ProductCustomizationContent {
  try {
    const parsed: unknown = JSON.parse(raw);

    if (
      parsed !== null &&
      typeof parsed === 'object' &&
      'message' in parsed &&
      'images' in parsed &&
      Array.isArray((parsed as { images: unknown }).images)
    ) {
      return {
        message: String((parsed as { message: unknown }).message ?? ''),
        images: (parsed as { images: string[] }).images,
      };
    }
  } catch {
    // content is plain text — fallback
  }

  return { message: raw, images: [] };
}
