import prisma from '../../../shared/db/prisma.js';
import { crearError } from '../../../shared/middleware/errorHandler.js';
import { HTTP_STATUS } from '../../../shared/constants/http.constants.js';
import { INTERNAL_STOCK_MESSAGES } from './internal-stock.constants.js';

const MIN_RESERVED_STOCK = 0;

export const decrementarStock = async ({ items }) => {
  const variantIds = items.map((item) => BigInt(item.variantId));

  const actualizadas = await prisma.$transaction(async (tx) => {
    const variantes = await tx.productVariant.findMany({
      where: { id: { in: variantIds } },
      select: {
        id: true,
        currentStock: true,
        reservedStock: true,
      },
    });

    const porId = new Map(variantes.map((v) => [v.id.toString(), v]));

    for (const item of items) {
      const variante = porId.get(item.variantId);
      if (!variante) {
        throw crearError(
          `${INTERNAL_STOCK_MESSAGES.VARIANT_NOT_FOUND}: ${item.variantId}`,
          HTTP_STATUS.BAD_REQUEST,
        );
      }
      if (variante.currentStock < item.quantity) {
        throw crearError(
          `${INTERNAL_STOCK_MESSAGES.INSUFFICIENT_STOCK}: ${item.variantId} (disponible ${variante.currentStock}, requerido ${item.quantity})`,
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }

    const resultados = [];
    for (const item of items) {
      const variante = porId.get(item.variantId);
      const reservedDecrement = Math.min(variante.reservedStock, item.quantity);
      const nuevoReserved = Math.max(
        variante.reservedStock - reservedDecrement,
        MIN_RESERVED_STOCK,
      );
      const nuevoCurrent = variante.currentStock - item.quantity;

      const actualizado = await tx.productVariant.update({
        where: { id: variante.id },
        data: {
          currentStock: nuevoCurrent,
          reservedStock: nuevoReserved,
        },
        select: {
          id: true,
          currentStock: true,
          reservedStock: true,
        },
      });

      resultados.push({
        variantId: actualizado.id.toString(),
        currentStock: actualizado.currentStock,
        reservedStock: actualizado.reservedStock,
      });
    }

    return resultados;
  });

  return { updated: actualizadas };
};
