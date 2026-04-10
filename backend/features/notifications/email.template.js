import { EMAIL_CONFIG } from './notifications.constants.js';

function escaparHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatearMoneda(valor) {
  return `$${Number(valor).toFixed(2)}`;
}

function calcularFechaEstimadaEntrega(fechaCreacion) {
  const fecha = new Date(fechaCreacion);
  fecha.setDate(fecha.getDate() + EMAIL_CONFIG.DELIVERY_ESTIMATE_DAYS);
  return fecha.toLocaleDateString('es-CR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function construirFilasProductos(orderItems) {
  return orderItems
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; vertical-align: middle;">
          <img
            src="${escaparHtml(item.variant.product.imageUrl)}"
            alt="${escaparHtml(item.variant.product.item.name)}"
            width="56"
            height="56"
            style="border-radius: 6px; object-fit: cover; display: block;"
          />
        </td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; vertical-align: middle;">
          <p style="margin: 0; font-size: 14px; font-weight: 600; color: #111827;">
            ${escaparHtml(item.variant.product.item.name)}
          </p>
          <p style="margin: 4px 0 0; font-size: 12px; color: #6b7280;">
            Color: ${escaparHtml(item.variant.color)} &nbsp;|&nbsp; Talla: ${escaparHtml(item.variant.size)}
          </p>
        </td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; vertical-align: middle; text-align: center; font-size: 14px; color: #374151;">
          ${item.quantity}
        </td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; vertical-align: middle; text-align: right; font-size: 14px; color: #374151;">
          ${formatearMoneda(item.unitPriceSnap)}
        </td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; vertical-align: middle; text-align: right; font-size: 14px; font-weight: 600; color: #111827;">
          ${formatearMoneda(Number(item.unitPriceSnap) * item.quantity)}
        </td>
      </tr>
    `,
    )
    .join('');
}

export function construirPlantillaConfirmacionPedido({ order, clientUser }) {
  const supportEmail = process.env.SUPPORT_EMAIL;
  const supportPhone = process.env.SUPPORT_PHONE;
  const fechaEntregaEstimada = calcularFechaEstimadaEntrega(order.createdAt);
  const filasProductos = construirFilasProductos(order.orderItems);

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirmación de pedido #${order.id}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: Arial, Helvetica, sans-serif;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">

          <!-- Cabecera -->
          <tr>
            <td style="background-color: #111827; padding: 32px 40px; text-align: center;">
              <p style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
                Mi Tienda
              </p>
              <p style="margin: 8px 0 0; font-size: 14px; color: #9ca3af;">
                Confirmación de compra
              </p>
            </td>
          </tr>

          <!-- Saludo -->
          <tr>
            <td style="padding: 32px 40px 0;">
              <p style="margin: 0; font-size: 22px; font-weight: 700; color: #111827;">
                ¡Gracias por tu compra, ${escaparHtml(clientUser.fullName)}!
              </p>
              <p style="margin: 12px 0 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
                Tu pedido fue confirmado exitosamente. A continuación encontrarás todos los detalles.
              </p>
            </td>
          </tr>

          <!-- Número de pedido y fecha estimada -->
          <tr>
            <td style="padding: 24px 40px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
                <tr>
                  <td style="padding: 16px 20px; border-right: 1px solid #e5e7eb; width: 50%;">
                    <p style="margin: 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">
                      Número de pedido
                    </p>
                    <p style="margin: 4px 0 0; font-size: 18px; font-weight: 700; color: #111827;">
                      #${order.id}
                    </p>
                  </td>
                  <td style="padding: 16px 20px; width: 50%;">
                    <p style="margin: 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">
                      Entrega estimada
                    </p>
                    <p style="margin: 4px 0 0; font-size: 14px; font-weight: 600; color: #111827;">
                      ${fechaEntregaEstimada}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Dirección de envío -->
          <tr>
            <td style="padding: 16px 40px 0;">
              <p style="margin: 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">
                Dirección de envío
              </p>
              <p style="margin: 6px 0 0; font-size: 14px; color: #374151;">
                ${escaparHtml(order.shippingAddress)}
              </p>
            </td>
          </tr>

          <!-- Tabla de productos -->
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
                  ${filasProductos}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Totales -->
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

          <!-- Soporte -->
          <tr>
            <td style="padding: 32px 40px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #eff6ff; border-radius: 8px; border: 1px solid #bfdbfe;">
                <tr>
                  <td style="padding: 20px 24px;">
                    <p style="margin: 0; font-size: 14px; font-weight: 700; color: #1e40af;">¿Necesitas ayuda?</p>
                    <p style="margin: 8px 0 0; font-size: 13px; color: #1d4ed8; line-height: 1.6;">
                      Nuestro equipo de soporte está disponible para atenderte.
                    </p>
                    <p style="margin: 12px 0 0; font-size: 13px; color: #374151;">
                      <strong>Email:</strong>
                      <a href="mailto:${supportEmail}" style="color: #1d4ed8; text-decoration: none;">${supportEmail}</a>
                    </p>
                    <p style="margin: 6px 0 0; font-size: 13px; color: #374151;">
                      <strong>Teléfono:</strong> ${supportPhone}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Pie de página -->
          <tr>
            <td style="padding: 32px 40px; text-align: center; border-top: 1px solid #e5e7eb; margin-top: 32px;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                Este correo fue generado automáticamente. Por favor no respondas directamente a este mensaje.
              </p>
              <p style="margin: 8px 0 0; font-size: 12px; color: #9ca3af;">
                &copy; ${new Date().getFullYear()} Mi Tienda. Todos los derechos reservados.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `.trim();
}
