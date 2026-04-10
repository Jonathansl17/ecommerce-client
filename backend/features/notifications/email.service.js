import nodemailer from 'nodemailer';
import { EMAIL_CONFIG } from './notifications.constants.js';
import { construirPlantillaConfirmacionPedido } from './email.template.js';

function crearTransporte() {
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

export async function enviarCorreoConfirmacionPedido(order, clientUser) {
  const transporte = crearTransporte();
  const html = construirPlantillaConfirmacionPedido({ order, clientUser });

  await transporte.sendMail({
    from: `"Mi Tienda" <${process.env.EMAIL_FROM}>`,
    to: clientUser.email,
    subject: `Confirmación de tu pedido #${order.id} — Mi Tienda`,
    html,
  });
}
