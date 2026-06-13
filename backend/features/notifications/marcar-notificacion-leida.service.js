import prisma from '../../shared/db/prisma.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { NOTIFICATION_MESSAGES } from './notifications.constants.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';
import { serializarNotificacion } from './serializar-notificacion.utils.js';

export async function marcarComoLeida({ notificationId, clientUserId }) {
  const result = await prisma.clientNotification.updateMany({
    where: { id: notificationId, clientUserId },
    data: { read: true },
  });

  if (result.count === 0) {
    throw crearError(NOTIFICATION_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  const actualizada = await prisma.clientNotification.findUnique({
    where: { id: notificationId },
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
