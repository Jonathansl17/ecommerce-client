import { Router } from 'express';
import {
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from './internal-products.controller.js';
import {
  validateProductBody,
  validateItemIdParam,
} from './internal-products.validator.js';

const router = Router();

router.post('/', validateProductBody, crearProducto);
router.patch('/:itemId', validateItemIdParam, validateProductBody, actualizarProducto);
router.delete('/:itemId', validateItemIdParam, eliminarProducto);

export default router;
