import prisma from '../../../shared/db/prisma.js';
import { NOTIFICATION_TYPES } from '../notifications.constants.js';
import {
  PRODUCT_CUSTOMIZATION_APPROVAL_ENTITY_TYPE,
} from './constants.js';

export async function crearClientNotificationAprobacion({ clientUserId, orderId, title, content }) {
  return prisma.clientNotification.create({
    data: {
      clientUserId,
      type: NOTIFICATION_TYPES.BOTH,
      title,
      content,
      entityType: PRODUCT_CUSTOMIZATION_APPROVAL_ENTITY_TYPE,
      entityId: orderId,
      read: false,
    },
  });
}
