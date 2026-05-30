import { z } from 'zod';
import { ORDER_STATUS_VALUES } from './orders.constants.js';

const checkoutSchema = z.object({
  shippingAddress: z
    .string()
    .min(10, 'La dirección debe tener al menos 10 caracteres')
    .max(300),
  paymentMethod: z.enum(['SINPE', 'cash', 'card', 'other']),
  // Referencia externa opcional (número SINPE, comprobante, etc.)
  externalReference: z.string().max(100).optional().default(''),
});

const updateOrderStatusSchema = z.object({
  status: z.enum(ORDER_STATUS_VALUES),
  cancelationReason: z.string().max(500).optional(),
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

export const validateCheckout = validar(checkoutSchema);
export const validateUpdateOrderStatus = validar(updateOrderStatusSchema);
