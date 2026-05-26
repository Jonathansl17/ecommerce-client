export function extractErrorMessage(body: unknown, fallback: string): string {
  if (body && typeof body === 'object') {
    const record = body as Record<string, unknown>;
    if (Array.isArray(record.errors)) {
      const first = (record.errors as { message?: string }[])[0];
      if (first?.message) return first.message;
    }
    if (typeof record.error === 'string') return record.error;
  }
  return fallback;
}
