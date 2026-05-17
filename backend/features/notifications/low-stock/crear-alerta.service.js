import prisma from '../../../shared/db/prisma.js';

export async function registrarAlertaInventarioBajo(variantId, stockAtAlert) {
  const now = new Date();

  await prisma.lowStockAlert.upsert({
    where: { variantId },
    create: { variantId, alertSentAt: now, stockAtAlert },
    update: { alertSentAt: now, stockAtAlert },
  });
}

export async function limpiarAlertaInventarioBajo(variantId) {
  await prisma.lowStockAlert.deleteMany({ where: { variantId } });
}
