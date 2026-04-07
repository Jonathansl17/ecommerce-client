import { Router } from 'express';
import { obtenerTodos, obtenerPorId, obtenerPorCategoria } from './products.controller.js';

const router = Router();

router.get('/', obtenerTodos);
router.get('/categoria/:categoriaId', obtenerPorCategoria);
router.get('/:id', obtenerPorId);

export default router;
