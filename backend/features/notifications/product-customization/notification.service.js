import prisma from '../../../shared/db/prisma.js';
import {
  EMAIL_RETRY,
  NOTIFICATION_ENTITY_TYPES,
  NOTIFICATION_MESSAGES,
  NOTIFICATION_TYPES,
} from '../notifications.constants.js';
import {
  PRODUCT_CUSTOMIZATION_LOG_PREFIXES,
  PRODUCT_CUSTOMIZATION_MESSAGES,
  PRODUCT_CUSTOMIZATION_NOTIFICATION,
  PRODUCT_CUSTOMIZATION_VALIDATION,
} from './notification.constants.js';
import { enviarCorreoProductoPersonalizadoTerminado } from '../email/email.service.js';

function validarImagenes(images) {
  if (!Array.isArray(images) || images.length < PRODUCT_CUSTOMIZATION_VALIDATION.MIN_IMAGES) {
    throw new Error(PRODUCT_CUSTOMIZATION_MESSAGES.VALIDATION_IMAGES_REQUIRED);
  }
  for (const url of images) {
    let parsed;
    try { parsed = new URL(url); } catch {
      throw new Error(`URL de imagen inválida: ${url}`);
    }
    if (parsed.protocol !== 'https:') {
      throw new Error(`Protocolo no permitido en imagen: ${parsed.protocol}`);
    }
  }
}

async function obtenerOrdenConCliente(orderId) {
  return prisma.order.findUniqueOrThrow({
    where: { id: orderId },
    select: {
      id: true,
      clientUser: {
        select: { id: true, fullName: true, email: true },
      },
    },
  });
}

function notificarAdminFalloEmail(orderId, clientEmail, error) {
  console.error(PRODUCT_CUSTOMIZATION_LOG_PREFIXES.EMAIL_FAILURE, {
    orderId: orderId.toString(),
    clientEmail,
    errorMessage: error?.message ?? NOTIFICATION_MESSAGES.EMAIL_UNKNOWN_ERROR,
    timestamp: new Date().toISOString(),
  });
}

async function crearRegistroNotificacion({ clientUserId, orderId, images, message }) {
  return prisma.clientNotification.create({
    data: {
      clientUserId,
      type: NOTIFICATION_TYPES.BOTH,
      title: PRODUCT_CUSTOMIZATION_MESSAGES.NOTIFICATION_TITLE(orderId),
      content: JSON.stringify({
        message: PRODUCT_CUSTOMIZATION_MESSAGES.NOTIFICATION_CONTENT(message),
        images,
      }),
      entityType: PRODUCT_CUSTOMIZATION_NOTIFICATION.ENTITY_TYPE,
      entityId: orderId,
      read: false,
    },
  });
}

async function intentarEnvioEmailConReintentos({ order, clientUser, images, message, notificationId }) {
  let intentos = 0;

  while (intentos < EMAIL_RETRY.MAX_ATTEMPTS) {
    try {
      await enviarCorreoProductoPersonalizadoTerminado({ order, clientUser, images, message });

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
        console.warn(PRODUCT_CUSTOMIZATION_LOG_PREFIXES.EMAIL_RETRY_WARN, {
          errorMessage: dbError?.message,
        });
      }

      console.warn(
        PRODUCT_CUSTOMIZATION_LOG_PREFIXES.EMAIL_RETRY_ATTEMPT(intentos, EMAIL_RETRY.MAX_ATTEMPTS, order.id),
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

export async function enviarNotificacionProductoPersonalizadoTerminado({ orderId, productId, images, message }) {
  validarImagenes(images);

  const order = await obtenerOrdenConCliente(orderId);
  const { clientUser } = order;

  const notificacion = await crearRegistroNotificacion({
    clientUserId: clientUser.id,
    orderId: order.id,
    images,
    message,
  });

  const enviado = await intentarEnvioEmailConReintentos({
    order,
    clientUser,
    images,
    message,
    notificationId: notificacion.id,
  });

  if (!enviado) {
    notificarAdminFalloEmail(
      order.id,
      clientUser.email,
      new Error(NOTIFICATION_MESSAGES.EMAIL_RETRY_EXHAUSTED),
    );
  }
}

// PLACEHOLDER — US-NOTIF-007
// El módulo de administración (backoffice) es quien dispara este trigger al marcar
// un producto personalizado como terminado. Exportar y conectar cuando ese módulo exista.
// Parámetros esperados del caller:
//   orderId: BigInt, productId: BigInt, images: string[] (min 1), message?: string
export function triggerNotificacionProductoPersonalizadoTerminado({ orderId, productId, images, message }) {
  enviarNotificacionProductoPersonalizadoTerminado({ orderId, productId, images, message }).catch((error) => {
    console.error(PRODUCT_CUSTOMIZATION_LOG_PREFIXES.TRIGGER_ERROR, {
      orderId: orderId?.toString(),
      productId: productId?.toString(),
      errorMessage: error?.message,
    });
  });
}
