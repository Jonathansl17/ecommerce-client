import prisma from '../../../../shared/db/prisma.js';
import { PRODUCT_CUSTOMIZATION_APPROVAL_STATUS } from '../constants.js';

export async function marcarAjustesSolicitados({ approvalId, adjustmentNotes }) {
  return prisma.productCustomizationApproval.updateMany({
    where: { id: approvalId, status: PRODUCT_CUSTOMIZATION_APPROVAL_STATUS.PENDING },
    data: {
      status: PRODUCT_CUSTOMIZATION_APPROVAL_STATUS.ADJUSTMENTS_REQUESTED,
      adjustmentNotes,
      respondedAt: new Date(),
    },
  });
}
