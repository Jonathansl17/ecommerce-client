import { PRODUCT_CUSTOMIZATION_APPROVAL_MESSAGES } from '../product-customization-approval/constants.js';
import { obtenerBrandingEmail, validarTemplateConfirmationInput } from './email-template.utils.js';
import { renderEmailLayout } from './email-template.sections.js';
import {
  renderAdjustmentRequestedContent,
  renderApprovalRequestContent,
  renderAutoApprovedContent,
  renderClientApprovedContent,
} from './email-template.product-customization-approval.sections.js';

export function construirPlantillaSolicitudAprobacion({ order, clientUser, images, message }) {
  validarTemplateConfirmationInput({ order, clientUser });
  const { brandName, supportEmail, supportPhone } = obtenerBrandingEmail();

  return renderEmailLayout({
    title: PRODUCT_CUSTOMIZATION_APPROVAL_MESSAGES.APPROVAL_REQUEST_TITLE(order.id),
    previewText: `Tu producto personalizado del pedido #${order.id} está listo para que lo revises.`,
    bodyContent: renderApprovalRequestContent({ order, clientUser, images, message, brandName, supportEmail, supportPhone }),
  });
}

export function construirPlantillaProductoAprobado({ order, clientUser }) {
  validarTemplateConfirmationInput({ order, clientUser });
  const { brandName } = obtenerBrandingEmail();

  return renderEmailLayout({
    title: PRODUCT_CUSTOMIZATION_APPROVAL_MESSAGES.CLIENT_APPROVED_TITLE(order.id),
    previewText: `Aprobaste tu producto del pedido #${order.id}. Procede al envío.`,
    bodyContent: renderClientApprovedContent({ order, clientUser, brandName }),
  });
}

export function construirPlantillaAjustesSolicitados({ order, clientUser, adjustmentNotes }) {
  validarTemplateConfirmationInput({ order, clientUser });
  const { brandName, supportEmail, supportPhone } = obtenerBrandingEmail();

  return renderEmailLayout({
    title: PRODUCT_CUSTOMIZATION_APPROVAL_MESSAGES.ADJUSTMENT_REQUESTED_TITLE(order.id),
    previewText: `Recibimos tu solicitud de ajustes para el pedido #${order.id}.`,
    bodyContent: renderAdjustmentRequestedContent({ order, clientUser, adjustmentNotes, brandName, supportEmail, supportPhone }),
  });
}

export function construirPlantillaAutoAprobado({ order, clientUser }) {
  validarTemplateConfirmationInput({ order, clientUser });
  const { brandName } = obtenerBrandingEmail();

  return renderEmailLayout({
    title: PRODUCT_CUSTOMIZATION_APPROVAL_MESSAGES.AUTO_APPROVED_TITLE(order.id),
    previewText: `Tu producto del pedido #${order.id} fue aprobado automáticamente.`,
    bodyContent: renderAutoApprovedContent({ order, clientUser, brandName }),
  });
}
