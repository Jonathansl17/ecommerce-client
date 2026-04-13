import { Router } from 'express';
import { obtenerCarrito, agregarItem, actualizarCantidad, eliminarItem } from './cart.controller.js';
import { validateAgregarItem, validateActualizarCantidad } from './cart.validator.js';
import { requireAuth } from '../../shared/middleware/authMiddleware.js';

const router = Router();

// Todas las rutas del carrito requieren autenticación
router.use(requireAuth);

// GET  /api/cart          → carrito activo con ítems, subtotal, taxes, total
router.get('/', obtenerCarrito);

// POST /api/cart/items    → agregar ítem (variantId, quantity)
router.post('/items', validateAgregarItem, agregarItem);

// PUT  /api/cart/items/:itemId → actualizar cantidad
router.put('/items/:itemId', validateActualizarCantidad, actualizarCantidad);

// DELETE /api/cart/items/:itemId → eliminar ítem
router.delete('/items/:itemId', eliminarItem);

export default router;
