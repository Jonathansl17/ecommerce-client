import { PAYMENT_METHOD_LABELS } from '../notifications.constants.js';
import { PAYMENT_REJECTED_MESSAGES } from '../payment-rejected-notification.constants.js';
import {
  formatearFechaHora,
  formatearMoneda,
  obtenerBrandingEmail,
  validarTemplatePaymentInput,
} from './email-template.utils.js';
import { renderEmailLayout } from './email-template.sections.js';
import { renderPaymentRejectedContent } from './email-template.payment-rejected.sections.js';

export function construirPlantillaPagoRechazado({ order, clientUser, payment }) {
  validarTemplatePaymentInput({ order, clientUser, payment });

  const { brandName, supportEmail, supportPhone } = obtenerBrandingEmail();
  const methodLabel = PAYMENT_METHOD_LABELS[payment.method] ?? payment.method;
  const amountLabel = formatearMoneda(payment.amount);
  const rejectedAtLabel = formatearFechaHora(payment.updatedAt ?? payment.createdAt);

  return renderEmailLayout({
    title: PAYMENT_REJECTED_MESSAGES.REJECTED_TITLE(order.id),
    previewText: `Tu pago de ${amountLabel} no pudo procesarse para el pedido #${order.id}.`,
    bodyContent: renderPaymentRejectedContent({
      order,
      clientUser,
      methodLabel,
      amountLabel,
      rejectedAtLabel,
      brandName,
      supportEmail,
      supportPhone,
    }),
  });
}
