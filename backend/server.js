import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './features/auth/auth.routes.js';
import clientsRoutes from './features/clients/clients.routes.js';
import productsRoutes from './features/products/products.routes.js';
import { errorHandler } from './shared/middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/products', productsRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
