import { Router } from 'express';
import {
  descargarComprobantePago,
  marcarComoLeida,
  obtenerNotificaciones,
} from './notifications.controller.js';
import { requireAuth } from '../../shared/middleware/authMiddleware.js';

const router = Router();

// Todas las rutas de notificaciones requieren autenticación
router.use(requireAuth);

router.get('/', obtenerNotificaciones);
router.patch('/:id/read', marcarComoLeida);
router.get('/payments/:paymentId/receipt', descargarComprobantePago);

export default router;
