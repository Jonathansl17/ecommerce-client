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
} from './clients.controller.js';
import { requireAuth } from '../../shared/middleware/authMiddleware.js';
import { validateUpdateProfile, validateChangePassword, validateDeactivateAccount } from './clients.validator.js';

const router = Router();

router.get('/', obtenerTodos);
router.get('/me', requireAuth, obtenerPerfil);
router.put('/me', requireAuth, validateUpdateProfile, actualizarPerfil);
router.put('/me/password', requireAuth, validateChangePassword, cambiarContrasena);
router.delete('/me', requireAuth, validateDeactivateAccount, desactivarCuenta);
router.get('/:id', obtenerPorId);
router.put('/:id', actualizar);
router.delete('/:id', eliminar);

export default router;