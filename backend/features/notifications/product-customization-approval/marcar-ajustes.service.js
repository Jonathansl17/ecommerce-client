import prisma from '../../../shared/db/prisma.js';
import { PRODUCT_CUSTOMIZATION_APPROVAL_STATUS } from './constants.js';

export async function marcarAjustesSolicitados({ approvalId, adjustmentNotes }) {
  return prisma.productCustomizationApproval.update({
    where: { id: approvalId },
    data: {
      status: PRODUCT_CUSTOMIZATION_APPROVAL_STATUS.ADJUSTMENTS_REQUESTED,
      adjustmentNotes,
      respondedAt: new Date(),
    },
  });
}
