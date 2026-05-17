import prisma from '../../../shared/db/prisma.js';
import { serializarOrderStatusNotification } from './serializar.service.js';

export async function obtenerOrderStatusNotificationHistory({ orderId, clientUserId }) {
  const registros = await prisma.orderStatusNotification.findMany({
    where: { orderId, clientUserId },
    orderBy: { changedAt: 'desc' },
  });

  return registros.map(serializarOrderStatusNotification);
}
