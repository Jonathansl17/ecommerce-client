import { Router } from 'express';
import { listarUsuarios } from './internal-users.controller.js';
import { validateListUsersQuery } from './internal-users.validator.js';

const router = Router();

router.get('/', validateListUsersQuery, listarUsuarios);

export default router;
