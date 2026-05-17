import {
  PRODUCT_CUSTOMIZATION_APPROVAL_DEADLINE,
  PRODUCT_CUSTOMIZATION_APPROVAL_EVENTS,
  PRODUCT_CUSTOMIZATION_APPROVAL_MESSAGES,
} from '../constants.js';
import { enviarCorreoAutoAprobado } from '../../email/email.service.js';
import { enviarNotificacionAprobacion, disparar } from '../notification.utils.js';

async function procesarAutoAprobado({ orderId }) {
  await enviarNotificacionAprobacion({
    orderId,
    title: PRODUCT_CUSTOMIZATION_APPROVAL_MESSAGES.AUTO_APPROVED_TITLE(orderId),
    content: PRODUCT_CUSTOMIZATION_APPROVAL_MESSAGES.AUTO_APPROVED_CONTENT(PRODUCT_CUSTOMIZATION_APPROVAL_DEADLINE.HOURS),
    getEmail: ({ order, clientUser }) => enviarCorreoAutoAprobado({ order, clientUser }),
    historialEvent: PRODUCT_CUSTOMIZATION_APPROVAL_EVENTS.PRODUCT_AUTO_APPROVED,
  });
}

export function triggerAutoAprobado({ orderId }) {
  disparar(procesarAutoAprobado, { orderId });
}
