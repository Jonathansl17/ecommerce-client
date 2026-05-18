import { z } from 'zod';
import { ORDER_STATUS_VALUES } from '../../orders/orders.constants.js';
import { INTERNAL_ORDERS_PAGINATION } from './internal-orders.constants.js';

const isoDateString = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: 'Fecha invalida (formato ISO esperado)',
  });

const listOrdersQuerySchema = z.object({
  status: z.enum(ORDER_STATUS_VALUES).optional(),
  clientUserId: z
    .string()
    .regex(/^\d+$/u, 'clientUserId debe ser numerico')
    .optional(),
  from: isoDateString.optional(),
  to: isoDateString.optional(),
  limit: z
    .string()
    .regex(/^\d+$/u, 'limit debe ser numerico')
    .optional(),
  offset: z
    .string()
    .regex(/^\d+$/u, 'offset debe ser numerico')
    .optional(),
});

const updateOrderStatusSchema = z.object({
  status: z.enum(ORDER_STATUS_VALUES),
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
      const { limit, offset, ...rest } = result.data;
      const parsedLimit = limit != null
        ? Math.min(
            Math.max(parseInt(limit, 10), 1),
            INTERNAL_ORDERS_PAGINATION.MAX_LIMIT,
          )
        : INTERNAL_ORDERS_PAGINATION.DEFAULT_LIMIT;
      const parsedOffset = offset != null
        ? Math.max(parseInt(offset, 10), INTERNAL_ORDERS_PAGINATION.MIN_OFFSET)
        : INTERNAL_ORDERS_PAGINATION.DEFAULT_OFFSET;

      req.validatedQuery = {
        ...rest,
        limit: parsedLimit,
        offset: parsedOffset,
      };
    } else {
      req.body = result.data;
    }
    next();
  };
}

export const validateListOrdersQuery = validar(listOrdersQuerySchema, 'query');
export const validateUpdateOrderStatus = validar(updateOrderStatusSchema, 'body');
