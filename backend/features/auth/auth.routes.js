import { Router } from 'express';
import { registrar, login, logout } from './auth.controller.js';
import { validateRegister } from './auth.validator.js';
import { validateLogin } from './auth.login.validator.js';
import { requireAuth } from '../../shared/middleware/authMiddleware.js';

const router = Router();

router.post('/register', validateRegister, registrar);
router.post('/login', validateLogin, login);
router.post('/logout', requireAuth, logout);

export default router;
