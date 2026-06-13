import { crearError } from '../middleware/errorHandler.js';
import { HTTP_STATUS } from '../constants/http.constants.js';

export const parseBigInt = (value, campo) => {
  try {
    const parsed = BigInt(value);
    if (parsed <= 0n) throw new RangeError('non-positive');
    return parsed;
  } catch {
    throw crearError(`${campo} debe ser un entero positivo válido`, HTTP_STATUS.BAD_REQUEST);
  }
};
