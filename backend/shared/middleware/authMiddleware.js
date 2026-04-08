import jwt from 'jsonwebtoken';
import { crearError } from './errorHandler.js';
import { HTTP_STATUS } from '../constants/http.constants.js';

const AUTH_ERRORS = {
  TOKEN_MISSING: 'Token de autenticación requerido',
  TOKEN_INVALID: 'Token de autenticación inválido o expirado',
};

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return next(crearError(AUTH_ERRORS.TOKEN_MISSING, HTTP_STATUS.UNAUTHORIZED));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch {
    next(crearError(AUTH_ERRORS.TOKEN_INVALID, HTTP_STATUS.UNAUTHORIZED));
  }
};
