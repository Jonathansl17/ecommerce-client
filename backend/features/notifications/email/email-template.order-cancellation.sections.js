import { escaparHtml } from './email-template.utils.js';
import { renderHeader, renderFooter, renderSupportBlock } from './email-template.sections.js';
import {
  CANCELLATION_NOTIFICATION_MESSAGES,
  CANCELLATION_REASON_LABELS,
} from '../order-cancellation/constants.js';

export function renderOrderCancellationContent({
  order,
  clientUser,
  cancelledAtLabel,
  cancelationReason,
  brandName,
  supportEmail,
  supportPhone,
}) {
  const reasonLabel =
    CANCELLATION_REASON_LABELS[cancelationReason] ?? CANCELLATION_NOTIFICATION_MESSAGES.DEFAULT_REASON;

  return `
    ${renderHeader({ brandName, eyebrow: 'Pedido cancelado' })}
    <tr>
      <td style="padding: 32px 40px 0;">
        <p style="margin: 0; font-size: 22px; font-weight: 700; color: #111827;">
          Hola, ${escaparHtml(clientUser.fullName ?? 'cliente')}
        </p>
        <p style="margin: 12px 0 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
          Tu pedido #${escaparHtml(order.id.toString())} ha sido cancelado.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 40px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef2f2; border-radius: 8px; border: 1px solid #fecaca;">
          <tr>
            <td style="padding: 16px 20px;">
              <p style="margin: 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">Motivo de cancelación</p>
              <p style="margin: 4px 0 0; font-size: 16px; font-weight: 700; color: #dc2626;">${escaparHtml(reasonLabel)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 20px 16px; border-top: 1px solid #fecaca;">
              <p style="margin: 0; font-size: 11px; color: #9ca3af;">Fecha de cancelación: ${escaparHtml(cancelledAtLabel)}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 40px 0;">
        <p style="margin: 0; font-size: 14px; color: #374151; line-height: 1.6;">
          Puedes consultar el historial de tu pedido en tu cuenta. Si crees que esto fue un error o tienes alguna duda, nuestro equipo de soporte está disponible para ayudarte.
        </p>
      </td>
    </tr>
    <tr><td style="padding: 16px 40px 0;"></td></tr>
    ${renderSupportBlock({ supportEmail, supportPhone })}
    ${renderFooter({ brandName })}
  `;
}
