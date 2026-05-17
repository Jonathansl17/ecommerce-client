import prisma from '../../../shared/db/prisma.js';
import {
  PRODUCT_CUSTOMIZATION_APPROVAL_DEADLINE,
  PRODUCT_CUSTOMIZATION_APPROVAL_STATUS,
} from './constants.js';

export async function obtenerAprobacionesPendientesVencidas() {
  const deadline = new Date(Date.now() - PRODUCT_CUSTOMIZATION_APPROVAL_DEADLINE.MS);
  return prisma.productCustomizationApproval.findMany({
    where: {
      status: PRODUCT_CUSTOMIZATION_APPROVAL_STATUS.PENDING,
      notifiedAt: { lt: deadline },
    },
    select: { id: true, orderId: true, clientUserId: true },
  });
}
