import prisma from '../../shared/db/prisma.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { NOTIFICATION_MESSAGES } from './notifications.constants.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

export async function descartarNotificacion({ notificationId, clientUserId }) {
  // Atomic: ownership + read guard in a single statement eliminates TOCTOU
  const result = await prisma.clientNotification.updateMany({
    where: { id: notificationId, clientUserId, read: true },
    data: { dismissedAt: new Date() },
  });

  if (result.count === 0) {
    // Distinguish 404 (not owned) from 409 (unread) with a secondary read-only query
    const existe = await prisma.clientNotification.findFirst({
      where: { id: notificationId, clientUserId },
      select: { id: true },
    });
    if (!existe) {
      throw crearError(NOTIFICATION_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }
    throw crearError(NOTIFICATION_MESSAGES.DISMISS_UNREAD_FORBIDDEN, HTTP_STATUS.CONFLICT);
  }
}
