import { Router } from 'express';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import {
  aprobarProductoPersonalizado,
  descargarComprobantePago,
  descartarNotificacion,
  marcarComoLeida,
  obtenerNotificaciones,
  solicitarAjustesProductoPersonalizado,
} from './notifications.controller.js';
import { requireAuth } from '../../shared/middleware/authMiddleware.js';

const router = Router();

const notificationsLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  keyGenerator: (req) => `${ipKeyGenerator(req)}:${req.user?.id ?? 'anon'}`,
  standardHeaders: true,
  legacyHeaders: false,
});

const receiptLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  keyGenerator: (req) => `${ipKeyGenerator(req)}:${req.user?.id ?? 'anon'}`,
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(requireAuth);
router.use(notificationsLimiter);

router.get('/', obtenerNotificaciones);
router.patch('/:id/read', marcarComoLeida);
router.patch('/:id/dismiss', descartarNotificacion);
router.get('/payments/:paymentId/receipt', receiptLimiter, descargarComprobantePago);
router.post('/product-customization/:orderId/approve', aprobarProductoPersonalizado);
router.post('/product-customization/:orderId/request-adjustments', solicitarAjustesProductoPersonalizado);

export default router;
