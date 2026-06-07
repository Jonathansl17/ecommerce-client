import 'dotenv/config';
import express from 'express';

// Prisma returns BigInt for id fields; JSON.stringify can't serialize them by default
BigInt.prototype.toJSON = function () { return this.toString(); };
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import { limpiarTokensExpirados } from './features/auth/auth.tokens.service.js';
import { iniciarMonitorInventarioBajo } from './features/notifications/low-stock/scheduler.service.js';
import authRoutes from './features/auth/auth.routes.js';
import passwordRecoveryRoutes from './features/password-recovery/password-recovery.routes.js';
import clientsRoutes from './features/clients/clients.routes.js';
import productsRoutes from './features/products/products.routes.js';
import notificationsRoutes from './features/notifications/notifications.routes.js';
import cartRoutes from './features/cart/cart.routes.js';
import ordersRoutes from './features/orders/orders.routes.js';
import reviewsRoutes from './features/reviews/reviews.routes.js';
import internalRoutes from './features/internal/internal.routes.js';
import { errorHandler } from './shared/middleware/errorHandler.js';
import { requireFetchHeader } from './shared/middleware/csrfMiddleware.js';

const app = express();
const PORT = process.env.PORT || 3001;

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:4001';

app.use(helmet());
app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  if (req.path.startsWith('/api/internal')) return next();
  return requireFetchHeader(req, res, next);
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  keyGenerator: (req) => ipKeyGenerator(req),
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

const refreshLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  keyGenerator: (req) => ipKeyGenerator(req),
  standardHeaders: true,
  legacyHeaders: false,
});

const recoveryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => ipKeyGenerator(req),
  standardHeaders: true,
  legacyHeaders: false,
});

const reviewWriteLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  keyGenerator: (req) => ipKeyGenerator(req),
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'GET',
});

const reviewReadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  keyGenerator: (req) => ipKeyGenerator(req),
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method !== 'GET',
});

app.use('/api/auth/login', loginLimiter);
app.use('/api/auth/refresh', refreshLimiter);
app.use('/api/password-recovery/request', recoveryLimiter);
app.use('/api/reviews', reviewReadLimiter);
app.use('/api/reviews', reviewWriteLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/password-recovery', passwordRecoveryRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/internal', internalRoutes);

app.use(errorHandler);

const CLEANUP_INTERVAL_MS = 24 * 60 * 60 * 1000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  iniciarMonitorInventarioBajo();

  setInterval(async () => {
    try {
      const count = await limpiarTokensExpirados();
      if (count > 0) console.log(`Tokens expirados eliminados: ${count}`);
    } catch (error) {
      console.error('Error limpiando tokens expirados:', error);
    }
  }, CLEANUP_INTERVAL_MS);
});
