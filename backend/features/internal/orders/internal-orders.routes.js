import { Router } from 'express';
import {
  actualizarEstadoPedido,
  cancelarPedido,
  listarPedidos,
  obtenerPedidoPorId,
  aprobarPago,
} from './internal-orders.controller.js';
import {
  validateListOrdersQuery,
  validateUpdateOrderStatus,
} from './internal-orders.validator.js';

const router = Router();

router.get('/', validateListOrdersQuery, listarPedidos);
router.get('/:id', obtenerPedidoPorId);
router.patch('/:id/status', validateUpdateOrderStatus, actualizarEstadoPedido);
router.post('/:id/cancel', cancelarPedido);
router.patch('/:id/payments/:paymentId/approve', aprobarPago);

export default router;
