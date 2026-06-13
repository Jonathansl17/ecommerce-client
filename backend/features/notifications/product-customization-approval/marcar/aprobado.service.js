import prisma from '../../../../shared/db/prisma.js';
import { PRODUCT_CUSTOMIZATION_APPROVAL_STATUS } from '../constants.js';

export async function marcarComoAprobado({ approvalId }) {
  return prisma.productCustomizationApproval.updateMany({
    where: { id: approvalId, status: PRODUCT_CUSTOMIZATION_APPROVAL_STATUS.PENDING },
    data: { status: PRODUCT_CUSTOMIZATION_APPROVAL_STATUS.APPROVED, respondedAt: new Date() },
  });
}
