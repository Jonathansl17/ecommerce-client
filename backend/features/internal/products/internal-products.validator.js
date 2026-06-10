import { z } from 'zod';
import {
  INTERNAL_PRODUCTS_LIMITS,
  INTERNAL_PRODUCTS_MESSAGES,
  ITEM_STATUSES,
  PRODUCT_TYPES,
} from './internal-products.constants.js';

const variantSchema = z.object({
  color: z
    .string()
    .min(1, 'variant.color es requerido')
    .max(INTERNAL_PRODUCTS_LIMITS.COLOR_MAX, 'variant.color es demasiado largo'),
  size: z
    .string()
    .min(1, 'variant.size es requerido')
    .max(INTERNAL_PRODUCTS_LIMITS.SIZE_MAX, 'variant.size es demasiado largo'),
  price: z
    .number()
    .positive('variant.price debe ser positivo')
    .max(INTERNAL_PRODUCTS_LIMITS.PRICE_MAX, 'variant.price excede el maximo'),
  currentStock: z
    .number()
    .int('variant.currentStock debe ser entero')
    .nonnegative('variant.currentStock no puede ser negativo'),
  minThreshold: z
    .number()
    .int('variant.minThreshold debe ser entero')
    .nonnegative('variant.minThreshold no puede ser negativo'),
  // Solo se usa en creacion; en edicion el contrato indica no tocarlo.
  reservedStock: z
    .number()
    .int('variant.reservedStock debe ser entero')
    .nonnegative('variant.reservedStock no puede ser negativo')
    .optional()
    .default(0),
});

// El admin manda el estado completo tanto en creacion como en edicion,
// por lo que ambos endpoints comparten el mismo esquema de cuerpo.
const productSchema = z.object({
  name: z
    .string()
    .min(1, 'name es requerido')
    .max(INTERNAL_PRODUCTS_LIMITS.NAME_MAX, 'name excede el maximo de caracteres'),
  description: z
    .string()
    .max(INTERNAL_PRODUCTS_LIMITS.DESCRIPTION_MAX, 'description es demasiado larga')
    .optional(),
  imageUrl: z
    .string()
    .min(1, 'imageUrl es requerido')
    .max(INTERNAL_PRODUCTS_LIMITS.IMAGE_URL_MAX, 'imageUrl excede el maximo de caracteres')
    .url('imageUrl debe ser una URL valida'),
  category: z
    .string()
    .min(1, 'category es requerido')
    .max(INTERNAL_PRODUCTS_LIMITS.CATEGORY_MAX, 'category excede el maximo de caracteres'),
  type: z.enum(PRODUCT_TYPES),
  status: z.enum(ITEM_STATUSES),
  variant: variantSchema,
});

const itemIdParamSchema = z
  .string()
  .regex(/^\d+$/u, INTERNAL_PRODUCTS_MESSAGES.INVALID_ITEM_ID);

export function validateProductBody(req, res, next) {
  const result = productSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.issues[0].message });
  }
  req.body = result.data;
  next();
}

export function validateItemIdParam(req, res, next) {
  const result = itemIdParamSchema.safeParse(req.params.itemId);
  if (!result.success) {
    return res.status(400).json({ error: result.error.issues[0].message });
  }
  next();
}
