import crypto from 'node:crypto';
import { crearError } from './errorHandler.js';
import { HTTP_STATUS } from '../constants/http.constants.js';

const HEADER_NAME = 'x-admin-api-key';
const MISSING_KEY_MESSAGE = 'Falta el header de autenticacion interna';
const INVALID_KEY_MESSAGE = 'Credenciales internas invalidas';
const SERVER_MISCONFIG_MESSAGE = 'ADMIN_API_KEY no configurado en el servidor';

export function requireInternalApiKey(req, res, next) {
  const expected = process.env.ADMIN_API_KEY;

  if (!expected) {
    return next(
      crearError(SERVER_MISCONFIG_MESSAGE, HTTP_STATUS.INTERNAL_ERROR),
    );
  }

  const provided = req.headers[HEADER_NAME];

  if (!provided) {
    return next(crearError(MISSING_KEY_MESSAGE, HTTP_STATUS.UNAUTHORIZED));
  }

  const hmac = (value) =>
    crypto.createHmac('sha256', 'internal-key-compare').update(value).digest();
  const valid = crypto.timingSafeEqual(hmac(expected), hmac(provided));

  if (!valid) {
    return next(crearError(INVALID_KEY_MESSAGE, HTTP_STATUS.UNAUTHORIZED));
  }

  next();
}
