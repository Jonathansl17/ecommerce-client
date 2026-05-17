import prisma from '../../../shared/db/prisma.js';
import { PRODUCT_CUSTOMIZATION_APPROVAL_STATUS } from './constants.js';

export async function obtenerAprobacionPendiente({ orderId, clientUserId }) {
  return prisma.productCustomizationApproval.findFirst({
    where: { orderId, clientUserId, status: PRODUCT_CUSTOMIZATION_APPROVAL_STATUS.PENDING },
    select: { id: true, status: true, notifiedAt: true },
  });
}
