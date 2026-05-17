import { Router } from 'express';
import {
  aprobarProductoPersonalizado,
  descargarComprobantePago,
  marcarComoLeida,
  obtenerNotificaciones,
  solicitarAjustesProductoPersonalizado,
} from './notifications.controller.js';
import { requireAuth } from '../../shared/middleware/authMiddleware.js';

const router = Router();

// Todas las rutas de notificaciones requieren autenticación
router.use(requireAuth);

router.get('/', obtenerNotificaciones);
router.patch('/:id/read', marcarComoLeida);
router.get('/payments/:paymentId/receipt', descargarComprobantePago);
router.post('/product-customization/:orderId/approve', aprobarProductoPersonalizado);
router.post('/product-customization/:orderId/request-adjustments', solicitarAjustesProductoPersonalizado);

export default router;
