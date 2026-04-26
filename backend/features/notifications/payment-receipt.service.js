import prisma from '../../shared/db/prisma.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';
import { PAYMENT_STATUSES } from '../orders/orders.constants.js';
import {
  EMAIL_CONFIG,
  PAYMENT_METHOD_LABELS,
  PAYMENT_RECEIPT_PDF,
  PAYMENT_RECEIPT_STRINGS,
} from './notifications.constants.js';
import {
  formatearFechaHora,
  formatearFechaLarga,
  formatearMoneda,
} from './email/email-template.utils.js';
import { generarComprobantePagoPDF } from './pdf/payment-receipt.pdf.service.js';

const PAYMENT_RECEIPT_SELECT = {
  id: true,
  method: true,
  externalReference: true,
  amount: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  order: {
    select: {
      id: true,
      totalAmount: true,
      createdAt: true,
      clientUser: {
        select: { fullName: true },
      },
    },
  },
};

function mapearDatosComprobante({ pago, orden, clientUser }) {
  return {
    brandName: EMAIL_CONFIG.BRAND_NAME,
    clientName: clientUser.fullName,
    paymentData: {
      amountLabel: formatearMoneda(pago.amount),
      methodLabel: PAYMENT_METHOD_LABELS[pago.method] ?? pago.method,
      reference: pago.externalReference,
      chargedAtLabel: formatearFechaHora(pago.updatedAt ?? pago.createdAt),
    },
    orderData: {
      idLabel: orden.id.toString(),
      createdAtLabel: formatearFechaLarga(orden.createdAt),
      totalLabel: formatearMoneda(orden.totalAmount),
    },
    generatedAtLabel: formatearFechaHora(new Date()),
  };
}

export async function obtenerComprobantePago({ paymentId, clientUserId }) {
  const pago = await prisma.payment.findFirst({
    where: {
      id: paymentId,
      status: PAYMENT_STATUSES.APPROVED,
      order: { clientUserId },
    },
    select: PAYMENT_RECEIPT_SELECT,
  });

  if (!pago) {
    throw crearError(PAYMENT_RECEIPT_STRINGS.NOT_FOUND_ERROR, HTTP_STATUS.NOT_FOUND);
  }

  const { order: orden } = pago;
  const clientUser = orden.clientUser;
  const datos = mapearDatosComprobante({ pago, orden, clientUser });
  const pdfBuffer = await generarComprobantePagoPDF(datos);
  const filename = PAYMENT_RECEIPT_PDF.FILENAME(orden.id.toString());

  return { pdfBuffer, filename };
}
