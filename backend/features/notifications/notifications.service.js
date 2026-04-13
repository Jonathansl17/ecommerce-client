import prisma from '../../shared/db/prisma.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { NOTIFICATION_MESSAGES, NOTIFICATION_TYPES } from './notifications.constants.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

const serializarNotificacion = (n) => ({
  id: n.id.toString(),
  title: n.title,
  content: n.content,
  entityType: n.entityType,
  entityId: n.entityId?.toString() ?? null,
  read: n.read,
  sentAt: n.sentAt,
  createdAt: n.createdAt,
});

export const obtenerNotificaciones = async ({ clientUserId, soloNoLeidas }) => {
  const filtroBase = {
    clientUserId,
    type: NOTIFICATION_TYPES.INTERNAL,
  };

  if (soloNoLeidas) {
    filtroBase.read = false;
  }

  const notificaciones = await prisma.clientNotification.findMany({
    where: filtroBase,
    orderBy: { createdAt: 'desc' },
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

  return notificaciones.map(serializarNotificacion);
};

export const marcarComoLeida = async ({ notificationId, clientUserId }) => {
  const notificacion = await prisma.clientNotification.findFirst({
    where: {
      id: notificationId,
      clientUserId,
    },
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
};
