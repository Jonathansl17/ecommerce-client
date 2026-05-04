import { PRODUCT_CUSTOMIZATION_MESSAGES } from '../product-customization-notification.constants.js';
import {
  obtenerBrandingEmail,
  validarTemplateConfirmationInput,
} from './email-template.utils.js';
import { renderEmailLayout } from './email-template.sections.js';
import { renderProductCustomizationContent } from './email-template.product-customization.sections.js';

export function construirPlantillaProductoPersonalizadoTerminado({ order, clientUser, images, message }) {
  validarTemplateConfirmationInput({ order, clientUser });

  const { brandName, supportEmail, supportPhone } = obtenerBrandingEmail();

  return renderEmailLayout({
    title: PRODUCT_CUSTOMIZATION_MESSAGES.NOTIFICATION_TITLE(order.id),
    previewText: `Tu producto personalizado para el pedido #${order.id} está listo para revisar.`,
    bodyContent: renderProductCustomizationContent({
      order,
      clientUser,
      images,
      message,
      brandName,
      supportEmail,
      supportPhone,
    }),
  });
}
