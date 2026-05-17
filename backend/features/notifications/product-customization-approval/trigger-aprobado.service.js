import {
  PRODUCT_CUSTOMIZATION_APPROVAL_EVENTS,
  PRODUCT_CUSTOMIZATION_APPROVAL_MESSAGES,
} from './constants.js';
import { enviarCorreoProductoAprobado } from '../email/email.service.js';
import { enviarNotificacionAprobacion, disparar } from './notification.utils.js';

async function procesarProductoAprobado({ orderId }) {
  await enviarNotificacionAprobacion({
    orderId,
    title: PRODUCT_CUSTOMIZATION_APPROVAL_MESSAGES.CLIENT_APPROVED_TITLE(orderId),
    content: PRODUCT_CUSTOMIZATION_APPROVAL_MESSAGES.CLIENT_APPROVED_CONTENT,
    getEmail: ({ order, clientUser }) => enviarCorreoProductoAprobado({ order, clientUser }),
    historialEvent: PRODUCT_CUSTOMIZATION_APPROVAL_EVENTS.PRODUCT_APPROVED_BY_CLIENT,
  });
}

export function triggerProductoAprobado({ orderId }) {
  disparar(procesarProductoAprobado, { orderId });
}
