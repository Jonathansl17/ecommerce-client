import {
  PRODUCT_CUSTOMIZATION_APPROVAL_EVENTS,
  PRODUCT_CUSTOMIZATION_APPROVAL_MESSAGES,
} from '../constants.js';
import { crearAprobacion } from '../crear.service.js';
import { enviarCorreoSolicitudAprobacion } from '../../email/email.service.js';
import { enviarNotificacionAprobacion, disparar } from '../notification.utils.js';

async function procesarSolicitudAprobacion({ orderId, clientUserId, images, message }) {
  await crearAprobacion({ orderId, clientUserId });
  await enviarNotificacionAprobacion({
    orderId,
    title: PRODUCT_CUSTOMIZATION_APPROVAL_MESSAGES.APPROVAL_REQUEST_TITLE(orderId),
    content: PRODUCT_CUSTOMIZATION_APPROVAL_MESSAGES.APPROVAL_REQUEST_CONTENT,
    getEmail: ({ order, clientUser }) => enviarCorreoSolicitudAprobacion({ order, clientUser, images, message }),
    historialEvent: PRODUCT_CUSTOMIZATION_APPROVAL_EVENTS.PRODUCT_READY_FOR_APPROVAL,
  });
}

export function triggerSolicitudAprobacion({ orderId, clientUserId, images, message }) {
  disparar(procesarSolicitudAprobacion, { orderId, clientUserId, images, message });
}
