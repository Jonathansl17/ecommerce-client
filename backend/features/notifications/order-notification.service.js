import prisma from '../../shared/db/prisma.js';
import { EMAIL_RETRY, NOTIFICATION_ENTITY_TYPES, NOTIFICATION_MESSAGES, NOTIFICATION_TYPES } from './notifications.constants.js';
import { enviarCorreoConfirmacionPedido } from './email.service.js';

function notificarAdminFalloEmail(orderId, clientEmail, error) {
  console.error('[EMAIL_FAILURE] Fallo permanente al enviar correo de confirmación.', {
    orderId: orderId.toString(),
    clientEmail,
    errorMessage: error?.message ?? NOTIFICATION_MESSAGES.EMAIL_UNKNOWN_ERROR,
    timestamp: new Date().toISOString(),
  });
}

async function obtenerPedidoConDetalle(orderId) {
  return prisma.order.findUniqueOrThrow({
    where: { id: orderId },
    include: {
      clientUser: {
        select: { id: true, fullName: true, email: true },
      },
      orderItems: {
        include: {
          variant: {
            include: {
              product: {
                include: {
                  item: { select: { name: true } },
                },
              },
            },
          },
        },
      },
    },
  });
}

async function crearRegistroNotificacion({ clientUserId, orderId, title, content }) {
  return prisma.clientNotification.create({
    data: {
      clientUserId,
      type: NOTIFICATION_TYPES.BOTH,
      title,
      content,
      entityType: NOTIFICATION_ENTITY_TYPES.ORDER,
      entityId: orderId,
      read: false,
    },
  });
}

async function intentarEnvioConReintentos(order, clientUser, notificationId) {
  let intentos = 0;

  while (intentos < EMAIL_RETRY.MAX_ATTEMPTS) {
    try {
      await enviarCorreoConfirmacionPedido(order, clientUser);

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
        console.warn('[EMAIL_RETRY] No se pudo actualizar sendAttempts en DB.', {
          errorMessage: dbError?.message,
        });
      }

      console.warn(`[EMAIL_RETRY] Intento ${intentos}/${EMAIL_RETRY.MAX_ATTEMPTS} fallido para pedido #${order.id}.`, {
        errorMessage: error?.message,
      });

      if (intentos < EMAIL_RETRY.MAX_ATTEMPTS) {
        await new Promise((resolve) =>
          setTimeout(resolve, EMAIL_RETRY.RETRY_BASE_DELAY_MS * Math.pow(2, intentos - 1))
        );
      }
    }
  }

  return false;
}

export async function enviarNotificacionConfirmacionPedido(orderId) {
  const order = await obtenerPedidoConDetalle(orderId);
  const { clientUser } = order;

  const notificacion = await crearRegistroNotificacion({
    clientUserId: clientUser.id,
    orderId: order.id,
    title: NOTIFICATION_MESSAGES.ORDER_CONFIRMED_TITLE(order.id),
    content: NOTIFICATION_MESSAGES.ORDER_CONFIRMED_CONTENT,
  });

  const enviado = await intentarEnvioConReintentos(order, clientUser, notificacion.id);

  if (!enviado) {
    notificarAdminFalloEmail(order.id, clientUser.email, new Error(NOTIFICATION_MESSAGES.EMAIL_RETRY_EXHAUSTED));
  }
}

export function triggerNotificacionPagoAprobado(orderId) {
  enviarNotificacionConfirmacionPedido(orderId).catch((error) => {
    console.error('[NOTIF_TRIGGER] Error inesperado al procesar notificación de pago aprobado.', {
      orderId: orderId.toString(),
      errorMessage: error?.message,
    });
  });
}
