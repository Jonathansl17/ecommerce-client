import { ORDER_STATUS_NOTIFICATION_STATUS_LABELS } from '../notifications.constants.js';
import {
  calcularFechaEstimadaEntrega,
  escaparHtml,
  formatearFechaHora,
  formatearMoneda,
  obtenerBrandingEmail,
  validarTemplateConfirmationInput,
  validarTemplateOrderStatusInput,
} from './email-template.utils.js';
import {
  renderEmailLayout,
  renderFooter,
  renderHeader,
  renderProductRows,
  renderSupportBlock,
} from './email-template.sections.js';

function renderConfirmationContent({ order, clientUser, brandName, supportEmail, supportPhone }) {
  const estimatedDeliveryDate = calcularFechaEstimadaEntrega(order.createdAt);
  const productRows = renderProductRows(order.orderItems ?? []);

  return `
    ${renderHeader({ brandName, eyebrow: 'Confirmación de compra' })}
    <tr>
      <td style="padding: 32px 40px 0;">
        <p style="margin: 0; font-size: 22px; font-weight: 700; color: #111827;">
          ¡Gracias por tu compra, ${escaparHtml(clientUser.fullName ?? 'cliente')}!
        </p>
        <p style="margin: 12px 0 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
          Tu pedido fue confirmado exitosamente. A continuación encontrarás todos los detalles.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 40px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
          <tr>
            <td style="padding: 16px 20px; border-right: 1px solid #e5e7eb; width: 50%;">
              <p style="margin: 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">
                Número de pedido
              </p>
              <p style="margin: 4px 0 0; font-size: 18px; font-weight: 700; color: #111827;">
                #${escaparHtml(order.id)}
              </p>
            </td>
            <td style="padding: 16px 20px; width: 50%;">
              <p style="margin: 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">
                Entrega estimada
              </p>
              <p style="margin: 4px 0 0; font-size: 14px; font-weight: 600; color: #111827;">
                ${escaparHtml(estimatedDeliveryDate)}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 16px 40px 0;">
        <p style="margin: 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">
          Dirección de envío
        </p>
        <p style="margin: 6px 0 0; font-size: 14px; color: #374151;">
          ${escaparHtml(order.shippingAddress ?? 'No disponible')}
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 40px 0;">
        <p style="margin: 0 0 12px; font-size: 16px; font-weight: 700; color: #111827;">
          Resumen de tu pedido
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background-color: #f9fafb;">
              <th style="padding: 10px 8px; text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Producto</th>
              <th style="padding: 10px 8px; text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Descripción</th>
              <th style="padding: 10px 8px; text-align: center; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Cant.</th>
              <th style="padding: 10px 8px; text-align: right; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Precio unit.</th>
              <th style="padding: 10px 8px; text-align: right; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${productRows}
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 40px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: 4px 0; font-size: 14px; color: #6b7280;">Subtotal</td>
            <td style="padding: 4px 0; font-size: 14px; color: #374151; text-align: right;">${formatearMoneda(order.subtotal)}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; font-size: 14px; color: #6b7280;">Impuestos</td>
            <td style="padding: 4px 0; font-size: 14px; color: #374151; text-align: right;">${formatearMoneda(order.taxes)}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0 4px; border-top: 2px solid #111827; font-size: 16px; font-weight: 700; color: #111827;">Total pagado</td>
            <td style="padding: 12px 0 4px; border-top: 2px solid #111827; font-size: 16px; font-weight: 700; color: #111827; text-align: right;">${formatearMoneda(order.totalAmount)}</td>
          </tr>
        </table>
      </td>
    </tr>
    ${renderSupportBlock({ supportEmail, supportPhone })}
    ${renderFooter({ brandName })}
  `;
}

function renderOrderStatusContent({
  order,
  clientUser,
  previousStatusLabel,
  newStatusLabel,
  changedAtLabel,
  brandName,
}) {
  return `
    ${renderHeader({ brandName, eyebrow: 'Actualización de estado del pedido' })}
    <tr>
      <td style="padding: 32px 40px 0;">
        <p style="margin: 0; font-size: 22px; font-weight: 700; color: #111827;">
          Hola, ${escaparHtml(clientUser.fullName ?? 'cliente')}
        </p>
        <p style="margin: 12px 0 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
          Tu pedido #${escaparHtml(order.id)} cambió de estado y registramos esta actualización automáticamente.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 40px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
          <tr>
            <td style="padding: 16px 20px; border-right: 1px solid #e5e7eb; width: 33%;">
              <p style="margin: 0; font-size: 11px; font-weight: 600; text-transform: uppercase; color: #6b7280;">Estado anterior</p>
              <p style="margin: 4px 0 0; font-size: 16px; font-weight: 700; color: #111827;">${escaparHtml(previousStatusLabel)}</p>
            </td>
            <td style="padding: 16px 20px; border-right: 1px solid #e5e7eb; width: 33%;">
              <p style="margin: 0; font-size: 11px; font-weight: 600; text-transform: uppercase; color: #6b7280;">Estado actual</p>
              <p style="margin: 4px 0 0; font-size: 16px; font-weight: 700; color: #111827;">${escaparHtml(newStatusLabel)}</p>
            </td>
            <td style="padding: 16px 20px; width: 34%;">
              <p style="margin: 0; font-size: 11px; font-weight: 600; text-transform: uppercase; color: #6b7280;">Fecha del cambio</p>
              <p style="margin: 4px 0 0; font-size: 14px; font-weight: 600; color: #111827;">${escaparHtml(changedAtLabel)}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 40px 32px;">
        <p style="margin: 0; font-size: 14px; color: #374151; line-height: 1.6;">
          Si necesitas revisar el detalle completo, podrás consultarlo en la sección de pedidos de tu cuenta.
        </p>
      </td>
    </tr>
    ${renderFooter({ brandName })}
  `;
}

export function construirPlantillaConfirmacionPedido({ order, clientUser }) {
  validarTemplateConfirmationInput({ order, clientUser });

  const { brandName, supportEmail, supportPhone } = obtenerBrandingEmail();

  return renderEmailLayout({
    title: `Confirmación de pedido #${order.id}`,
    previewText: `Tu pedido #${order.id} fue confirmado correctamente.`,
    bodyContent: renderConfirmationContent({
      order,
      clientUser,
      brandName,
      supportEmail,
      supportPhone,
    }),
  });
}

export function construirPlantillaCambioEstadoPedido({
  order,
  clientUser,
  previousStatus,
  newStatus,
  changedAt,
}) {
  const previousStatusLabel =
    previousStatus != null
      ? ORDER_STATUS_NOTIFICATION_STATUS_LABELS[previousStatus]
      : 'Sin estado previo';
  const newStatusLabel = ORDER_STATUS_NOTIFICATION_STATUS_LABELS[newStatus];

  validarTemplateOrderStatusInput({
    order,
    clientUser,
    newStatusLabel,
    changedAt,
  });

  const { brandName } = obtenerBrandingEmail();
  const changedAtLabel = formatearFechaHora(changedAt);

  return renderEmailLayout({
    title: `Actualización de pedido #${order.id}`,
    previewText: `Tu pedido #${order.id} cambió a ${newStatusLabel}.`,
    bodyContent: renderOrderStatusContent({
      order,
      clientUser,
      previousStatusLabel,
      newStatusLabel,
      changedAtLabel,
      brandName,
    }),
  });
}
