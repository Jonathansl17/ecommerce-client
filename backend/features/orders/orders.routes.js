import { Router } from 'express';
import {
  actualizarEstadoPedido,
  aprobarPago,
  cancelarPedido,
  checkout,
  obtenerMisPedidos,
  obtenerPedidoPorId,
} from './orders.controller.js';
import { validateCheckout, validateUpdateOrderStatus } from './orders.validator.js';
import { requireAuth } from '../../shared/middleware/authMiddleware.js';
import { requireInternalApiKey } from '../../shared/middleware/internalApiKey.js';

const router = Router();

// Todas las rutas de órdenes requieren autenticación
router.use(requireAuth);

// POST /api/orders/checkout → convierte el carrito activo en una orden
//   Body: { shippingAddress, paymentMethod, externalReference? }
//   Operación atómica: crea Order + OrderItems + Payment, actualiza stock y carrito
router.post('/checkout', validateCheckout, checkout);

// POST /api/orders/:id/cancel → el cliente cancela su propio pedido (solo si está en pending_payment)
router.post('/:id/cancel', cancelarPedido);

// Admin-only: requires internal API key — not callable by regular authenticated users.
// Will be replaced by the backoffice trigger once order management is implemented.
router.patch('/:id/status', requireInternalApiKey, validateUpdateOrderStatus, actualizarEstadoPedido);

// Admin-only: requires internal API key — will be replaced by payment gateway webhook.
router.patch('/:orderId/payments/:paymentId/approve', requireInternalApiKey, aprobarPago);

// GET  /api/orders         → lista todos los pedidos del usuario autenticado
router.get('/', obtenerMisPedidos);

// GET  /api/orders/:id     → detalle completo de un pedido (con ítems y pagos)
router.get('/:id', obtenerPedidoPorId);

export default router;
