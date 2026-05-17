import prisma from '../../../shared/db/prisma.js';
import { LOW_STOCK_LOG_PREFIXES } from './constants.js';
import { triggerAlertaInventarioBajo } from './trigger.service.js';

async function obtenerVariantesConStockBajoSinAlerta() {
  return prisma.productVariant.findMany({
    where: { lowStockAlert: null },
    include: {
      product: {
        include: {
          item: { select: { name: true } },
        },
      },
    },
  });
}

function filtrarVariantesBajoUmbral(variantes) {
  return variantes.filter(
    (v) => v.currentStock - v.reservedStock <= v.minThreshold,
  );
}

export async function monitorearInventarioBajo() {
  console.log(LOW_STOCK_LOG_PREFIXES.MONITOR_START);

  const candidatas = await obtenerVariantesConStockBajoSinAlerta();
  const variantes = filtrarVariantesBajoUmbral(candidatas);

  console.log(LOW_STOCK_LOG_PREFIXES.MONITOR_FOUND(variantes.length));

  for (const variante of variantes) {
    try {
      triggerAlertaInventarioBajo(variante);
      console.log(LOW_STOCK_LOG_PREFIXES.MONITOR_ALERTED(variante.id));
    } catch (error) {
      console.error(LOW_STOCK_LOG_PREFIXES.MONITOR_VARIANT_ERROR(variante.id), {
        errorMessage: error?.message,
      });
    }
  }
}
