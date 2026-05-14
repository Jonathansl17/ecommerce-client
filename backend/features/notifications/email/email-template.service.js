import {
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
