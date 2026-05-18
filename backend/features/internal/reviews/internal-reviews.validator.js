import { z } from 'zod';
import {
  INTERNAL_REVIEWS_PAGINATION,
  REVIEW_RATING,
  REVIEW_STATUSES,
} from './internal-reviews.constants.js';

const listReviewsQuerySchema = z.object({
  status: z.enum(REVIEW_STATUSES).optional(),
  productId: z
    .string()
    .regex(/^\d+$/u, 'productId debe ser numerico')
    .optional(),
  clientUserId: z
    .string()
    .regex(/^\d+$/u, 'clientUserId debe ser numerico')
    .optional(),
  rating: z
    .string()
    .regex(/^[1-5]$/u, 'rating debe estar entre 1 y 5')
    .optional(),
  limit: z
    .string()
    .regex(/^\d+$/u, 'limit debe ser numerico')
    .optional(),
  offset: z
    .string()
    .regex(/^\d+$/u, 'offset debe ser numerico')
    .optional(),
});

const updateReviewStatusSchema = z.object({
  status: z.enum(REVIEW_STATUSES),
});

function validar(schema, source) {
  return (req, res, next) => {
    const data = source === 'query' ? req.query : req.body;
    const result = schema.safeParse(data);
    if (!result.success) {
      return res.status(400).json({
        error: result.error.issues[0].message,
      });
    }

    if (source === 'query') {
      const { limit, offset, rating, ...rest } = result.data;
      const parsedLimit = limit != null
        ? Math.min(
            Math.max(parseInt(limit, 10), 1),
            INTERNAL_REVIEWS_PAGINATION.MAX_LIMIT,
          )
        : INTERNAL_REVIEWS_PAGINATION.DEFAULT_LIMIT;
      const parsedOffset = offset != null
        ? Math.max(
            parseInt(offset, 10),
            INTERNAL_REVIEWS_PAGINATION.MIN_OFFSET,
          )
        : INTERNAL_REVIEWS_PAGINATION.DEFAULT_OFFSET;
      const parsedRating = rating != null ? parseInt(rating, 10) : undefined;

      req.validatedQuery = {
        ...rest,
        rating: parsedRating,
        limit: parsedLimit,
        offset: parsedOffset,
      };
    } else {
      req.body = result.data;
    }
    next();
  };
}

export const validateListReviewsQuery = validar(listReviewsQuerySchema, 'query');
export const validateUpdateReviewStatus = validar(updateReviewStatusSchema, 'body');

export { REVIEW_RATING };
