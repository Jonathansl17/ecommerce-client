import {
  PRODUCT_CUSTOMIZATION_MESSAGES,
} from '../product-customization/notification.constants.js';
import { escaparHtml } from './email-template.utils.js';
import { renderHeader, renderFooter, renderSupportBlock } from './email-template.sections.js';

function renderProductImages(images) {
  return images
    .map(
      (url, index) => `
      <tr>
        <td style="padding: 8px 0; text-align: center;">
          <img
            src="${escaparHtml(url)}"
            alt="${escaparHtml(PRODUCT_CUSTOMIZATION_MESSAGES.IMAGES_ALT(index + 1))}"
            width="500"
            style="max-width: 100%; border-radius: 8px; border: 1px solid #e5e7eb; display: block; margin: 0 auto;"
          />
        </td>
      </tr>`,
    )
    .join('');
}

export function renderProductCustomizationContent({
  order,
  clientUser,
  images,
  message,
  brandName,
  supportEmail,
  supportPhone,
}) {
  return `
    ${renderHeader({ brandName, eyebrow: 'Producto personalizado listo' })}
    <tr>
      <td style="padding: 32px 40px 0;">
        <p style="margin: 0; font-size: 22px; font-weight: 700; color: #111827;">
          ¡Tu producto está terminado, ${escaparHtml(clientUser.fullName ?? 'cliente')}!
        </p>
        <p style="margin: 12px 0 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
          ${escaparHtml(PRODUCT_CUSTOMIZATION_MESSAGES.NOTIFICATION_CONTENT(message))}
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 40px 0;">
        <p style="margin: 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">Pedido asociado</p>
        <p style="margin: 6px 0 0; font-size: 18px; font-weight: 700; color: #111827;">#${escaparHtml(order.id.toString())}</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 28px 40px 0;">
        <p style="margin: 0 0 16px; font-size: 16px; font-weight: 700; color: #111827;">Fotografías del producto</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${renderProductImages(images)}
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 40px 0;">
        <p style="margin: 0; font-size: 14px; color: #374151; line-height: 1.6;">
          ${escaparHtml(PRODUCT_CUSTOMIZATION_MESSAGES.EMAIL_COPY)}
        </p>
      </td>
    </tr>
    <tr><td style="padding: 16px 40px 0;"></td></tr>
    ${renderSupportBlock({ supportEmail, supportPhone })}
    ${renderFooter({ brandName })}
  `;
}
