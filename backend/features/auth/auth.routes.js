import { Router } from 'express';
import { registrar, login } from './auth.controller.js';
import { validateRegister } from './auth.validator.js';
import { validateLogin } from './auth.login.validator.js';

const router = Router();

router.post('/register', validateRegister, registrar);
router.post('/login', validateLogin, login);

export default router;
