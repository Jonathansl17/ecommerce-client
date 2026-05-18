import { HTTP_STATUS } from '../../../shared/constants/http.constants.js';
import { listarUsuarios as listarUsuariosService } from './internal-users.service.js';

export const listarUsuarios = async (req, res, next) => {
  try {
    const resultado = await listarUsuariosService(req.validatedQuery);
    res.status(HTTP_STATUS.OK).json(resultado);
  } catch (error) {
    next(error);
  }
};
