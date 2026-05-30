import { Router } from 'express';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
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
router.get('/payments/:paymentId/receipt', receiptLimiter, descargarComprobantePago);
router.post('/product-customization/:orderId/approve', aprobarProductoPersonalizado);
router.post('/product-customization/:orderId/request-adjustments', solicitarAjustesProductoPersonalizado);

export default router;
