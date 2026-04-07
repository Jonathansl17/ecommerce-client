import { registrar as registrarService } from './auth.service.js';
import { AUTH_MESSAGES } from './auth.constants.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

export const registrar = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    await registrarService({ fullName, email, password });
    res.status(HTTP_STATUS.CREATED).json({ message: AUTH_MESSAGES.REGISTER_SUCCESS });
  } catch (error) {
    next(error);
  }
};
