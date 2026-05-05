import prisma from '../../../shared/db/prisma.js';
import {
  EMAIL_RETRY,
  NOTIFICATION_ENTITY_TYPES,
  NOTIFICATION_MESSAGES,
  NOTIFICATION_TYPES,
  PAYMENT_METHOD_LABELS,
  PAYMENT_NOTIFICATION,
  PAYMENT_NOTIFICATION_LOG_PREFIXES,
  PAYMENT_NOTIFICATION_MESSAGES,
} from '../notifications.constants.js';
import { formatearFechaHora, formatearMoneda } from '../email/email-template.utils.js';
import { enviarCorreoPagoAprobado } from '../email/email.service.js';

function notificarAdminFalloPagoEmail(paymentId, clientEmail, error) {
  console.error(PAYMENT_NOTIFICATION_LOG_PREFIXES.EMAIL_FAILURE, {
    paymentId: paymentId.toString(),
    clientEmail,
    errorMessage: error?.message ?? NOTIFICATION_MESSAGES.EMAIL_UNKNOWN_ERROR,
    timestamp: new Date().toISOString(),
  });
}

async function crearRegistroNotificacionPago({ clientUserId, paymentId, orderId, content }) {
  return prisma.clientNotification.create({
    data: {
      clientUserId,
      type: NOTIFICATION_TYPES.BOTH,
      title: PAYMENT_NOTIFICATION_MESSAGES.APPROVED_TITLE(orderId),
      content,
      entityType: NOTIFICATION_ENTITY_TYPES.PAYMENT,
      entityId: paymentId,
      read: false,
    },
  });
}

function construirContenidoNotificacion({ amount, method, externalReference, chargedAt }) {
  return PAYMENT_NOTIFICATION_MESSAGES.APPROVED_CONTENT({
    amount: formatearMoneda(amount),
    method: PAYMENT_METHOD_LABELS[method] ?? method,
    reference: externalReference,
    chargedAt: formatearFechaHora(chargedAt),
  });
}

async function intentarEnvioEmailConReintentos(order, clientUser, payment, notificationId) {
  let intentos = 0;

  while (intentos < EMAIL_RETRY.MAX_ATTEMPTS) {
    try {
      await enviarCorreoPagoAprobado({ order, clientUser, payment });

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
        console.warn(PAYMENT_NOTIFICATION_LOG_PREFIXES.EMAIL_RETRY_WARN, {
          errorMessage: dbError?.message,
        });
      }

      console.warn(
        PAYMENT_NOTIFICATION_LOG_PREFIXES.EMAIL_RETRY_ATTEMPT(
          intentos,
          EMAIL_RETRY.MAX_ATTEMPTS,
          payment.id,
        ),
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

export async function enviarNotificacionPagoAprobado({ order, clientUser, payment }) {
  const content = construirContenidoNotificacion({
    amount: payment.amount,
    method: payment.method,
    externalReference: payment.externalReference,
    chargedAt: payment.updatedAt ?? payment.createdAt,
  });

  const notificacion = await crearRegistroNotificacionPago({
    clientUserId: clientUser.id,
    paymentId: payment.id,
    orderId: order.id,
    content,
  });

  const enviado = await intentarEnvioEmailConReintentos(
    order,
    clientUser,
    payment,
    notificacion.id,
  );

  if (!enviado) {
    notificarAdminFalloPagoEmail(
      payment.id,
      clientUser.email,
      new Error(NOTIFICATION_MESSAGES.EMAIL_RETRY_EXHAUSTED),
    );
  }
}

export function triggerNotificacionPagoAprobado({ order, clientUser, payment }) {
  void Promise.race([
    enviarNotificacionPagoAprobado({ order, clientUser, payment }),
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error(PAYMENT_NOTIFICATION_MESSAGES.TIMEOUT_ERROR)),
        PAYMENT_NOTIFICATION.TRIGGER_DEADLINE_MS,
      ),
    ),
  ]).catch((error) => {
    console.error(PAYMENT_NOTIFICATION_LOG_PREFIXES.TRIGGER_ERROR, {
      orderId: order.id?.toString(),
      paymentId: payment.id?.toString(),
      errorMessage: error?.message,
    });
  });
}
