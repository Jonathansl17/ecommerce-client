import nodemailer from 'nodemailer';
import { EMAIL_CONFIG, NOTIFICATION_MESSAGES } from '../notifications.constants.js';

let transporterInstance = null;

function validarConfiguracionEmail() {
  for (const configKey of EMAIL_CONFIG.REQUIRED_ENV_VARS) {
    if (!process.env[configKey]) {
      throw new Error(NOTIFICATION_MESSAGES.EMAIL_CONFIGURATION_MISSING(configKey));
    }
  }
}

function crearTransporte() {
  validarConfiguracionEmail();
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: Number(process.env.EMAIL_PORT) === EMAIL_CONFIG.SMTP_SECURE_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

export async function obtenerTransporte() {
  if (transporterInstance) {
    try {
      await transporterInstance.verify();
    } catch {
      // Credentials may have rotated or connection dropped — force re-init
      transporterInstance = null;
    }
  }

  if (!transporterInstance) {
    transporterInstance = crearTransporte();
  }

  return transporterInstance;
}

export function resetTransporte() {
  transporterInstance = null;
}
