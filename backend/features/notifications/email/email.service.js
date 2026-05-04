import {
  EMAIL_CONFIG,
  NOTIFICATION_MESSAGES,
  PAYMENT_NOTIFICATION_MESSAGES,
} from '../notifications.constants.js';
import { PAYMENT_REJECTED_MESSAGES } from '../payment-rejected-notification.constants.js';
import { obtenerTransporte } from './email-transporter.service.js';
import {
  construirPlantillaCambioEstadoPedido,
  construirPlantillaConfirmacionPedido,
  construirPlantillaPagoAprobado,
} from './email-template.service.js';
import { construirPlantillaPagoRechazado } from './email-template.payment-rejected.service.js';
import { construirPlantillaProductoPersonalizadoTerminado } from './email-template.product-customization.service.js';
import { PRODUCT_CUSTOMIZATION_MESSAGES } from '../product-customization-notification.constants.js';

function validarPayloadBaseCorreo({ to, subject, html }) {
  if (!to) throw new Error(NOTIFICATION_MESSAGES.EMAIL_RECIPIENT_REQUIRED);
  if (!subject) throw new Error(NOTIFICATION_MESSAGES.EMAIL_SUBJECT_REQUIRED);
  if (!html) throw new Error(NOTIFICATION_MESSAGES.EMAIL_HTML_REQUIRED);
}

function validarDatosNotificacionPedido(order, clientUser) {
  if (!order) throw new Error(NOTIFICATION_MESSAGES.EMAIL_ORDER_DATA_REQUIRED);
  if (!clientUser) throw new Error(NOTIFICATION_MESSAGES.EMAIL_CLIENT_DATA_REQUIRED);
  if (order.id == null) throw new Error(NOTIFICATION_MESSAGES.EMAIL_ORDER_ID_REQUIRED);
  if (!clientUser.email) throw new Error(NOTIFICATION_MESSAGES.EMAIL_CLIENT_EMAIL_REQUIRED);
}

async function enviarCorreo({ to, subject, html }) {
  validarPayloadBaseCorreo({ to, subject, html });

  const transporte = obtenerTransporte();

  await transporte.sendMail({
    from: `"${EMAIL_CONFIG.BRAND_NAME}" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html,
  });
}

export async function enviarCorreoConfirmacionPedido(order, clientUser) {
  validarDatosNotificacionPedido(order, clientUser);
  const html = construirPlantillaConfirmacionPedido({ order, clientUser });

  await enviarCorreo({
    to: clientUser.email,
    subject: NOTIFICATION_MESSAGES.ORDER_CONFIRMATION_EMAIL_SUBJECT(order.id, EMAIL_CONFIG.BRAND_NAME),
    html,
  });
}

export async function enviarCorreoPagoAprobado({ order, clientUser, payment }) {
  validarDatosNotificacionPedido(order, clientUser);
  const html = construirPlantillaPagoAprobado({ order, clientUser, payment });

  await enviarCorreo({
    to: clientUser.email,
    subject: PAYMENT_NOTIFICATION_MESSAGES.EMAIL_SUBJECT(order.id, EMAIL_CONFIG.BRAND_NAME),
    html,
  });
}

export async function enviarCorreoPagoRechazado({ order, clientUser, payment }) {
  validarDatosNotificacionPedido(order, clientUser);
  const html = construirPlantillaPagoRechazado({ order, clientUser, payment });

  await enviarCorreo({
    to: clientUser.email,
    subject: PAYMENT_REJECTED_MESSAGES.EMAIL_SUBJECT(order.id, EMAIL_CONFIG.BRAND_NAME),
    html,
  });
}

export async function enviarCorreoProductoPersonalizadoTerminado({ order, clientUser, images, message }) {
  validarDatosNotificacionPedido(order, clientUser);
  const html = construirPlantillaProductoPersonalizadoTerminado({ order, clientUser, images, message });

  await enviarCorreo({
    to: clientUser.email,
    subject: PRODUCT_CUSTOMIZATION_MESSAGES.EMAIL_SUBJECT(order.id, EMAIL_CONFIG.BRAND_NAME),
    html,
  });
}

export async function enviarCorreoCambioEstadoPedido({ order, clientUser, previousStatus, newStatus, changedAt, subject }) {
  validarDatosNotificacionPedido(order, clientUser);
  const html = construirPlantillaCambioEstadoPedido({ order, clientUser, previousStatus, newStatus, changedAt });

  await enviarCorreo({ to: clientUser.email, subject, html });
}
