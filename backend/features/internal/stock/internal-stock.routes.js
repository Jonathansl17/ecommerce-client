import { Router } from 'express';
import { decrementarStock } from './internal-stock.controller.js';
import { validateDecrementStock } from './internal-stock.validator.js';

const router = Router();

router.post('/decrement', validateDecrementStock, decrementarStock);

export default router;
