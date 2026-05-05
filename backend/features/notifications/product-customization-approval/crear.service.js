import prisma from '../../../shared/db/prisma.js';
import { PRODUCT_CUSTOMIZATION_APPROVAL_STATUS } from './constants.js';

export async function crearAprobacion({ orderId, clientUserId }) {
  return prisma.productCustomizationApproval.create({
    data: {
      orderId,
      clientUserId,
      status: PRODUCT_CUSTOMIZATION_APPROVAL_STATUS.PENDING,
      notifiedAt: new Date(),
    },
    select: { id: true, orderId: true, clientUserId: true, status: true, notifiedAt: true },
  });
}
