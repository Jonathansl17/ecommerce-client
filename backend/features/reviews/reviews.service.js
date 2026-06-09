import prisma from '../../shared/db/prisma.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';
import { paginatedResponse } from '../../shared/utils/pagination.js';
import {
  REVIEWS_MESSAGES,
  REVIEW_STATUS,
  COMPLETED_ORDER_STATUS,
  VOTE_TYPES,
} from './reviews.constants.js';
import { PRISMA_ERROR_CODES } from '../../shared/constants/app.constants.js';

// ─── Helpers privados ──────────────────────────────────────────────────────

function toBigIntOrThrow(value, message) {
  try {
    return BigInt(value);
  } catch {
    throw crearError(message, HTTP_STATUS.BAD_REQUEST);
  }
}

// Mapea la respuesta oficial del administrador a su DTO público (US-REV-005).
function mapReviewResponse(response) {
  if (!response) return null;
  return {
    content: response.content,
    edited: response.createdAt.getTime() !== response.updatedAt.getTime(),
    createdAt: response.createdAt.toISOString(),
    updatedAt: response.updatedAt.toISOString(),
  };
}

// Único punto de transformación Review → DTO público.
function mapReview(review) {
  return {
    id: review.id.toString(),
    productId: review.productId.toString(),
    clientUserId: review.clientUserId.toString(),
    clientUserName: review.clientUser?.fullName ?? '',
    rating: review.rating,
    comment: review.comment,
    status: review.status,
    edited: review.edited,
    helpfulVotes: review.helpfulVotes,
    unhelpfulVotes: review.unhelpfulVotes,
    createdAt: review.createdAt.toISOString(),
    updatedAt: review.updatedAt.toISOString(),
    response: mapReviewResponse(review.response),
  };
}

// Verifica que el usuario tenga al menos un pedido entregado que incluya ese producto.
async function verificarCompraCompletada(clientUserId, productId) {
  const ordenEntregada = await prisma.order.findFirst({
    where: {
      clientUserId,
      status: COMPLETED_ORDER_STATUS,
      orderItems: {
        some: { variant: { productId } },
      },
    },
    select: { id: true },
  });

  if (!ordenEntregada) {
    throw crearError(REVIEWS_MESSAGES.NOT_PURCHASED, HTTP_STATUS.FORBIDDEN);
  }
}


// Obtiene una reseña validando que pertenezca al usuario autenticado.
async function obtenerReviewPropia(clientUserId, reviewId) {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    include: { clientUser: { select: { fullName: true } } },
  });

  if (!review) {
    throw crearError(REVIEWS_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }
  if (review.clientUserId !== clientUserId) {
    throw crearError(REVIEWS_MESSAGES.NOT_OWNER, HTTP_STATUS.FORBIDDEN);
  }

  return review;
}

// Convierte filtros del query string en cláusulas WHERE/ORDER BY de Prisma.
// Valores inválidos se ignoran y caen en defaults.
function buildReviewQuery({ rating, date, helpful }) {
  const ratingNum = Number.parseInt(rating, 10);
  const filterRating =
    Number.isFinite(ratingNum) && ratingNum >= 1 && ratingNum <= 5
      ? { rating: ratingNum }
      : {};

  let orderBy;
  if (helpful === 'most_helpful') {
    orderBy = [{ helpfulVotes: 'desc' }, { createdAt: 'desc' }];
  } else {
    orderBy = [{ createdAt: date === 'oldest' ? 'asc' : 'desc' }];
  }

  return { filterRating, orderBy };
}

// Calcula promedio + total + distribución sobre TODAS las reseñas approved del producto
// (no se ve afectado por los filtros de listado, para que la cabecera muestre el total real).
async function buildRatingsSummary(productId) {
  const baseWhere = { productId, status: REVIEW_STATUS.APPROVED };

  const [aggregate, distribution] = await Promise.all([
    prisma.review.aggregate({
      where: baseWhere,
      _count: { _all: true },
      _avg: { rating: true },
    }),
    prisma.review.groupBy({
      by: ['rating'],
      where: baseWhere,
      _count: { _all: true },
    }),
  ]);

  const summary = {
    productId: productId.toString(),
    average: aggregate._avg.rating
      ? Math.round(aggregate._avg.rating * 10) / 10
      : 0,
    totalReviews: aggregate._count._all,
    stars1: 0,
    stars2: 0,
    stars3: 0,
    stars4: 0,
    stars5: 0,
  };
  for (const row of distribution) {
    const key = `stars${row.rating}`;
    if (key in summary) summary[key] = row._count._all;
  }
  return summary;
}

// ─── Endpoints autenticados ────────────────────────────────────────────────

export const obtenerMisProductosConReviews = async (
  userId,
  { skip, take, page, limit },
) => {
  const userIdBig = toBigIntOrThrow(userId, REVIEWS_MESSAGES.GET_BY_PRODUCT_FAILED);

  const orderItems = await prisma.orderItem.findMany({
    where: {
      order: { clientUserId: userIdBig, status: COMPLETED_ORDER_STATUS },
    },
    include: {
      order: { select: { id: true, status: true, createdAt: true } },
      variant: {
        include: {
          product: { include: { item: { select: { name: true } } } },
        },
      },
    },
    orderBy: { order: { createdAt: 'desc' } },
  });

  // Dedup por productId (un producto comprado varias veces aparece una sola vez).
  const seen = new Set();
  const unicos = orderItems.filter((oi) => {
    const pid = oi.variant.productId.toString();
    if (seen.has(pid)) return false;
    seen.add(pid);
    return true;
  });

  const total = unicos.length;
  const slice = unicos.slice(skip, skip + take);
  if (slice.length === 0) return paginatedResponse([], page, limit, total);

  const productIds = slice.map((oi) => oi.variant.productId);
  const reviews = await prisma.review.findMany({
    where: { clientUserId: userIdBig, productId: { in: productIds } },
    include: { clientUser: { select: { fullName: true } } },
  });
  const reviewsByProduct = new Map(reviews.map((r) => [r.productId.toString(), r]));

  const data = slice.map((oi) => {
    const { product } = oi.variant;
    const review = reviewsByProduct.get(product.itemId.toString()) ?? null;
    return {
      product: {
        orderId: oi.orderId.toString(),
        orderStatus: oi.order.status,
        itemId: product.itemId.toString(),
        variantId: oi.variantId.toString(),
        name: product.item.name,
        imageUrl: product.imageUrl,
        price: oi.variant.price.toString(),
        purchasedAt: oi.order.createdAt.toISOString(),
        variant: {
          id: oi.variant.id.toString(),
          color: oi.variant.color,
          size: oi.variant.size,
          price: oi.variant.price.toString(),
        },
      },
      review: review ? mapReview(review) : null,
    };
  });

  return paginatedResponse(data, page, limit, total);
};

// ─── Endpoints públicos ────────────────────────────────────────────────────

export const obtenerPorProducto = async (
  productId,
  { skip, take, page, limit, rating, date, helpful },
) => {
  const idBig = toBigIntOrThrow(productId, REVIEWS_MESSAGES.INVALID_PRODUCT_ID);
  const { filterRating, orderBy } = buildReviewQuery({ rating, date, helpful });

  const where = { productId: idBig, status: REVIEW_STATUS.APPROVED, ...filterRating };

  const [reviews, total, summary] = await Promise.all([
    prisma.review.findMany({
      where,
      include: { clientUser: { select: { fullName: true } }, response: true },
      orderBy,
      skip,
      take,
    }),
    prisma.review.count({ where }),
    buildRatingsSummary(idBig),
  ]);

  return {
    ...paginatedResponse(reviews.map(mapReview), page, limit, total),
    summary,
  };
};

export const crear = async (userId, { productId, rating, comment }) => {
  const userIdBig = toBigIntOrThrow(userId, REVIEWS_MESSAGES.CREATE_FAILED);
  const productIdBig = toBigIntOrThrow(productId, REVIEWS_MESSAGES.INVALID_PRODUCT_ID);

  await verificarCompraCompletada(userIdBig, productIdBig);

  try {
    const nueva = await prisma.review.create({
      data: {
        productId: productIdBig,
        clientUserId: userIdBig,
        rating,
        comment,
        status: REVIEW_STATUS.APPROVED,
      },
      include: { clientUser: { select: { fullName: true } } },
    });
    return mapReview(nueva);
  } catch (error) {
    if (error.code === PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT) {
      throw crearError(REVIEWS_MESSAGES.ALREADY_EXISTS, HTTP_STATUS.CONFLICT);
    }
    throw error;
  }
};

export const actualizar = async (userId, reviewId, { rating, comment }) => {
  const userIdBig = toBigIntOrThrow(userId, REVIEWS_MESSAGES.UPDATE_FAILED);
  const reviewIdBig = toBigIntOrThrow(reviewId, REVIEWS_MESSAGES.INVALID_REVIEW_ID);

  await obtenerReviewPropia(userIdBig, reviewIdBig);

  const actualizada = await prisma.review.update({
    where: { id: reviewIdBig },
    data: { rating, comment, edited: true },
    include: { clientUser: { select: { fullName: true } } },
  });

  return mapReview(actualizada);
};

export const eliminar = async (userId, reviewId) => {
  const userIdBig = toBigIntOrThrow(userId, REVIEWS_MESSAGES.DELETE_FAILED);
  const reviewIdBig = toBigIntOrThrow(reviewId, REVIEWS_MESSAGES.INVALID_REVIEW_ID);

  await obtenerReviewPropia(userIdBig, reviewIdBig);

  await prisma.$transaction([
    prisma.reviewVote.deleteMany({ where: { reviewId: reviewIdBig } }),
    prisma.reviewResponse.deleteMany({ where: { reviewId: reviewIdBig } }),
    prisma.review.delete({ where: { id: reviewIdBig } }),
  ]);
};

// Eliminación por moderación (US-REV-006): un admin elimina la reseña de otro usuario
// indicando un motivo. No valida propiedad (la autorización la cubre requireAdmin).
// Borra en cascada los votos (la respuesta del admin cae por onDelete: Cascade).
export const eliminarComoModerador = async (
  moderatorId,
  reviewId,
  { reasonCode, reasonDetail },
) => {
  const reviewIdBig = toBigIntOrThrow(reviewId, REVIEWS_MESSAGES.INVALID_REVIEW_ID);

  const review = await prisma.review.findUnique({
    where: { id: reviewIdBig },
    select: { id: true },
  });
  if (!review) {
    throw crearError(REVIEWS_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  await prisma.$transaction([
    prisma.reviewVote.deleteMany({ where: { reviewId: reviewIdBig } }),
    prisma.review.delete({ where: { id: reviewIdBig } }),
  ]);

  // Trazabilidad de la acción de moderación. El registro persistente en una tabla de
  // auditoría es una tarea aparte de US-REV-006 (#8), aún fuera de alcance.
  const safeDetail = reasonDetail ? reasonDetail.replace(/[\r\n\t]/g, ' ') : '';
  const detalle = safeDetail ? ` (${safeDetail})` : '';
  console.info(
    `[moderación] Reseña ${reviewId} eliminada por admin ${moderatorId}. Motivo: ${reasonCode}${detalle}`,
  );
};



// Asegura que la reseña exista; devuelve su id y la respuesta actual (o null).
async function obtenerReviewConRespuesta(reviewId) {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { id: true, response: { select: { id: true } } },
  });

  if (!review) {
    throw crearError(REVIEWS_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return review;
}

// Recupera la respuesta mapeada de una reseña tras crear/actualizar.
async function obtenerRespuestaMapeada(reviewId) {
  const response = await prisma.reviewResponse.findUnique({
    where: { reviewId },
  });
  return mapReviewResponse(response);
}

export const responderReview = async (userId, reviewId, { content }) => {
  const userIdBig = toBigIntOrThrow(userId, REVIEWS_MESSAGES.UPDATE_FAILED);
  const reviewIdBig = toBigIntOrThrow(reviewId, REVIEWS_MESSAGES.INVALID_REVIEW_ID);

  const review = await obtenerReviewConRespuesta(reviewIdBig);
  if (review.response) {
    throw crearError(REVIEWS_MESSAGES.RESPONSE_ALREADY_EXISTS, HTTP_STATUS.CONFLICT);
  }

  await prisma.reviewResponse.create({
    data: { reviewId: reviewIdBig, adminUserId: userIdBig, content },
  });

  return obtenerRespuestaMapeada(reviewIdBig);
};

export const actualizarRespuesta = async (userId, reviewId, { content }) => {
  const reviewIdBig = toBigIntOrThrow(reviewId, REVIEWS_MESSAGES.INVALID_REVIEW_ID);

  const review = await obtenerReviewConRespuesta(reviewIdBig);
  if (!review.response) {
    throw crearError(REVIEWS_MESSAGES.RESPONSE_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  await prisma.reviewResponse.update({
    where: { reviewId: reviewIdBig },
    data: { content },
  });

  return obtenerRespuestaMapeada(reviewIdBig);
};

export const eliminarRespuesta = async (userId, reviewId) => {
  const reviewIdBig = toBigIntOrThrow(reviewId, REVIEWS_MESSAGES.INVALID_REVIEW_ID);

  const review = await obtenerReviewConRespuesta(reviewIdBig);
  if (!review.response) {
    throw crearError(REVIEWS_MESSAGES.RESPONSE_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  await prisma.reviewResponse.delete({ where: { reviewId: reviewIdBig } });
};

// ─── Votación de reseñas (US-REV-003) ──────────────────────────────────────

// Devuelve la reseña destino o lanza si no existe / es propia del usuario.
async function asegurarReviewVotable(clientUserId, reviewId) {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { id: true, clientUserId: true, helpfulVotes: true, unhelpfulVotes: true },
  });

  if (!review) {
    throw crearError(REVIEWS_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }
  if (review.clientUserId === clientUserId) {
    throw crearError(REVIEWS_MESSAGES.VOTE_OWN_REVIEW, HTTP_STATUS.FORBIDDEN);
  }
  return review;
}

// Mapea voteType al campo del contador en Review.
function counterFieldFor(voteType) {
  return voteType === VOTE_TYPES.HELPFUL ? 'helpfulVotes' : 'unhelpfulVotes';
}

export const votarReview = async (userId, reviewId, { voteType }) => {
  const userIdBig = toBigIntOrThrow(userId, REVIEWS_MESSAGES.UPDATE_FAILED);
  const reviewIdBig = toBigIntOrThrow(reviewId, REVIEWS_MESSAGES.INVALID_REVIEW_ID);

  await asegurarReviewVotable(userIdBig, reviewIdBig);

  const existente = await prisma.reviewVote.findUnique({
    where: { reviewId_clientUserId: { reviewId: reviewIdBig, clientUserId: userIdBig } },
  });

  // Caso A: mismo voto → idempotente, no hace nada
  if (existente && existente.voteType === voteType) {
    return { voteType };
  }

  await prisma.$transaction(async (tx) => {
    if (!existente) {
      // Caso B: voto nuevo → insertar + incrementar contador
      await tx.reviewVote.create({
        data: { reviewId: reviewIdBig, clientUserId: userIdBig, voteType },
      });
      await tx.review.update({
        where: { id: reviewIdBig },
        data: { [counterFieldFor(voteType)]: { increment: 1 } },
      });
    } else {
      // Caso C: cambio de voto → -1 al anterior, +1 al nuevo
      await tx.reviewVote.update({
        where: { id: existente.id },
        data: { voteType },
      });
      await tx.review.update({
        where: { id: reviewIdBig },
        data: {
          [counterFieldFor(existente.voteType)]: { decrement: 1 },
          [counterFieldFor(voteType)]: { increment: 1 },
        },
      });
    }
  });

  return { voteType };
};

export const retirarVoto = async (userId, reviewId) => {
  const userIdBig = toBigIntOrThrow(userId, REVIEWS_MESSAGES.UPDATE_FAILED);
  const reviewIdBig = toBigIntOrThrow(reviewId, REVIEWS_MESSAGES.INVALID_REVIEW_ID);

  const existente = await prisma.reviewVote.findUnique({
    where: { reviewId_clientUserId: { reviewId: reviewIdBig, clientUserId: userIdBig } },
  });

  if (!existente) {
    throw crearError(REVIEWS_MESSAGES.VOTE_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  await prisma.$transaction([
    prisma.reviewVote.delete({ where: { id: existente.id } }),
    prisma.review.update({
      where: { id: reviewIdBig },
      data: { [counterFieldFor(existente.voteType)]: { decrement: 1 } },
    }),
  ]);
};

// Devuelve { reviewId: voteType } solo para las reseñas pasadas que tienen voto.
export const obtenerMisVotos = async (userId, reviewIdsRaw) => {
  if (!Array.isArray(reviewIdsRaw) || reviewIdsRaw.length === 0) return {};

  const userIdBig = toBigIntOrThrow(userId, REVIEWS_MESSAGES.GET_BY_PRODUCT_FAILED);
  const reviewIds = reviewIdsRaw
    .map((raw) => {
      try {
        return BigInt(raw);
      } catch {
        return null;
      }
    })
    .filter((v) => v !== null);

  if (reviewIds.length === 0) return {};

  const votos = await prisma.reviewVote.findMany({
    where: { clientUserId: userIdBig, reviewId: { in: reviewIds } },
    select: { reviewId: true, voteType: true },
  });

  return Object.fromEntries(votos.map((v) => [v.reviewId.toString(), v.voteType]));
};
