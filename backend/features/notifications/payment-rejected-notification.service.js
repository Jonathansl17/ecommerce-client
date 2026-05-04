import prisma from '../../shared/db/prisma.js';
import {
  EMAIL_RETRY,
  NOTIFICATION_ENTITY_TYPES,
  NOTIFICATION_MESSAGES,
  NOTIFICATION_TYPES,
  PAYMENT_METHOD_LABELS,
} from './notifications.constants.js';
import {
  PAYMENT_REJECTED_LOG_PREFIXES,
  PAYMENT_REJECTED_MESSAGES,
  PAYMENT_REJECTED_NOTIFICATION,
  PAYMENT_REJECTION_REASONS,
  PAYMENT_RETRY_ALTERNATIVES,
} from './payment-rejected-notification.constants.js';
import { formatearMoneda } from './email/email-template.utils.js';
import { enviarCorreoPagoRechazado } from './email/email.service.js';
import { registrarEnHistorialFinanciero } from './payment-rejected-financial-history.service.js';

function notificarAdminFalloPagoRechazadoEmail(paymentId, clientEmail, error) {
  console.error(PAYMENT_REJECTED_LOG_PREFIXES.EMAIL_FAILURE, {
    paymentId: paymentId.toString(),
    clientEmail,
    errorMessage: error?.message ?? NOTIFICATION_MESSAGES.EMAIL_UNKNOWN_ERROR,
    timestamp: new Date().toISOString(),
  });
}

function construirContenidoNotificacion({ amount, method }) {
  return PAYMENT_REJECTED_MESSAGES.REJECTED_CONTENT({
    amount: formatearMoneda(amount),
    method: PAYMENT_METHOD_LABELS[method] ?? method,
    reason: PAYMENT_REJECTION_REASONS.GENERIC,
    alternatives: PAYMENT_RETRY_ALTERNATIVES.join('. '),
  });
}

async function crearRegistroNotificacionPagoRechazado({ clientUserId, paymentId, orderId, content }) {
  return prisma.clientNotification.create({
    data: {
      clientUserId,
      type: NOTIFICATION_TYPES.BOTH,
      title: PAYMENT_REJECTED_MESSAGES.REJECTED_TITLE(orderId),
      content,
      entityType: NOTIFICATION_ENTITY_TYPES.PAYMENT,
      entityId: paymentId,
      read: false,
    },
  });
}

async function intentarEnvioEmailConReintentos(order, clientUser, payment, notificationId) {
  let intentos = 0;

  while (intentos < EMAIL_RETRY.MAX_ATTEMPTS) {
    try {
      await enviarCorreoPagoRechazado({ order, clientUser, payment });

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
        console.warn(PAYMENT_REJECTED_LOG_PREFIXES.EMAIL_RETRY_WARN, {
          errorMessage: dbError?.message,
        });
      }

      console.warn(
        PAYMENT_REJECTED_LOG_PREFIXES.EMAIL_RETRY_ATTEMPT(intentos, EMAIL_RETRY.MAX_ATTEMPTS, payment.id),
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

export async function enviarNotificacionPagoRechazado({ order, clientUser, payment }) {
  const content = construirContenidoNotificacion({
    amount: payment.amount,
    method: payment.method,
  });

  const notificacion = await crearRegistroNotificacionPagoRechazado({
    clientUserId: clientUser.id,
    paymentId: payment.id,
    orderId: order.id,
    content,
  });

  await registrarEnHistorialFinanciero({ order, payment, clientUser });

  const enviado = await intentarEnvioEmailConReintentos(
    order,
    clientUser,
    payment,
    notificacion.id,
  );

  if (!enviado) {
    notificarAdminFalloPagoRechazadoEmail(
      payment.id,
      clientUser.email,
      new Error(NOTIFICATION_MESSAGES.EMAIL_RETRY_EXHAUSTED),
    );
  }
}

export function triggerNotificacionPagoRechazado({ order, clientUser, payment }) {
  void Promise.race([
    enviarNotificacionPagoRechazado({ order, clientUser, payment }),
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error(PAYMENT_REJECTED_MESSAGES.TIMEOUT_ERROR)),
        PAYMENT_REJECTED_NOTIFICATION.TRIGGER_DEADLINE_MS,
      ),
    ),
  ]).catch((error) => {
    console.error(PAYMENT_REJECTED_LOG_PREFIXES.TRIGGER_ERROR, {
      orderId: order.id?.toString(),
      paymentId: payment.id?.toString(),
      errorMessage: error?.message,
    });
  });
}
