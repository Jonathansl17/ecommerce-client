import { Router } from 'express';
import {
  obtenerTodos,
  obtenerPorId,
  actualizar,
  eliminar,
  obtenerPerfil,
  actualizarPerfil,
  cambiarContrasena,
  desactivarCuenta,
  reactivarCuenta,
} from './clients.controller.js';
import { requireAuth } from '../../shared/middleware/authMiddleware.js';
import { requireAdmin } from '../../shared/middleware/requireAdmin.js';
import { validateUpdateProfile, validateChangePassword, validateDeactivateAccount, validateReactivateAccount } from './clients.validator.js';

const router = Router();

// Self-service routes
router.post('/reactivate', validateReactivateAccount, reactivarCuenta);
router.get('/me', requireAuth, obtenerPerfil);
router.put('/me', requireAuth, validateUpdateProfile, actualizarPerfil);
router.put('/me/password', requireAuth, validateChangePassword, cambiarContrasena);
router.delete('/me', requireAuth, validateDeactivateAccount, desactivarCuenta);

// Admin-only routes
router.get('/', requireAuth, requireAdmin, obtenerTodos);
router.get('/:id', requireAuth, requireAdmin, obtenerPorId);
router.put('/:id', requireAuth, requireAdmin, actualizar);
router.delete('/:id', requireAuth, requireAdmin, eliminar);

export default router;