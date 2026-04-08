import { registrar as registrarService, iniciarSesion as iniciarSesionService } from './auth.service.js';
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

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const resultado = await iniciarSesionService({ email, password });
    res.status(HTTP_STATUS.OK).json({
      message: AUTH_MESSAGES.LOGIN_SUCCESS,
      ...resultado,
    });
  } catch (error) {
    next(error);
  }
};
