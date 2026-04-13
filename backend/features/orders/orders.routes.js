import { Router } from 'express';
import { checkout, obtenerMisPedidos, obtenerPedidoPorId } from './orders.controller.js';
import { validateCheckout } from './orders.validator.js';
import { requireAuth } from '../../shared/middleware/authMiddleware.js';

const router = Router();

// Todas las rutas de órdenes requieren autenticación
router.use(requireAuth);

// POST /api/orders/checkout → convierte el carrito activo en una orden
//   Body: { shippingAddress, paymentMethod, externalReference? }
//   Operación atómica: crea Order + OrderItems + Payment, actualiza stock y carrito
router.post('/checkout', validateCheckout, checkout);

// GET  /api/orders         → lista todos los pedidos del usuario autenticado
router.get('/', obtenerMisPedidos);

// GET  /api/orders/:id     → detalle completo de un pedido (con ítems y pagos)
router.get('/:id', obtenerPedidoPorId);

export default router;
