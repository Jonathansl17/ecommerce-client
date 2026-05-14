import {
  CANCELLATION_NOTIFICATION,
  CANCELLATION_NOTIFICATION_LOG_PREFIXES,
  CANCELLATION_NOTIFICATION_MESSAGES,
} from './constants.js';
import { enviarNotificacionCancelacionPedido } from './enviar.service.js';

export function triggerNotificacionCancelacionPedido({ order, clientUser, cancelationReason, cancelledAt }) {
  void Promise.race([
    enviarNotificacionCancelacionPedido({ order, clientUser, cancelationReason, cancelledAt }),
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error(CANCELLATION_NOTIFICATION_MESSAGES.TIMEOUT_ERROR)),
        CANCELLATION_NOTIFICATION.TRIGGER_DEADLINE_MS,
      ),
    ),
  ]).catch((error) => {
    console.error(CANCELLATION_NOTIFICATION_LOG_PREFIXES.TRIGGER_ERROR, {
      orderId: order.id?.toString(),
      errorMessage: error?.message,
    });
  });
}
