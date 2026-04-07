import prisma from '../../shared/db/prisma.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { PRODUCTS_MESSAGES } from './products.constants.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

const INCLUDE_RELACIONES = {
  item: {
    select: {
      name: true,
      status: true,
    },
  },
  category: {
    select: {
      id: true,
      name: true,
    },
  },
  variants: {
    select: {
      id: true,
      color: true,
      size: true,
      price: true,
      currentStock: true,
      minThreshold: true,
      reservedStock: true,
    },
  },
  ratingsSummary: {
    select: {
      average: true,
      totalReviews: true,
    },
  },
};

export const obtenerTodos = async () => {
  return prisma.product.findMany({
    include: INCLUDE_RELACIONES,
  });
};

export const obtenerPorId = async (id) => {
  const producto = await prisma.product.findUnique({
    where: { itemId: BigInt(id) },
    include: INCLUDE_RELACIONES,
  });

  if (!producto) {
    throw crearError(PRODUCTS_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return producto;
};

export const obtenerPorCategoria = async (categoriaId) => {
  return prisma.product.findMany({
    where: { categoryId: BigInt(categoriaId) },
    include: INCLUDE_RELACIONES,
  });
};
