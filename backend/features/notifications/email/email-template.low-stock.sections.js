import { escaparHtml } from './email-template.utils.js';
import { renderHeader, renderFooter } from './email-template.sections.js';

function renderFilaMetrica(label, valor) {
  return `
    <tr>
      <td style="padding: 12px 20px; border-bottom: 1px solid #e5e7eb;">
        <p style="margin: 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">${escaparHtml(label)}</p>
        <p style="margin: 4px 0 0; font-size: 15px; font-weight: 600; color: #111827;">${escaparHtml(String(valor))}</p>
      </td>
    </tr>`;
}

/**
 * @param {object} params
 * @param {object} params.variante          ProductVariant con product.item.name
 * @param {object} params.metricas          { promedioVentasDiarias, diasDeStockRestantes }
 * @param {string} params.brandName
 */
export function renderLowStockAlertContent({ variante, metricas, brandName }) {
  const { promedioVentasDiarias, diasDeStockRestantes } = metricas;

  const productName = variante.product?.item?.name ?? 'Producto';
  const color = variante.color ?? 'No especificado';
  const size = variante.size ?? 'No especificada';
  const stockDisponible = variante.currentStock - variante.reservedStock;

  const promedioLabel =
    promedioVentasDiarias > 0
      ? `${promedioVentasDiarias.toFixed(1)} unidades/día`
      : 'Sin ventas en los últimos 30 días';

  const diasLabel =
    diasDeStockRestantes !== null
      ? `~${diasDeStockRestantes} día(s)`
      : 'No calculable (sin ventas recientes)';

  const nivelUrgencia = stockDisponible <= 0 ? '#dc2626' : '#d97706';

  return `
    ${renderHeader({ brandName, eyebrow: 'Alerta de inventario bajo' })}
    <tr>
      <td style="padding: 32px 40px 0;">
        <p style="margin: 0; font-size: 22px; font-weight: 700; color: #111827;">
          Inventario bajo — ${escaparHtml(productName)}
        </p>
        <p style="margin: 8px 0 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
          Variante: ${escaparHtml(color)} / ${escaparHtml(size)} &nbsp;·&nbsp; ID #${escaparHtml(variante.id.toString())}
        </p>
      </td>
    </tr>

    <tr>
      <td style="padding: 24px 40px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
          style="background-color: #fffbeb; border-radius: 8px; border: 2px solid ${nivelUrgencia};">
          ${renderFilaMetrica('Stock disponible', `${stockDisponible} unidades`)}
          ${renderFilaMetrica('Umbral mínimo configurado', `${variante.minThreshold} unidades`)}
          ${renderFilaMetrica('Promedio de ventas (últimos 30 días)', promedioLabel)}
          ${renderFilaMetrica('Días de stock estimados', diasLabel)}
        </table>
      </td>
    </tr>

    <tr>
      <td style="padding: 24px 40px 0;">
        <p style="margin: 0; font-size: 13px; color: #6b7280; line-height: 1.6;">
          Esta alerta se generó automáticamente. No se enviarán nuevas alertas para esta variante
          hasta que el inventario sea reabastecido por encima del umbral mínimo.
        </p>
      </td>
    </tr>

    <tr><td style="padding: 16px 40px 0;"></td></tr>
    ${renderFooter({ brandName })}
  `;
}
