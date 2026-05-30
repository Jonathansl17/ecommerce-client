import prisma from '../db/prisma.js';
import { crearError } from './errorHandler.js';
import { HTTP_STATUS } from '../constants/http.constants.js';

const NOT_ADMIN_MESSAGE = 'Solo los administradores pueden realizar esta accion';

// Debe usarse SIEMPRE después de requireAuth: asume req.user.id ya poblado.
// Habilita la acción solo si el ClientUser autenticado tiene fila admin con admin=true.
export const requireAdmin = async (req, res, next) => {
  try {
    const registro = await prisma.admin.findUnique({
      where: { clientUserId: BigInt(req.user.id) },
      select: { admin: true },
    });

    if (!registro?.admin) {
      return next(crearError(NOT_ADMIN_MESSAGE, HTTP_STATUS.FORBIDDEN));
    }

    next();
  } catch (error) {
    next(error);
  }
};
