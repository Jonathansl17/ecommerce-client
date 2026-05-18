import { z } from 'zod';
import { INTERNAL_STOCK_LIMITS } from './internal-stock.constants.js';

const decrementItemSchema = z.object({
  variantId: z.string().regex(/^\d+$/u, 'variantId debe ser numerico'),
  quantity: z
    .number()
    .int('quantity debe ser entero')
    .min(INTERNAL_STOCK_LIMITS.MIN_QUANTITY, 'quantity debe ser positivo'),
});

const decrementSchema = z.object({
  items: z
    .array(decrementItemSchema)
    .min(INTERNAL_STOCK_LIMITS.MIN_ITEMS, 'Se requiere al menos 1 item')
    .max(
      INTERNAL_STOCK_LIMITS.MAX_ITEMS,
      `Maximo ${INTERNAL_STOCK_LIMITS.MAX_ITEMS} items por solicitud`,
    ),
});

export function validateDecrementStock(req, res, next) {
  const result = decrementSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: result.error.issues[0].message,
    });
  }
  req.body = result.data;
  next();
}
