import prisma from '../../../shared/db/prisma.js';
import { crearError } from '../../../shared/middleware/errorHandler.js';
import { HTTP_STATUS } from '../../../shared/constants/http.constants.js';
import {
  INTERNAL_REVIEWS_MESSAGES,
  REVIEW_STATUSES,
} from './internal-reviews.constants.js';

const REVIEW_INCLUDE = {
  clientUser: {
    select: { id: true, fullName: true, email: true },
  },
  product: {
    select: {
      itemId: true,
      imageUrl: true,
      item: { select: { name: true } },
    },
  },
};

function serializarReview(review) {
  if (!review) return review;
  return {
    id: review.id.toString(),
    productId: review.productId.toString(),
    clientUserId: review.clientUserId.toString(),
    rating: review.rating,
    comment: review.comment,
    status: review.status,
    edited: review.edited,
    helpfulVotes: review.helpfulVotes,
    unhelpfulVotes: review.unhelpfulVotes,
    createdAt: review.createdAt.toISOString(),
    updatedAt: review.updatedAt.toISOString(),
    clientUser: review.clientUser
      ? {
          id: review.clientUser.id.toString(),
          fullName: review.clientUser.fullName,
          email: review.clientUser.email,
        }
      : null,
    product: review.product
      ? {
          id: review.product.itemId.toString(),
          name: review.product.item?.name ?? '',
          imageUrl: review.product.imageUrl,
        }
      : null,
  };
}

function construirWhere({ status, productId, clientUserId, rating }) {
  const where = {};
  if (status) where.status = status;
  if (productId) where.productId = BigInt(productId);
  if (clientUserId) where.clientUserId = BigInt(clientUserId);
  if (rating != null) where.rating = rating;
  return where;
}

export const listarReviews = async ({
  status,
  productId,
  clientUserId,
  rating,
  limit,
  offset,
}) => {
  const where = construirWhere({ status, productId, clientUserId, rating });

  const [total, reviews] = await Promise.all([
    prisma.review.count({ where }),
    prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: REVIEW_INCLUDE,
    }),
  ]);

  return {
    total,
    items: reviews.map(serializarReview),
  };
};

export const obtenerReviewPorIdInterno = async (reviewId) => {
  const review = await prisma.review.findUnique({
    where: { id: BigInt(reviewId) },
    include: REVIEW_INCLUDE,
  });

  if (!review) {
    throw crearError(
      INTERNAL_REVIEWS_MESSAGES.NOT_FOUND,
      HTTP_STATUS.NOT_FOUND,
    );
  }

  return serializarReview(review);
};

export const actualizarEstadoReview = async (reviewId, { status }) => {
  const existente = await prisma.review.findUnique({
    where: { id: BigInt(reviewId) },
    select: { id: true },
  });

  if (!existente) {
    throw crearError(
      INTERNAL_REVIEWS_MESSAGES.NOT_FOUND,
      HTTP_STATUS.NOT_FOUND,
    );
  }

  const actualizada = await prisma.review.update({
    where: { id: BigInt(reviewId) },
    data: { status, updatedAt: new Date() },
    include: REVIEW_INCLUDE,
  });

  return serializarReview(actualizada);
};

export const obtenerEstadisticasReviews = async () => {
  const agrupado = await prisma.review.groupBy({
    by: ['status'],
    _count: { _all: true },
  });

  const stats = REVIEW_STATUSES.reduce((acc, estado) => {
    acc[estado] = 0;
    return acc;
  }, {});

  let total = 0;
  for (const fila of agrupado) {
    const cantidad = fila._count._all;
    stats[fila.status] = cantidad;
    total += cantidad;
  }

  return { ...stats, total };
};
