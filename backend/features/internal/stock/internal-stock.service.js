import prisma from '../../../shared/db/prisma.js';
import { crearError } from '../../../shared/middleware/errorHandler.js';
import { HTTP_STATUS } from '../../../shared/constants/http.constants.js';
import { INTERNAL_STOCK_MESSAGES } from './internal-stock.constants.js';

const MIN_RESERVED_STOCK = 0;

export const decrementarStock = async ({ items }) => {
  const variantIds = items.map((item) => BigInt(item.variantId));

  const actualizadas = await prisma.$transaction(async (tx) => {
    // Verify all variants exist first
    const variantes = await tx.productVariant.findMany({
      where: { id: { in: variantIds } },
      select: { id: true },
    });
    const encontrados = new Set(variantes.map((v) => v.id.toString()));
    for (const item of items) {
      if (!encontrados.has(item.variantId)) {
        throw crearError(
          `${INTERNAL_STOCK_MESSAGES.VARIANT_NOT_FOUND}: ${item.variantId}`,
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }

    // Atomic decrement: the WHERE clause acts as the stock guard.
    // Under READ COMMITTED the check-then-update pattern races; pushing the
    // condition into the UPDATE statement makes it atomic at the DB level.
    const resultados = [];
    for (const item of items) {
      const result = await tx.productVariant.updateMany({
        where: {
          id: BigInt(item.variantId),
          currentStock: { gte: item.quantity },
        },
        data: {
          currentStock: { decrement: item.quantity },
          reservedStock: { decrement: item.quantity },
        },
      });

      if (result.count === 0) {
        throw crearError(
          `${INTERNAL_STOCK_MESSAGES.INSUFFICIENT_STOCK}: ${item.variantId}`,
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      const actualizado = await tx.productVariant.findUnique({
        where: { id: BigInt(item.variantId) },
        select: { id: true, currentStock: true, reservedStock: true },
      });

      resultados.push({
        variantId: actualizado.id.toString(),
        currentStock: actualizado.currentStock,
        reservedStock: Math.max(actualizado.reservedStock, MIN_RESERVED_STOCK),
      });
    }

    return resultados;
  });

  return { updated: actualizadas };
};
