import {
  CANCELLATION_NOTIFICATION_MESSAGES,
  CANCELLATION_REASON_LABELS,
} from '../order-cancellation/constants.js';
import {
  formatearFechaHora,
  obtenerBrandingEmail,
  validarTemplateConfirmationInput,
} from './email-template.utils.js';
import { renderEmailLayout } from './email-template.sections.js';
import { renderOrderCancellationContent } from './email-template.order-cancellation.sections.js';

export function construirPlantillaCancelacionPedido({ order, clientUser, cancelationReason, cancelledAt }) {
  validarTemplateConfirmationInput({ order, clientUser });

  const { brandName, supportEmail, supportPhone } = obtenerBrandingEmail();
  const cancelledAtLabel = formatearFechaHora(cancelledAt ?? new Date());
  const reasonLabel =
    CANCELLATION_REASON_LABELS[cancelationReason] ?? CANCELLATION_NOTIFICATION_MESSAGES.DEFAULT_REASON;

  return renderEmailLayout({
    title: CANCELLATION_NOTIFICATION_MESSAGES.TITLE(order.id),
    previewText: CANCELLATION_NOTIFICATION_MESSAGES.EMAIL_PREVIEW(order.id, reasonLabel),
    bodyContent: renderOrderCancellationContent({
      order,
      clientUser,
      cancelledAtLabel,
      cancelationReason,
      brandName,
      supportEmail,
      supportPhone,
    }),
  });
}
