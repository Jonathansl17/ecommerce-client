import { Router } from 'express';
import {
  actualizarEstadoPedido,
  cancelarPedido,
  listarPedidos,
  obtenerPedidoPorId,
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

export default router;
