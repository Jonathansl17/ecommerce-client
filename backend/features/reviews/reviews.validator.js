import { z } from 'zod';
import {
  REVIEW_LIMITS,
  REVIEW_RESPONSE_LIMITS,
  REVIEWS_MESSAGES,
  VOTE_TYPES,
} from './reviews.constants.js';

const ratingField = z
  .number()
  .int()
  .min(REVIEW_LIMITS.RATING_MIN, `La calificación debe ser entre ${REVIEW_LIMITS.RATING_MIN} y ${REVIEW_LIMITS.RATING_MAX}`)
  .max(REVIEW_LIMITS.RATING_MAX, `La calificación debe ser entre ${REVIEW_LIMITS.RATING_MIN} y ${REVIEW_LIMITS.RATING_MAX}`);

const commentField = z
  .string()
  .trim()
  .min(REVIEW_LIMITS.COMMENT_MIN, `El comentario debe tener al menos ${REVIEW_LIMITS.COMMENT_MIN} caracteres`)
  .max(REVIEW_LIMITS.COMMENT_MAX, `El comentario no puede superar ${REVIEW_LIMITS.COMMENT_MAX} caracteres`);

const crearReviewSchema = z.object({
  productId: z.number().int().positive(),
  rating: ratingField,
  comment: commentField,
});

const actualizarReviewSchema = z.object({
  rating: ratingField,
  comment: commentField,
});

const votarReviewSchema = z.object({
  voteType: z.enum([VOTE_TYPES.HELPFUL, VOTE_TYPES.UNHELPFUL], {
    message: REVIEWS_MESSAGES.VOTE_INVALID_TYPE,
  }),
});

const responderReviewSchema = z.object({
  content: z
    .string()
    .trim()
    .min(REVIEW_RESPONSE_LIMITS.CONTENT_MIN, 'La respuesta no puede estar vacía')
    .max(
      REVIEW_RESPONSE_LIMITS.CONTENT_MAX,
      `La respuesta no puede superar los ${REVIEW_RESPONSE_LIMITS.CONTENT_MAX} caracteres`,
    ),
});

function validar(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: result.error.issues[0].message,
      });
    }
    req.body = result.data;
    next();
  };
}

export const validateCrear = validar(crearReviewSchema);
export const validateActualizar = validar(actualizarReviewSchema);
export const validateVotar = validar(votarReviewSchema);
export const validateResponder = validar(responderReviewSchema);
