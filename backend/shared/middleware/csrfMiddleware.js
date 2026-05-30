import { crearError } from './errorHandler.js';
import { HTTP_STATUS } from '../constants/http.constants.js';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export const requireFetchHeader = (req, _res, next) => {
  if (SAFE_METHODS.has(req.method)) return next();

  const origin = req.headers['origin'];
  const expected = process.env.FRONTEND_ORIGIN;

  if (!origin || origin !== expected) {
    return next(crearError('Solicitud no permitida', HTTP_STATUS.FORBIDDEN));
  }

  return next();
};
