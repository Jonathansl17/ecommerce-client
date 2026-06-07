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
import { validateNumericId } from '../../../shared/middleware/validateNumericId.js';

const router = Router();

router.get('/', validateListOrdersQuery, listarPedidos);
router.get('/:id', validateNumericId, obtenerPedidoPorId);
router.patch('/:id/status', validateNumericId, validateUpdateOrderStatus, actualizarEstadoPedido);
router.post('/:id/cancel', validateNumericId, cancelarPedido);

export default router;
