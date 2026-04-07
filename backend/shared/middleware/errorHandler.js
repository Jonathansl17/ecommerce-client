import { HTTP_STATUS, HTTP_MESSAGES } from '../constants/http.constants.js';
import { PRISMA_ERROR_CODES } from '../constants/app.constants.js';

export const crearError = (mensaje, statusCode) => {
  const error = new Error(mensaje);
  error.statusCode = statusCode;
  error.esControlado = true;
  return error;
};

export const errorHandler = (error, req, res, next) => {
  if (error.esControlado) {
    return res.status(error.statusCode).json({ error: error.message });
  }

  if (error.code === PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT) {
    return res.status(HTTP_STATUS.CONFLICT).json({
      error: 'Ya existe un registro con ese valor único',
    });
  }

  if (error.code === PRISMA_ERROR_CODES.NOT_FOUND) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      error: HTTP_MESSAGES.NOT_FOUND,
    });
  }

  console.error('Error no controlado:', error);

  return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
    error: HTTP_MESSAGES.INTERNAL_ERROR,
  });
};
