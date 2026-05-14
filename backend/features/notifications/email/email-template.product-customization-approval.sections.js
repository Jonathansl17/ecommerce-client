import {
  PRODUCT_CUSTOMIZATION_APPROVAL_DEADLINE,
  PRODUCT_CUSTOMIZATION_APPROVAL_MESSAGES,
} from '../product-customization-approval/constants.js';
import { escaparHtml } from './email-template.utils.js';
import { renderHeader, renderFooter, renderSupportBlock } from './email-template.sections.js';

function obtenerFrontendUrl() {
  return process.env.FRONTEND_ORIGIN ?? 'http://localhost:4001';
}

function renderCtaAprobacion(orderId) {
  const base = obtenerFrontendUrl();
  const approveUrl = `${base}/orders/${escaparHtml(orderId.toString())}/approve-customization`;
  const adjustUrl = `${base}/orders/${escaparHtml(orderId.toString())}/request-adjustments`;

  return `
    <tr><td style="padding: 28px 40px 0;">
      <table role="presentation" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding-right: 12px;">
            <a href="${approveUrl}" style="display:inline-block;padding:12px 24px;background-color:#16a34a;color:#fff;border-radius:6px;font-size:14px;font-weight:600;text-decoration:none;">
              ✓ Aprobar producto
            </a>
          </td>
          <td>
            <a href="${adjustUrl}" style="display:inline-block;padding:12px 24px;background-color:#f3f4f6;color:#374151;border-radius:6px;font-size:14px;font-weight:600;text-decoration:none;border:1px solid #d1d5db;">
              Solicitar ajustes
            </a>
          </td>
        </tr>
      </table>
    </td></tr>
    <tr><td style="padding: 12px 40px 0;">
      <p style="margin:0;font-size:12px;color:#9ca3af;">
        Tienes ${PRODUCT_CUSTOMIZATION_APPROVAL_DEADLINE.HOURS} horas para responder. Si no respondés, el producto se aprobará automáticamente.
      </p>
    </td></tr>`;
}

export function renderApprovalRequestContent({ order, clientUser, images = [], message, brandName, supportEmail, supportPhone }) {
  const imageRows = images.map((url, i) => `
    <tr><td style="padding:6px 0;text-align:center;">
      <img src="${escaparHtml(url)}" alt="Foto del producto ${i + 1}" width="480"
        style="max-width:100%;border-radius:8px;border:1px solid #e5e7eb;display:block;margin:0 auto;" />
    </td></tr>`).join('');

  return `
    ${renderHeader({ brandName, eyebrow: 'Tu producto está listo para revisión' })}
    <tr><td style="padding:32px 40px 0;">
      <p style="margin:0;font-size:22px;font-weight:700;color:#111827;">¡Hola, ${escaparHtml(clientUser.fullName ?? 'cliente')}!</p>
      <p style="margin:12px 0 0;font-size:14px;color:#6b7280;line-height:1.6;">
        ${escaparHtml(PRODUCT_CUSTOMIZATION_APPROVAL_MESSAGES.APPROVAL_REQUEST_CONTENT)}
      </p>
      ${message ? `<p style="margin:12px 0 0;font-size:14px;color:#374151;font-style:italic;">"${escaparHtml(message)}"</p>` : ''}
    </td></tr>
    ${imageRows ? `<tr><td style="padding:20px 40px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${imageRows}</table></td></tr>` : ''}
    ${renderCtaAprobacion(order.id)}
    ${renderSupportBlock({ supportEmail, supportPhone })}
    ${renderFooter({ brandName })}`;
}

export function renderClientApprovedContent({ order, clientUser, brandName }) {
  return `
    ${renderHeader({ brandName, eyebrow: 'Producto aprobado' })}
    <tr><td style="padding:32px 40px 24px;">
      <p style="margin:0;font-size:22px;font-weight:700;color:#111827;">¡Gracias, ${escaparHtml(clientUser.fullName ?? 'cliente')}!</p>
      <p style="margin:12px 0 0;font-size:14px;color:#6b7280;line-height:1.6;">
        ${escaparHtml(PRODUCT_CUSTOMIZATION_APPROVAL_MESSAGES.CLIENT_APPROVED_CONTENT)}
      </p>
      <p style="margin:20px 0 0;font-size:11px;font-weight:600;text-transform:uppercase;color:#6b7280;">Pedido</p>
      <p style="margin:4px 0 0;font-size:18px;font-weight:700;color:#111827;">#${escaparHtml(order.id.toString())}</p>
    </td></tr>
    ${renderFooter({ brandName })}`;
}

export function renderAdjustmentRequestedContent({ order, clientUser, adjustmentNotes, brandName, supportEmail, supportPhone }) {
  return `
    ${renderHeader({ brandName, eyebrow: 'Ajustes recibidos' })}
    <tr><td style="padding:32px 40px 0;">
      <p style="margin:0;font-size:22px;font-weight:700;color:#111827;">Hola, ${escaparHtml(clientUser.fullName ?? 'cliente')}</p>
      <p style="margin:12px 0 0;font-size:14px;color:#6b7280;line-height:1.6;">Recibimos tu solicitud de ajustes para el pedido #${escaparHtml(order.id.toString())}. Nuestro equipo la revisará pronto.</p>
    </td></tr>
    <tr><td style="padding:20px 40px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fefce8;border-radius:8px;border:1px solid #fde68a;">
        <tr><td style="padding:16px 20px;">
          <p style="margin:0;font-size:11px;font-weight:600;text-transform:uppercase;color:#6b7280;">Detalle de ajustes</p>
          <p style="margin:6px 0 0;font-size:14px;color:#374151;">${escaparHtml(adjustmentNotes)}</p>
        </td></tr>
      </table>
    </td></tr>
    <tr><td style="padding:16px 40px 0;"></td></tr>
    ${renderSupportBlock({ supportEmail, supportPhone })}
    ${renderFooter({ brandName })}`;
}

export function renderAutoApprovedContent({ order, clientUser, brandName }) {
  return `
    ${renderHeader({ brandName, eyebrow: 'Aprobación automática' })}
    <tr><td style="padding:32px 40px 24px;">
      <p style="margin:0;font-size:22px;font-weight:700;color:#111827;">Hola, ${escaparHtml(clientUser.fullName ?? 'cliente')}</p>
      <p style="margin:12px 0 0;font-size:14px;color:#6b7280;line-height:1.6;">
        ${escaparHtml(PRODUCT_CUSTOMIZATION_APPROVAL_MESSAGES.AUTO_APPROVED_CONTENT(PRODUCT_CUSTOMIZATION_APPROVAL_DEADLINE.HOURS))}
      </p>
      <p style="margin:20px 0 0;font-size:11px;font-weight:600;text-transform:uppercase;color:#6b7280;">Pedido</p>
      <p style="margin:4px 0 0;font-size:18px;font-weight:700;color:#111827;">#${escaparHtml(order.id.toString())}</p>
    </td></tr>
    ${renderFooter({ brandName })}`;
}
