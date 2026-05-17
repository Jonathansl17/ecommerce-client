import {
  PRODUCT_CUSTOMIZATION_APPROVAL_EVENTS,
  PRODUCT_CUSTOMIZATION_APPROVAL_MESSAGES,
} from '../constants.js';
import { enviarCorreoAjustesSolicitados } from '../../email/email.service.js';
import { enviarNotificacionAprobacion, disparar } from '../notification.utils.js';

async function procesarAjustesSolicitados({ orderId, adjustmentNotes }) {
  await enviarNotificacionAprobacion({
    orderId,
    title: PRODUCT_CUSTOMIZATION_APPROVAL_MESSAGES.ADJUSTMENT_REQUESTED_TITLE(orderId),
    content: PRODUCT_CUSTOMIZATION_APPROVAL_MESSAGES.ADJUSTMENT_REQUESTED_CONTENT(adjustmentNotes),
    getEmail: ({ order, clientUser }) => enviarCorreoAjustesSolicitados({ order, clientUser, adjustmentNotes }),
    historialEvent: PRODUCT_CUSTOMIZATION_APPROVAL_EVENTS.PRODUCT_ADJUSTMENT_REQUESTED,
    historialData: { adjustmentNotes },
  });
}

export function triggerAjustesSolicitados({ orderId, adjustmentNotes }) {
  disparar(procesarAjustesSolicitados, { orderId, adjustmentNotes });
}
