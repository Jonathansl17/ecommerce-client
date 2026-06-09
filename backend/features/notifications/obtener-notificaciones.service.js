import prisma from '../../shared/db/prisma.js';
import { NOTIFICATION_TYPES } from './notifications.constants.js';
import { serializarNotificacion } from './serializar-notificacion.utils.js';

export async function obtenerNotificaciones({ clientUserId, soloNoLeidas }) {
  const filtroBase = {
    clientUserId,
    dismissedAt: null,
    type: {
      in: [NOTIFICATION_TYPES.INTERNAL, NOTIFICATION_TYPES.BOTH],
    },
  };

  if (soloNoLeidas) {
    filtroBase.read = false;
  }

  const notificaciones = await prisma.clientNotification.findMany({
    where: filtroBase,
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: {
      id: true,
      title: true,
      content: true,
      entityType: true,
      entityId: true,
      read: true,
      dismissedAt: true,
      sentAt: true,
      createdAt: true,
    },
  });

  return notificaciones.map(serializarNotificacion);
}
