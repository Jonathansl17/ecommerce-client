import prisma from '../../../shared/db/prisma.js';
import { EMAIL_RETRY, NOTIFICATION_MESSAGES } from '../notifications.constants.js';
import {
  PRODUCT_CUSTOMIZATION_APPROVAL_LOG_PREFIXES,
} from './constants.js';
import { obtenerOrdenConClienteAprobacion } from './obtener/orden.service.js';
import { crearClientNotificationAprobacion } from './crear-notificacion.service.js';
import { registrarAprobacionEnHistorial } from './history.service.js';

function notificarAdminFallo(orderId, clientEmail, error) {
  console.error(PRODUCT_CUSTOMIZATION_APPROVAL_LOG_PREFIXES.EMAIL_FAILURE, {
    orderId: orderId.toString(),
    clientEmail,
    errorMessage: error?.message ?? NOTIFICATION_MESSAGES.EMAIL_UNKNOWN_ERROR,
    timestamp: new Date().toISOString(),
  });
}

async function intentarEnvioEmailConReintentos({ enviarEmail, orderId, notificationId }) {
  let intentos = 0;
  while (intentos < EMAIL_RETRY.MAX_ATTEMPTS) {
    try {
      await enviarEmail();
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
        console.warn(PRODUCT_CUSTOMIZATION_APPROVAL_LOG_PREFIXES.EMAIL_RETRY_WARN, { errorMessage: dbError?.message });
      }
      console.warn(
        PRODUCT_CUSTOMIZATION_APPROVAL_LOG_PREFIXES.EMAIL_RETRY_ATTEMPT(intentos, EMAIL_RETRY.MAX_ATTEMPTS, orderId),
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

export async function enviarNotificacionAprobacion({ orderId, title, content, getEmail, historialEvent, historialData = {} }) {
  const { order, clientUser } = await obtenerOrdenConClienteAprobacion(orderId);

  const notificacion = await crearClientNotificationAprobacion({
    clientUserId: clientUser.id,
    orderId: order.id,
    title,
    content,
  });

  const enviado = await intentarEnvioEmailConReintentos({
    enviarEmail: () => getEmail({ order, clientUser }),
    orderId: order.id,
    notificationId: notificacion.id,
  });

  if (!enviado) {
    notificarAdminFallo(order.id, clientUser.email, new Error(NOTIFICATION_MESSAGES.EMAIL_RETRY_EXHAUSTED));
  }

  await registrarAprobacionEnHistorial({ orderId: order.id, event: historialEvent, data: historialData });
}

export function disparar(fn, params) {
  fn(params).catch((error) => {
    console.error(PRODUCT_CUSTOMIZATION_APPROVAL_LOG_PREFIXES.TRIGGER_ERROR, {
      ...params,
      orderId: params.orderId?.toString(),
      errorMessage: error?.message,
    });
  });
}
