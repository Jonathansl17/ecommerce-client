import {
  obtenerNotificaciones as obtenerNotificacionesService,
  marcarComoLeida as marcarComoLeidaService,
} from './notifications.service.js';
import { obtenerComprobantePago as obtenerComprobantePagoService } from './payment-receipt.service.js';
import { PAYMENT_RECEIPT_PDF } from './notifications.constants.js';
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

export const descargarComprobantePago = async (req, res, next) => {
  try {
    const clientUserId = BigInt(req.user.id);
    const paymentId = BigInt(req.params.paymentId);

    const { pdfBuffer, filename } = await obtenerComprobantePagoService({
      paymentId,
      clientUserId,
    });

    res.setHeader('Content-Type', PAYMENT_RECEIPT_PDF.MIME_TYPE);
    res.setHeader('Content-Disposition', PAYMENT_RECEIPT_PDF.CONTENT_DISPOSITION(filename));
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
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
