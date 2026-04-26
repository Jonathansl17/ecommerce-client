import { escaparHtml, formatearMoneda, normalizarOrderItem } from './email-template.utils.js';

const EMAIL_STYLES = {
  body: 'margin: 0; padding: 0; background-color: #f3f4f6; font-family: Arial, Helvetica, sans-serif;',
  hiddenPreview:
    'display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;',
  pageTable: 'background-color: #f3f4f6; padding: 32px 16px;',
  cardTable:
    'max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);',
  headerCell: 'background-color: #111827; padding: 32px 40px; text-align: center;',
  headerTitle:
    'margin: 0; font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;',
  headerEyebrow: 'margin: 8px 0 0; font-size: 14px; color: #9ca3af;',
  footerCell: 'padding: 32px 40px; text-align: center; border-top: 1px solid #e5e7eb;',
  footerText: 'margin: 0; font-size: 12px; color: #9ca3af;',
  footerTextSecondary: 'margin: 8px 0 0; font-size: 12px; color: #9ca3af;',
  supportTable:
    'background-color: #eff6ff; border-radius: 8px; border: 1px solid #bfdbfe;',
  supportCell: 'padding: 20px 24px;',
  supportTitle: 'margin: 0; font-size: 14px; font-weight: 700; color: #1e40af;',
  supportCopy: 'margin: 8px 0 0; font-size: 13px; color: #1d4ed8; line-height: 1.6;',
  supportText: 'margin: 12px 0 0; font-size: 13px; color: #374151;',
  supportTextSecondary: 'margin: 6px 0 0; font-size: 13px; color: #374151;',
  supportLink: 'color: #1d4ed8; text-decoration: none;',
  productCell:
    'padding: 12px 8px; border-bottom: 1px solid #e5e7eb; vertical-align: middle;',
  productTitle: 'margin: 0; font-size: 14px; font-weight: 600; color: #111827;',
  productMeta: 'margin: 4px 0 0; font-size: 12px; color: #6b7280;',
  productQuantity:
    'padding: 12px 8px; border-bottom: 1px solid #e5e7eb; vertical-align: middle; text-align: center; font-size: 14px; color: #374151;',
  productPrice:
    'padding: 12px 8px; border-bottom: 1px solid #e5e7eb; vertical-align: middle; text-align: right; font-size: 14px; color: #374151;',
  productTotal:
    'padding: 12px 8px; border-bottom: 1px solid #e5e7eb; vertical-align: middle; text-align: right; font-size: 14px; font-weight: 600; color: #111827;',
  productImage: 'border-radius: 6px; object-fit: cover; display: block;',
};

export function renderEmailLayout({ title, previewText, bodyContent }) {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escaparHtml(title)}</title>
</head>
<body style="${EMAIL_STYLES.body}">
  <span style="${EMAIL_STYLES.hiddenPreview}">
    ${escaparHtml(previewText)}
  </span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="${EMAIL_STYLES.pageTable}">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="${EMAIL_STYLES.cardTable}">
          ${bodyContent}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function renderHeader({ brandName, eyebrow }) {
  return `
  <tr>
    <td style="${EMAIL_STYLES.headerCell}">
      <p style="${EMAIL_STYLES.headerTitle}">
        ${escaparHtml(brandName)}
      </p>
      <p style="${EMAIL_STYLES.headerEyebrow}">
        ${escaparHtml(eyebrow)}
      </p>
    </td>
  </tr>`;
}

export function renderFooter({ brandName }) {
  return `
  <tr>
    <td style="${EMAIL_STYLES.footerCell}">
      <p style="${EMAIL_STYLES.footerText}">
        Este correo fue generado automáticamente. Por favor no respondas directamente a este mensaje.
      </p>
      <p style="${EMAIL_STYLES.footerTextSecondary}">
        &copy; ${new Date().getFullYear()} ${escaparHtml(brandName)}. Todos los derechos reservados.
      </p>
    </td>
  </tr>`;
}

export function renderSupportBlock({ supportEmail, supportPhone }) {
  return `
  <tr>
    <td style="padding: 32px 40px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="${EMAIL_STYLES.supportTable}">
        <tr>
          <td style="${EMAIL_STYLES.supportCell}">
            <p style="${EMAIL_STYLES.supportTitle}">¿Necesitas ayuda?</p>
            <p style="${EMAIL_STYLES.supportCopy}">
              Nuestro equipo de soporte está disponible para atenderte.
            </p>
            <p style="${EMAIL_STYLES.supportText}">
              <strong>Email:</strong>
              <a href="mailto:${escaparHtml(supportEmail)}" style="${EMAIL_STYLES.supportLink}">${escaparHtml(supportEmail)}</a>
            </p>
            <p style="${EMAIL_STYLES.supportTextSecondary}">
              <strong>Teléfono:</strong> ${escaparHtml(supportPhone)}
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;
}

export function renderProductRows(orderItems = []) {
  return orderItems
    .map((orderItem) => {
      const item = normalizarOrderItem(orderItem);

      return `
      <tr>
        <td style="${EMAIL_STYLES.productCell}">
          <img
            src="${escaparHtml(item.imageUrl)}"
            alt="${escaparHtml(item.name)}"
            width="56"
            height="56"
            style="${EMAIL_STYLES.productImage}"
          />
        </td>
        <td style="${EMAIL_STYLES.productCell}">
          <p style="${EMAIL_STYLES.productTitle}">
            ${escaparHtml(item.name)}
          </p>
          <p style="${EMAIL_STYLES.productMeta}">
            Color: ${escaparHtml(item.color)} &nbsp;|&nbsp; Talla: ${escaparHtml(item.size)}
          </p>
        </td>
        <td style="${EMAIL_STYLES.productQuantity}">
          ${item.quantity}
        </td>
        <td style="${EMAIL_STYLES.productPrice}">
          ${formatearMoneda(item.unitPriceSnap)}
        </td>
        <td style="${EMAIL_STYLES.productTotal}">
          ${formatearMoneda(item.unitPriceSnap * item.quantity)}
        </td>
      </tr>
    `;
    })
    .join('');
}
