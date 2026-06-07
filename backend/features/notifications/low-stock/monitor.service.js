import prisma from '../../../shared/db/prisma.js';
import { LOW_STOCK_LOG_PREFIXES } from './constants.js';
import { triggerAlertaInventarioBajo } from './trigger.service.js';

const BATCH_SIZE = 200;

const VARIANT_INCLUDE = {
  product: {
    include: {
      item: { select: { name: true } },
    },
  },
};

export async function monitorearInventarioBajo() {
  console.log(LOW_STOCK_LOG_PREFIXES.MONITOR_START);

  let cursor = undefined;
  let totalAlertas = 0;

  do {
    const batch = await prisma.productVariant.findMany({
      where: { lowStockAlert: null },
      take: BATCH_SIZE,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { id: 'asc' },
      include: VARIANT_INCLUDE,
    });

    const bajoUmbral = batch.filter(
      (v) => v.currentStock - v.reservedStock <= v.minThreshold,
    );

    for (const variante of bajoUmbral) {
      try {
        triggerAlertaInventarioBajo(variante);
        totalAlertas++;
        console.log(LOW_STOCK_LOG_PREFIXES.MONITOR_ALERTED(variante.id));
      } catch (error) {
        console.error(LOW_STOCK_LOG_PREFIXES.MONITOR_VARIANT_ERROR(variante.id), {
          errorMessage: error?.message,
        });
      }
    }

    cursor = batch.length === BATCH_SIZE ? batch[batch.length - 1].id : undefined;
  } while (cursor);

  console.log(LOW_STOCK_LOG_PREFIXES.MONITOR_FOUND(totalAlertas));
}
