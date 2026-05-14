import prisma from '../../../shared/db/prisma.js';
import { LOW_STOCK_ALERT } from './constants.js';

export async function calcularMetricasStock(variantId, stockDisponible) {
  const desde = new Date();
  desde.setDate(desde.getDate() - LOW_STOCK_ALERT.SALES_WINDOW_DAYS);

  const resultado = await prisma.orderItem.aggregate({
    where: {
      variantId,
      order: {
        createdAt: { gte: desde },
        status: { notIn: ['cancelled'] },
      },
    },
    _sum: { quantity: true },
  });

  const totalVendido = resultado._sum.quantity ?? 0;
  const promedioVentasDiarias = totalVendido / LOW_STOCK_ALERT.SALES_WINDOW_DAYS;
  const diasDeStockRestantes =
    promedioVentasDiarias > 0
      ? Math.floor(stockDisponible / promedioVentasDiarias)
      : null;

  return { promedioVentasDiarias, diasDeStockRestantes };
}
