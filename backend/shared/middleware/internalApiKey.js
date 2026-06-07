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

  const expectedBuf = Buffer.from(expected);
  const providedBuf = Buffer.alloc(expectedBuf.length);
  Buffer.from(provided).copy(providedBuf, 0, 0, expectedBuf.length);
  const lengthMatch = Buffer.from(provided).length === expectedBuf.length;
  const valid = crypto.timingSafeEqual(expectedBuf, providedBuf) && lengthMatch;

  if (!valid) {
    return next(crearError(INVALID_KEY_MESSAGE, HTTP_STATUS.UNAUTHORIZED));
  }

  next();
}
