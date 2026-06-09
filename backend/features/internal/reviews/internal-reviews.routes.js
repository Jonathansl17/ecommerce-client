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
import { validateNumericId } from '../../../shared/middleware/validateNumericId.js';

const router = Router();

router.get('/stats', obtenerEstadisticasReviews);
router.get('/', validateListReviewsQuery, listarReviews);
router.get('/:id', validateNumericId, obtenerReviewPorId);
router.patch('/:id/status', validateNumericId, validateUpdateReviewStatus, actualizarEstadoReview);

export default router;
