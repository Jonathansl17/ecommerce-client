import {
  ACCOUNT_CHANGE_NOTIFICATION_MESSAGES,
  PAYMENT_METHOD_LABELS,
  PAYMENT_NOTIFICATION_MESSAGES,
} from '../notifications.constants.js';
import {
  escaparHtml,
  formatearFechaHora,
  formatearMoneda,
  obtenerBrandingEmail,
  validarTemplatePaymentInput,
} from './email-template.utils.js';
import {
  renderEmailLayout,
  renderFooter,
  renderHeader,
} from './email-template.sections.js';

function renderPaymentApprovedContent({
  order,
  clientUser,
  methodLabel,
  amountLabel,
  reference,
  chargedAtLabel,
  brandName,
}) {
  return `
    ${renderHeader({ brandName, eyebrow: 'Confirmación de pago' })}
    <tr>
      <td style="padding: 32px 40px 0;">
        <p style="margin: 0; font-size: 22px; font-weight: 700; color: #111827;">
          ¡Tu pago fue procesado, ${escaparHtml(clientUser.fullName ?? 'cliente')}!
        </p>
        <p style="margin: 12px 0 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
          Tu cobro fue aprobado exitosamente. Aquí tienes el detalle de la transacción.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 40px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; border-radius: 8px; border: 1px solid #bbf7d0;">
          <tr>
            <td style="padding: 16px 20px; border-right: 1px solid #bbf7d0; width: 50%;">
              <p style="margin: 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">
                Monto cobrado
              </p>
              <p style="margin: 4px 0 0; font-size: 22px; font-weight: 700; color: #15803d;">
                ${escaparHtml(amountLabel)}
              </p>
            </td>
            <td style="padding: 16px 20px; width: 50%;">
              <p style="margin: 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">
                Método de pago
              </p>
              <p style="margin: 4px 0 0; font-size: 14px; font-weight: 600; color: #111827;">
                ${escaparHtml(methodLabel)}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 16px 20px; border-right: 1px solid #bbf7d0; border-top: 1px solid #bbf7d0; width: 50%;">
              <p style="margin: 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">
                Referencia única
              </p>
              <p style="margin: 4px 0 0; font-size: 14px; font-weight: 600; color: #111827; word-break: break-all;">
                ${escaparHtml(reference)}
              </p>
            </td>
            <td style="padding: 16px 20px; border-top: 1px solid #bbf7d0; width: 50%;">
              <p style="margin: 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">
                Fecha del cargo
              </p>
              <p style="margin: 4px 0 0; font-size: 14px; font-weight: 600; color: #111827;">
                ${escaparHtml(chargedAtLabel)}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 16px 40px 0;">
        <p style="margin: 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">
          Pedido asociado
        </p>
        <p style="margin: 6px 0 0; font-size: 14px; color: #374151;">
          #${escaparHtml(order.id.toString())}
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 40px 32px;">
        <p style="margin: 0; font-size: 14px; color: #374151; line-height: 1.6;">
          Puedes consultar el detalle completo de tu pedido en la sección de pedidos de tu cuenta.
        </p>
      </td>
    </tr>
    ${renderFooter({ brandName })}
  `;
}

export function construirPlantillaPagoAprobado({ order, clientUser, payment }) {
  validarTemplatePaymentInput({ order, clientUser, payment });

  const { brandName } = obtenerBrandingEmail();
  const methodLabel = PAYMENT_METHOD_LABELS[payment.method] ?? payment.method;
  const amountLabel = formatearMoneda(payment.amount);
  const chargedAtLabel = formatearFechaHora(payment.updatedAt ?? payment.createdAt);

  return renderEmailLayout({
    title: PAYMENT_NOTIFICATION_MESSAGES.APPROVED_TITLE(order.id),
    previewText: `Tu pago de ${amountLabel} fue aprobado exitosamente.`,
    bodyContent: renderPaymentApprovedContent({
      order,
      clientUser,
      methodLabel,
      amountLabel,
      reference: payment.externalReference,
      chargedAtLabel,
      brandName,
    }),
  });
}

function validarTemplateAccountChangeInput({ clientUser }) {
  if (!clientUser) {
    throw new Error(ACCOUNT_CHANGE_NOTIFICATION_MESSAGES.CLIENT_DATA_REQUIRED);
  }
  if (!clientUser.email) {
    throw new Error(ACCOUNT_CHANGE_NOTIFICATION_MESSAGES.CLIENT_EMAIL_REQUIRED);
  }
}

function renderPasswordChangedContent({ clientUser, changedAtLabel, brandName }) {
  return `
    ${renderHeader({ brandName, eyebrow: 'Seguridad de tu cuenta' })}
    <tr>
      <td style="padding: 32px 40px 0;">
        <p style="margin: 0; font-size: 22px; font-weight: 700; color: #111827;">
          Tu contraseña fue cambiada
        </p>
        <p style="margin: 12px 0 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
          Hola, ${escaparHtml(clientUser.fullName ?? 'usuario')}. Tu contraseña fue actualizada exitosamente.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 40px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
          <tr>
            <td style="padding: 16px 20px; border-right: 1px solid #e5e7eb; width: 50%;">
              <p style="margin: 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">
                Cambio realizado
              </p>
              <p style="margin: 4px 0 0; font-size: 15px; font-weight: 700; color: #111827;">
                Contraseña
              </p>
            </td>
            <td style="padding: 16px 20px; width: 50%;">
              <p style="margin: 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">
                Fecha y hora
              </p>
              <p style="margin: 4px 0 0; font-size: 14px; font-weight: 600; color: #111827;">
                ${escaparHtml(changedAtLabel)}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 40px 32px;">
        <p style="margin: 0; font-size: 14px; color: #374151; line-height: 1.6;">
          Si no realizaste este cambio, por favor contacta a nuestro equipo de soporte de inmediato.
        </p>
      </td>
    </tr>
    ${renderFooter({ brandName })}
  `;
}

function renderEmailChangedContent({ clientUser, previousEmail, newEmail, changedAtLabel, brandName }) {
  return `
    ${renderHeader({ brandName, eyebrow: 'Seguridad de tu cuenta' })}
    <tr>
      <td style="padding: 32px 40px 0;">
        <p style="margin: 0; font-size: 22px; font-weight: 700; color: #111827;">
          Tu correo electrónico fue actualizado
        </p>
        <p style="margin: 12px 0 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
          Hola, ${escaparHtml(clientUser.fullName ?? 'usuario')}. El correo asociado a tu cuenta fue modificado.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 40px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
          <tr>
            <td style="padding: 16px 20px; border-right: 1px solid #e5e7eb; width: 50%;">
              <p style="margin: 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">
                Correo anterior
              </p>
              <p style="margin: 4px 0 0; font-size: 14px; font-weight: 600; color: #6b7280; word-break: break-all;">
                ${escaparHtml(previousEmail)}
              </p>
            </td>
            <td style="padding: 16px 20px; width: 50%;">
              <p style="margin: 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">
                Correo nuevo
              </p>
              <p style="margin: 4px 0 0; font-size: 14px; font-weight: 700; color: #111827; word-break: break-all;">
                ${escaparHtml(newEmail)}
              </p>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 16px 20px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">
                Fecha y hora del cambio
              </p>
              <p style="margin: 4px 0 0; font-size: 14px; font-weight: 600; color: #111827;">
                ${escaparHtml(changedAtLabel)}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 40px 32px;">
        <p style="margin: 0; font-size: 14px; color: #374151; line-height: 1.6;">
          Si no realizaste este cambio, por favor contacta a nuestro equipo de soporte de inmediato.
        </p>
      </td>
    </tr>
    ${renderFooter({ brandName })}
  `;
}

export function construirPlantillaCambioContrasena({ clientUser, changedAt }) {
  validarTemplateAccountChangeInput({ clientUser });

  const { brandName } = obtenerBrandingEmail();
  const changedAtLabel = formatearFechaHora(changedAt ?? new Date());

  return renderEmailLayout({
    title: 'Tu contraseña fue cambiada',
    previewText: 'Tu contraseña fue actualizada exitosamente. Si no fuiste tú, contacta soporte.',
    bodyContent: renderPasswordChangedContent({ clientUser, changedAtLabel, brandName }),
  });
}

export function construirPlantillaCambioEmail({ clientUser, previousEmail, newEmail, changedAt }) {
  validarTemplateAccountChangeInput({ clientUser });

  if (!previousEmail) {
    throw new Error(ACCOUNT_CHANGE_NOTIFICATION_MESSAGES.PREVIOUS_EMAIL_REQUIRED);
  }
  if (!newEmail) {
    throw new Error(ACCOUNT_CHANGE_NOTIFICATION_MESSAGES.NEW_EMAIL_REQUIRED);
  }

  const { brandName } = obtenerBrandingEmail();
  const changedAtLabel = formatearFechaHora(changedAt ?? new Date());

  return renderEmailLayout({
    title: 'Tu correo electrónico fue actualizado',
    previewText: `Tu correo fue cambiado de ${previousEmail} a ${newEmail}.`,
    bodyContent: renderEmailChangedContent({
      clientUser,
      previousEmail,
      newEmail,
      changedAtLabel,
      brandName,
    }),
  });
}
