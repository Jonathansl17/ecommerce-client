import nodemailer from 'nodemailer';
import { EMAIL_CONFIG, NOTIFICATION_MESSAGES } from '../notifications.constants.js';
import {
  construirPlantillaCambioEstadoPedido,
  construirPlantillaConfirmacionPedido,
  construirPlantillaPagoAprobado,
} from './email-template.service.js';
import { PAYMENT_NOTIFICATION_MESSAGES } from '../notifications.constants.js';

let transporterInstance = null;

function validarConfiguracionEmail() {
  for (const configKey of EMAIL_CONFIG.REQUIRED_ENV_VARS) {
    if (!process.env[configKey]) {
      throw new Error(NOTIFICATION_MESSAGES.EMAIL_CONFIGURATION_MISSING(configKey));
    }
  }
}

function obtenerTransporte() {
  if (transporterInstance) {
    return transporterInstance;
  }

  validarConfiguracionEmail();

  transporterInstance = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: Number(process.env.EMAIL_PORT) === EMAIL_CONFIG.SMTP_SECURE_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return transporterInstance;
}

function validarPayloadBaseCorreo({ to, subject, html }) {
  if (!to) {
    throw new Error(NOTIFICATION_MESSAGES.EMAIL_RECIPIENT_REQUIRED);
  }

  if (!subject) {
    throw new Error(NOTIFICATION_MESSAGES.EMAIL_SUBJECT_REQUIRED);
  }

  if (!html) {
    throw new Error(NOTIFICATION_MESSAGES.EMAIL_HTML_REQUIRED);
  }
}

function validarDatosNotificacionPedido(order, clientUser) {
  if (!order) {
    throw new Error(NOTIFICATION_MESSAGES.EMAIL_ORDER_DATA_REQUIRED);
  }

  if (!clientUser) {
    throw new Error(NOTIFICATION_MESSAGES.EMAIL_CLIENT_DATA_REQUIRED);
  }

  if (order.id == null) {
    throw new Error(NOTIFICATION_MESSAGES.EMAIL_ORDER_ID_REQUIRED);
  }

  if (!clientUser.email) {
    throw new Error(NOTIFICATION_MESSAGES.EMAIL_CLIENT_EMAIL_REQUIRED);
  }
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
    subject: NOTIFICATION_MESSAGES.ORDER_CONFIRMATION_EMAIL_SUBJECT(
      order.id,
      EMAIL_CONFIG.BRAND_NAME,
    ),
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

export async function enviarCorreoCambioEstadoPedido({
  order,
  clientUser,
  previousStatus,
  newStatus,
  changedAt,
  subject,
}) {
  validarDatosNotificacionPedido(order, clientUser);
  const html = construirPlantillaCambioEstadoPedido({
    order,
    clientUser,
    previousStatus,
    newStatus,
    changedAt,
  });

  await enviarCorreo({
    to: clientUser.email,
    subject,
    html,
  });
}
