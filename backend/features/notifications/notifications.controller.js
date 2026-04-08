import {
  obtenerNotificaciones as obtenerNotificacionesService,
  marcarComoLeida as marcarComoLeidaService,
} from './notifications.service.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

export const obtenerNotificaciones = async (req, res, next) => {
  try {
    // req.user viene del middleware requireAuth
    const clientUserId = BigInt(req.user.id);
    const soloNoLeidas = req.query.unread === 'true';

    const notificaciones = await obtenerNotificacionesService({ clientUserId, soloNoLeidas });

    res.status(HTTP_STATUS.OK).json({ notificaciones });
  } catch (error) {
    next(error);
  }
};

export const marcarComoLeida = async (req, res, next) => {
  try {
    const clientUserId = BigInt(req.user.id);
    const notificationId = BigInt(req.params.id);

    const notificacion = await marcarComoLeidaService({ notificationId, clientUserId });

    res.status(HTTP_STATUS.OK).json({ notificacion });
  } catch (error) {
    next(error);
  }
};
