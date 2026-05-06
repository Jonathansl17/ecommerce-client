import { Router } from 'express';
import {
  obtenerMisProductos,
  obtenerMisVotos,
  obtenerPorProducto,
  crear,
  actualizar,
  eliminar,
  votar,
  retirarVoto,
} from './reviews.controller.js';
import {
  validateCrear,
  validateActualizar,
  validateVotar,
} from './reviews.validator.js';
import { requireAuth } from '../../shared/middleware/authMiddleware.js';

const router = Router();

// GET /api/reviews/me                  → productos comprados + mis reseñas (auth)
router.get('/me', requireAuth, obtenerMisProductos);

// GET /api/reviews/me/votes?reviewIds=1,2,3  → mis votos en esas reseñas (auth)
router.get('/me/votes', requireAuth, obtenerMisVotos);

// GET /api/reviews/product/:productId  → reseñas aprobadas (público)
router.get('/product/:productId', obtenerPorProducto);

// POST   /api/reviews            → crear reseña (US-REV-001)
router.post('/', requireAuth, validateCrear, crear);

// PUT    /api/reviews/:reviewId  → editar reseña propia (US-REV-004)
router.put('/:reviewId', requireAuth, validateActualizar, actualizar);

// DELETE /api/reviews/:reviewId  → eliminar reseña propia (US-REV-004)
router.delete('/:reviewId', requireAuth, eliminar);

// POST   /api/reviews/:reviewId/vote   → votar útil/no útil (US-REV-003)
router.post('/:reviewId/vote', requireAuth, validateVotar, votar);

// DELETE /api/reviews/:reviewId/vote   → retirar voto propio (US-REV-003)
router.delete('/:reviewId/vote', requireAuth, retirarVoto);

export default router;
