import prisma from '../../../shared/db/prisma.js';
import {
  EMAIL_RETRY,
  NOTIFICATION_MESSAGES,
} from '../notifications.constants.js';
import { obtenerBrandingEmail } from '../email/email-template.utils.js';
import { enviarCorreoCancelacionPedido } from '../email/email.service.js';
import {
  CANCELLATION_NOTIFICATION_LOG_PREFIXES,
} from './constants.js';
import { crearNotificacionCancelacion } from './crear-notificacion.service.js';

function notificarAdminFallo(orderId, clientEmail, error) {
  console.error(CANCELLATION_NOTIFICATION_LOG_PREFIXES.EMAIL_FAILURE, {
    orderId: orderId.toString(),
    clientEmail,
    errorMessage: error?.message ?? NOTIFICATION_MESSAGES.EMAIL_UNKNOWN_ERROR,
    timestamp: new Date().toISOString(),
  });
}

async function intentarEnvioConReintentos(order, clientUser, cancelationReason, cancelledAt, notificationId) {
  let intentos = 0;

  while (intentos < EMAIL_RETRY.MAX_ATTEMPTS) {
    try {
      await enviarCorreoCancelacionPedido({ order, clientUser, cancelationReason, cancelledAt });

      await prisma.clientNotification.update({
        where: { id: notificationId },
        data: { sentAt: new Date(), sendAttempts: intentos + 1 },
      });

      return true;
    } catch (error) {
      intentos += 1;

      try {
        await prisma.clientNotification.update({
          where: { id: notificationId },
          data: { sendAttempts: intentos },
        });
      } catch (dbError) {
        console.warn(CANCELLATION_NOTIFICATION_LOG_PREFIXES.EMAIL_RETRY_WARN, {
          errorMessage: dbError?.message,
        });
      }

      console.warn(
        CANCELLATION_NOTIFICATION_LOG_PREFIXES.EMAIL_RETRY_ATTEMPT(intentos, EMAIL_RETRY.MAX_ATTEMPTS, order.id),
        { errorMessage: error?.message },
      );

      if (intentos < EMAIL_RETRY.MAX_ATTEMPTS) {
        await new Promise((resolve) =>
          setTimeout(resolve, EMAIL_RETRY.RETRY_BASE_DELAY_MS * Math.pow(2, intentos - 1)),
        );
      }
    }
  }

  return false;
}

export async function enviarNotificacionCancelacionPedido({ order, clientUser, cancelationReason, cancelledAt }) {
  const { supportEmail } = obtenerBrandingEmail();

  const notificacion = await crearNotificacionCancelacion({
    clientUserId: clientUser.id,
    orderId: order.id,
    cancelationReason,
    supportEmail,
  });

  const enviado = await intentarEnvioConReintentos(
    order,
    clientUser,
    cancelationReason,
    cancelledAt,
    notificacion.id,
  );

  if (!enviado) {
    notificarAdminFallo(order.id, clientUser.email, new Error(NOTIFICATION_MESSAGES.EMAIL_RETRY_EXHAUSTED));
  }
}
