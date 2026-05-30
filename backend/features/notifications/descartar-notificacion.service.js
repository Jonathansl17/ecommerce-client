import prisma from '../../shared/db/prisma.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { NOTIFICATION_MESSAGES } from './notifications.constants.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

export async function descartarNotificacion({ notificationId, clientUserId }) {
  const notificacion = await prisma.clientNotification.findFirst({
    where: { id: notificationId, clientUserId },
    select: { id: true, read: true },
  });

  if (!notificacion) {
    throw crearError(NOTIFICATION_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  if (!notificacion.read) {
    throw crearError(NOTIFICATION_MESSAGES.DISMISS_UNREAD_FORBIDDEN, HTTP_STATUS.CONFLICT);
  }

  await prisma.clientNotification.update({
    where: { id: notificationId },
    data: { dismissedAt: new Date() },
  });
}
