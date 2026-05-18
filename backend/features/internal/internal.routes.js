import { Router } from 'express';
import { requireInternalApiKey } from '../../shared/middleware/internalApiKey.js';
import internalOrdersRoutes from './orders/internal-orders.routes.js';
import internalUsersRoutes from './users/internal-users.routes.js';
import internalStockRoutes from './stock/internal-stock.routes.js';
import internalReviewsRoutes from './reviews/internal-reviews.routes.js';

const router = Router();

// Todas las rutas internas requieren la API key compartida con el admin backend.
router.use(requireInternalApiKey);

router.use('/orders', internalOrdersRoutes);
router.use('/users', internalUsersRoutes);
router.use('/stock', internalStockRoutes);
router.use('/reviews', internalReviewsRoutes);

export default router;
