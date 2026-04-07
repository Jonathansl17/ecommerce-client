import { Router } from 'express';
import { obtenerTodos, obtenerPorId, actualizar, eliminar } from './clients.controller.js';

const router = Router();

router.get('/', obtenerTodos);
router.get('/:id', obtenerPorId);
router.put('/:id', actualizar);
router.delete('/:id', eliminar);

export default router;
