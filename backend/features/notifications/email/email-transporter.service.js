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

export function obtenerTransporte() {
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
