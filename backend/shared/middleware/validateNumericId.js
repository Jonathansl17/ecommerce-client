import { crearError } from './errorHandler.js';
import { HTTP_STATUS } from '../constants/http.constants.js';

export const validateNumericId = (req, _res, next) => {
  if (!/^\d+$/u.test(req.params.id)) {
    return next(crearError('ID debe ser un entero positivo válido', HTTP_STATUS.BAD_REQUEST));
  }
  next();
};
