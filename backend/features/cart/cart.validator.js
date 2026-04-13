import { z } from 'zod';

const agregarItemSchema = z.object({
  variantId: z.number().int().positive(),
  quantity: z.number().int().min(1, 'La cantidad debe ser al menos 1'),
});

const actualizarCantidadSchema = z.object({
  quantity: z.number().int().min(1, 'La cantidad debe ser al menos 1'),
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

export const validateAgregarItem = validar(agregarItemSchema);
export const validateActualizarCantidad = validar(actualizarCantidadSchema);
