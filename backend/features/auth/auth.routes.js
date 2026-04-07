import { Router } from 'express';
import { registrar } from './auth.controller.js';
import { validateRegister } from './auth.validator.js';

const router = Router();

router.post('/register', validateRegister, registrar);

export default router;
