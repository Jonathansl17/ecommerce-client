import { z } from 'zod';

const bigIntIdSchema = z
  .union([z.string(), z.number()])
  .transform((v) => String(v))
  .refine((v) => /^\d+$/.test(v) && BigInt(v) > 0n, {
    message: 'El ID debe ser un entero positivo',
  });

const agregarItemSchema = z.object({
  variantId: bigIntIdSchema,
  quantity: z.number().int().min(1, 'La cantidad debe ser al menos 1').max(100, 'La cantidad máxima es 100'),
});

const actualizarCantidadSchema = z.object({
  quantity: z.number().int().min(1, 'La cantidad debe ser al menos 1').max(100, 'La cantidad máxima es 100'),
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
