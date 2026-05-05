import prisma from '../../../shared/db/prisma.js';
import { PRODUCT_CUSTOMIZATION_APPROVAL_STATUS } from './constants.js';

export async function marcarComoAutoAprobado({ approvalId }) {
  return prisma.productCustomizationApproval.update({
    where: { id: approvalId },
    data: {
      status: PRODUCT_CUSTOMIZATION_APPROVAL_STATUS.AUTO_APPROVED,
      autoApprovedAt: new Date(),
      respondedAt: new Date(),
    },
  });
}
