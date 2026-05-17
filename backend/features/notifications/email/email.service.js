import { PAYMENT_REJECTED_MESSAGES } from '../payment/rejected-notification.constants.js';
import { obtenerTransporte } from './email-transporter.service.js';
import {
  ACCOUNT_CHANGE_NOTIFICATION_MESSAGES,
  EMAIL_CONFIG,
  NOTIFICATION_MESSAGES,
  PAYMENT_NOTIFICATION_MESSAGES,
} from '../notifications.constants.js';
import {
  construirPlantillaCambioContrasena,
  construirPlantillaCambioEmail,
  construirPlantillaCambioEstadoPedido,
  construirPlantillaConfirmacionPedido,
  construirPlantillaPagoAprobado,
} from './email-template.service.js';
import { construirPlantillaPagoRechazado } from './email-template.payment-rejected.service.js';
import { construirPlantillaProductoPersonalizadoTerminado } from './email-template.product-customization.service.js';
import { PRODUCT_CUSTOMIZATION_MESSAGES } from '../product-customization/notification.constants.js';
import {
  construirPlantillaAjustesSolicitados,
  construirPlantillaAutoAprobado,
  construirPlantillaProductoAprobado,
  construirPlantillaSolicitudAprobacion,
} from './email-template.product-customization-approval.service.js';
import { PRODUCT_CUSTOMIZATION_APPROVAL_MESSAGES } from '../product-customization-approval/constants.js';

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

export async function enviarCorreoCambioContrasena(clientUser, changedAt) {
  if (!clientUser?.email) {
    throw new Error(ACCOUNT_CHANGE_NOTIFICATION_MESSAGES.CLIENT_EMAIL_REQUIRED);
  }

  const html = construirPlantillaCambioContrasena({ clientUser, changedAt });

  await enviarCorreo({
    to: clientUser.email,
    subject: ACCOUNT_CHANGE_NOTIFICATION_MESSAGES.PASSWORD_CHANGED_SUBJECT(EMAIL_CONFIG.BRAND_NAME),
    html,
  });
}

export async function enviarCorreoCambioEmail({ clientUser, previousEmail, newEmail, changedAt }) {
  if (!previousEmail) {
    throw new Error(ACCOUNT_CHANGE_NOTIFICATION_MESSAGES.PREVIOUS_EMAIL_REQUIRED);
  }
  if (!newEmail) {
    throw new Error(ACCOUNT_CHANGE_NOTIFICATION_MESSAGES.NEW_EMAIL_REQUIRED);
  }

  const html = construirPlantillaCambioEmail({ clientUser, previousEmail, newEmail, changedAt });

  await enviarCorreo({
    to: previousEmail,
    subject: ACCOUNT_CHANGE_NOTIFICATION_MESSAGES.EMAIL_CHANGED_SUBJECT(EMAIL_CONFIG.BRAND_NAME),
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

export async function enviarCorreoSolicitudAprobacion({ order, clientUser, images, message }) {
  validarDatosNotificacionPedido(order, clientUser);
  const html = construirPlantillaSolicitudAprobacion({ order, clientUser, images, message });
  await enviarCorreo({
    to: clientUser.email,
    subject: PRODUCT_CUSTOMIZATION_APPROVAL_MESSAGES.EMAIL_SUBJECT_APPROVAL_REQUEST(order.id, EMAIL_CONFIG.BRAND_NAME),
    html,
  });
}

export async function enviarCorreoProductoAprobado({ order, clientUser }) {
  validarDatosNotificacionPedido(order, clientUser);
  const html = construirPlantillaProductoAprobado({ order, clientUser });
  await enviarCorreo({
    to: clientUser.email,
    subject: PRODUCT_CUSTOMIZATION_APPROVAL_MESSAGES.EMAIL_SUBJECT_CLIENT_APPROVED(order.id, EMAIL_CONFIG.BRAND_NAME),
    html,
  });
}

export async function enviarCorreoAjustesSolicitados({ order, clientUser, adjustmentNotes }) {
  validarDatosNotificacionPedido(order, clientUser);
  const html = construirPlantillaAjustesSolicitados({ order, clientUser, adjustmentNotes });
  await enviarCorreo({
    to: clientUser.email,
    subject: PRODUCT_CUSTOMIZATION_APPROVAL_MESSAGES.EMAIL_SUBJECT_ADJUSTMENT_REQUESTED(order.id, EMAIL_CONFIG.BRAND_NAME),
    html,
  });
}

export async function enviarCorreoAutoAprobado({ order, clientUser }) {
  validarDatosNotificacionPedido(order, clientUser);
  const html = construirPlantillaAutoAprobado({ order, clientUser });
  await enviarCorreo({
    to: clientUser.email,
    subject: PRODUCT_CUSTOMIZATION_APPROVAL_MESSAGES.EMAIL_SUBJECT_AUTO_APPROVED(order.id, EMAIL_CONFIG.BRAND_NAME),
    html,
  });
}

export async function enviarCorreoCambioEstadoPedido({ order, clientUser, previousStatus, newStatus, changedAt, subject }) {
  validarDatosNotificacionPedido(order, clientUser);
  const html = construirPlantillaCambioEstadoPedido({ order, clientUser, previousStatus, newStatus, changedAt });

  await enviarCorreo({ to: clientUser.email, subject, html });
}
