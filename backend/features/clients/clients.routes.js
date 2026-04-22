import { Router } from 'express';
import { obtenerTodos, obtenerPorId, actualizar, eliminar, obtenerPerfil } from './clients.controller.js';
import { requireAuth } from '../../shared/middleware/authMiddleware.js';

const router = Router();

router.get('/', obtenerTodos);
router.get('/me', requireAuth, obtenerPerfil);
router.get('/:id', obtenerPorId);
router.put('/:id', actualizar);
router.delete('/:id', eliminar);

export default router;
