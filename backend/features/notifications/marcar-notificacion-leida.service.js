import prisma from '../../shared/db/prisma.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { NOTIFICATION_MESSAGES } from './notifications.constants.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';
import { serializarNotificacion } from './serializar-notificacion.utils.js';

export async function marcarComoLeida({ notificationId, clientUserId }) {
  const notificacion = await prisma.clientNotification.findFirst({
    where: { id: notificationId, clientUserId },
    select: { id: true, read: true },
  });

  if (!notificacion) {
    throw crearError(NOTIFICATION_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  const actualizada = await prisma.clientNotification.update({
    where: { id: notificationId },
    data: { read: true },
    select: {
      id: true,
      title: true,
      content: true,
      entityType: true,
      entityId: true,
      read: true,
      sentAt: true,
      createdAt: true,
    },
  });

  return serializarNotificacion(actualizada);
}
