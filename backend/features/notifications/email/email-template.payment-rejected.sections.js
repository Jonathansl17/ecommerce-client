import {
  PAYMENT_REJECTION_REASONS,
  PAYMENT_RETRY_ALTERNATIVES,
} from '../payment-rejected-notification.constants.js';
import { escaparHtml } from './email-template.utils.js';
import { renderHeader, renderFooter, renderSupportBlock } from './email-template.sections.js';

function renderAlternativas(alternatives) {
  return alternatives
    .map(
      (alt) =>
        `<li style="margin: 6px 0; font-size: 14px; color: #374151;">${escaparHtml(alt)}</li>`,
    )
    .join('');
}

export function renderPaymentRejectedContent({
  order,
  clientUser,
  methodLabel,
  amountLabel,
  rejectedAtLabel,
  brandName,
  supportEmail,
  supportPhone,
}) {
  return `
    ${renderHeader({ brandName, eyebrow: 'Pago rechazado' })}
    <tr>
      <td style="padding: 32px 40px 0;">
        <p style="margin: 0; font-size: 22px; font-weight: 700; color: #111827;">
          Hola, ${escaparHtml(clientUser.fullName ?? 'cliente')}
        </p>
        <p style="margin: 12px 0 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
          Tu pago para el pedido #${escaparHtml(order.id.toString())} no pudo procesarse.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 40px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef2f2; border-radius: 8px; border: 1px solid #fecaca;">
          <tr>
            <td style="padding: 16px 20px; border-right: 1px solid #fecaca; width: 50%;">
              <p style="margin: 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">Monto</p>
              <p style="margin: 4px 0 0; font-size: 22px; font-weight: 700; color: #dc2626;">${escaparHtml(amountLabel)}</p>
            </td>
            <td style="padding: 16px 20px; width: 50%;">
              <p style="margin: 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">Método</p>
              <p style="margin: 4px 0 0; font-size: 14px; font-weight: 600; color: #111827;">${escaparHtml(methodLabel)}</p>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 16px 20px; border-top: 1px solid #fecaca;">
              <p style="margin: 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">Motivo</p>
              <p style="margin: 4px 0 0; font-size: 14px; color: #374151;">${escaparHtml(PAYMENT_REJECTION_REASONS.GENERIC)}</p>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 8px 20px 16px; border-top: 1px solid #fecaca;">
              <p style="margin: 0; font-size: 11px; color: #9ca3af;">Fecha del intento: ${escaparHtml(rejectedAtLabel)}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 40px 0;">
        <p style="margin: 0 0 12px; font-size: 16px; font-weight: 700; color: #111827;">¿Qué puedes hacer?</p>
        <ul style="margin: 0; padding-left: 20px;">
          ${renderAlternativas(PAYMENT_RETRY_ALTERNATIVES)}
        </ul>
      </td>
    </tr>
    <tr><td style="padding: 16px 40px 0;"></td></tr>
    ${renderSupportBlock({ supportEmail, supportPhone })}
    ${renderFooter({ brandName })}
  `;
}
