import nodemailer from 'nodemailer';

function crearTransporte() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

function escaparHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatearExpiracion(expiresAt) {
  return new Intl.DateTimeFormat('es-CR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(expiresAt);
}

function obtenerConfiguracionCorreo() {
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;

  return {
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from,
  };
}

export async function enviarCorreoRecuperacionPassword({
  email,
  fullName,
  recoveryUrl,
  expiresAt,
}) {
  const config = obtenerConfiguracionCorreo();

  if (!config.host || !config.port || !config.user || !config.pass || !config.from) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[password-recovery] SMTP no configurado. Enlace de desarrollo generado (no usar en producción).');
    }
    return;
  }

  const transporte = crearTransporte();
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111827">
      <h2>Recuperacion de contrasena</h2>
      <p>Hola${fullName ? `, ${escaparHtml(fullName)}` : ''}.</p>
      <p>Recibimos una solicitud para restablecer tu contrasena.</p>
      <p>
        <a
          href="${recoveryUrl}"
          style="display:inline-block;padding:12px 18px;background:#111827;color:#ffffff;text-decoration:none;border-radius:8px"
        >
          Restablecer contrasena
        </a>
      </p>
      <p>Este enlace expirara el ${formatearExpiracion(expiresAt)}.</p>
      <p>Si no realizaste esta solicitud, puedes ignorar este correo.</p>
    </div>
  `;

  try {
    await transporte.sendMail({
      from: `"Mi Tienda" <${config.from}>`,
      to: email,
      subject: 'Recuperacion de contrasena',
      html,
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }

    console.warn('[password-recovery] No se pudo enviar el correo de recuperación.', error?.message);
  }
}
