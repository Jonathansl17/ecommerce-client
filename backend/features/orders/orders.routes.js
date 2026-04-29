import { Router } from 'express';
import {
  actualizarEstadoPedido,
  aprobarPago,
  checkout,
  obtenerMisPedidos,
  obtenerPedidoPorId,
} from './orders.controller.js';
import { validateCheckout, validateUpdateOrderStatus } from './orders.validator.js';
import { requireAuth } from '../../shared/middleware/authMiddleware.js';

const router = Router();

// Todas las rutas de órdenes requieren autenticación
router.use(requireAuth);

// POST /api/orders/checkout → convierte el carrito activo en una orden
//   Body: { shippingAddress, paymentMethod, externalReference? }
//   Operación atómica: crea Order + OrderItems + Payment, actualiza stock y carrito
router.post('/checkout', validateCheckout, checkout);

// TODO(order_status_notification): this provisional route exists because the admin/backoffice
// order-management flow is not implemented yet. Replace it with the future privileged trigger.
router.patch('/:id/status', validateUpdateOrderStatus, actualizarEstadoPedido);

// TODO(payment_gateway): replace with webhook handler from payment gateway once integrated.
router.patch('/:orderId/payments/:paymentId/approve', aprobarPago);

// GET  /api/orders         → lista todos los pedidos del usuario autenticado
router.get('/', obtenerMisPedidos);

// GET  /api/orders/:id     → detalle completo de un pedido (con ítems y pagos)
router.get('/:id', obtenerPedidoPorId);

export default router;
