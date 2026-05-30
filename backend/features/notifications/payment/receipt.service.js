import prisma from '../../../shared/db/prisma.js';
import { crearError } from '../../../shared/middleware/errorHandler.js';
import { HTTP_STATUS } from '../../../shared/constants/http.constants.js';
import { PAYMENT_STATUSES } from '../../orders/orders.constants.js';
import { EMAIL_CONFIG, PAYMENT_METHOD_LABELS } from '../notifications.constants.js';
import {
  PAYMENT_RECEIPT_PDF,
  PAYMENT_RECEIPT_STRINGS,
} from './receipt.constants.js';
import {
  formatearFechaHora,
  formatearFechaLarga,
  formatearMoneda,
} from '../email/email-template.utils.js';
import { generarComprobantePagoPDF } from '../pdf/payment-receipt.pdf.service.js';

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
      orderItems: {
        select: {
          quantity: true,
          unitPriceSnap: true,
          variant: {
            select: {
              color: true,
              size: true,
              product: {
                select: {
                  item: { select: { name: true } },
                },
              },
            },
          },
        },
      },
    },
  },
};

function mapearItems(orderItems = []) {
  return orderItems.map((item) => {
    const name = item.variant?.product?.item?.name ?? 'Producto';
    const color = item.variant?.color;
    const size = item.variant?.size;
    const descripcion = [name, color, size].filter(Boolean).join(' · ');
    const quantity = Number(item.quantity) || 1;
    const unitPrice = Number(item.unitPriceSnap) || 0;
    return {
      descripcion,
      cantidad: quantity,
      precioUnitario: formatearMoneda(unitPrice),
      importe: formatearMoneda(unitPrice * quantity),
    };
  });
}

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
      items: mapearItems(orden.orderItems),
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
