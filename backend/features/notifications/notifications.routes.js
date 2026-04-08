import { Router } from 'express';
import { obtenerNotificaciones, marcarComoLeida } from './notifications.controller.js';
import { requireAuth } from '../../shared/middleware/authMiddleware.js';

const router = Router();

// Todas las rutas de notificaciones requieren autenticación
router.use(requireAuth);

router.get('/', obtenerNotificaciones);
router.patch('/:id/read', marcarComoLeida);

export default router;
