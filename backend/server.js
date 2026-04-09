import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { limpiarTokensExpirados } from './features/auth/auth.service.js';
import authRoutes from './features/auth/auth.routes.js';
import clientsRoutes from './features/clients/clients.routes.js';
import productsRoutes from './features/products/products.routes.js';
import notificationsRoutes from './features/notifications/notifications.routes.js';
import { errorHandler } from './shared/middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/notifications', notificationsRoutes);

app.use(errorHandler);

const CLEANUP_INTERVAL_MS = 24 * 60 * 60 * 1000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);

  setInterval(async () => {
    try {
      const count = await limpiarTokensExpirados();
      if (count > 0) console.log(`Tokens expirados eliminados: ${count}`);
    } catch (error) {
      console.error('Error limpiando tokens expirados:', error);
    }
  }, CLEANUP_INTERVAL_MS);
});
