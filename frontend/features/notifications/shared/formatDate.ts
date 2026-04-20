import { NOTIFICATION_DATE_FORMAT } from '../constants/notifications.constants';

export function formatearFecha(fechaIso: string): string {
  return new Date(fechaIso).toLocaleDateString(
    NOTIFICATION_DATE_FORMAT.LOCALE,
    NOTIFICATION_DATE_FORMAT.OPTIONS,
  );
}
