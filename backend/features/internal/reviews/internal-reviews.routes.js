import { Router } from 'express';
import {
  actualizarEstadoReview,
  listarReviews,
  obtenerEstadisticasReviews,
  obtenerReviewPorId,
} from './internal-reviews.controller.js';
import {
  validateListReviewsQuery,
  validateUpdateReviewStatus,
} from './internal-reviews.validator.js';

const router = Router();

router.get('/stats', obtenerEstadisticasReviews);
router.get('/', validateListReviewsQuery, listarReviews);
router.get('/:id', obtenerReviewPorId);
router.patch('/:id/status', validateUpdateReviewStatus, actualizarEstadoReview);

export default router;
