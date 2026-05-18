import { z } from 'zod';
import { INTERNAL_USERS_PAGINATION } from './internal-users.constants.js';

const listUsersQuerySchema = z.object({
  email: z.string().max(150).optional(),
  limit: z
    .string()
    .regex(/^\d+$/u, 'limit debe ser numerico')
    .optional(),
  offset: z
    .string()
    .regex(/^\d+$/u, 'offset debe ser numerico')
    .optional(),
});

export function validateListUsersQuery(req, res, next) {
  const result = listUsersQuerySchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({
      error: result.error.issues[0].message,
    });
  }

  const { limit, offset, email } = result.data;
  const parsedLimit = limit != null
    ? Math.min(
        Math.max(parseInt(limit, 10), 1),
        INTERNAL_USERS_PAGINATION.MAX_LIMIT,
      )
    : INTERNAL_USERS_PAGINATION.DEFAULT_LIMIT;
  const parsedOffset = offset != null
    ? Math.max(parseInt(offset, 10), INTERNAL_USERS_PAGINATION.MIN_OFFSET)
    : INTERNAL_USERS_PAGINATION.DEFAULT_OFFSET;

  req.validatedQuery = {
    email,
    limit: parsedLimit,
    offset: parsedOffset,
  };
  next();
}
