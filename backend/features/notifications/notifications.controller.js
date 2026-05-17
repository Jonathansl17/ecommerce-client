import { obtenerNotificaciones as obtenerNotificacionesService } from './obtener-notificaciones.service.js';
import { marcarComoLeida as marcarComoLeidaService } from './marcar-notificacion-leida.service.js';
import { obtenerComprobantePago as obtenerComprobantePagoService } from './payment/receipt.service.js';
import { PAYMENT_RECEIPT_PDF } from './payment/receipt.constants.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { obtenerAprobacionPendiente } from './product-customization-approval/obtener/pendiente.service.js';
import { marcarComoAprobado } from './product-customization-approval/marcar/aprobado.service.js';
import { marcarAjustesSolicitados } from './product-customization-approval/marcar/ajustes.service.js';
import { triggerProductoAprobado } from './product-customization-approval/triggers/aprobado.service.js';
import { triggerAjustesSolicitados } from './product-customization-approval/triggers/ajustes.service.js';
import {
  PRODUCT_CUSTOMIZATION_APPROVAL_MESSAGES,
  PRODUCT_CUSTOMIZATION_APPROVAL_VALIDATION,
} from './product-customization-approval/constants.js';

export const obtenerNotificaciones = async (req, res, next) => {
  try {
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

export const aprobarProductoPersonalizado = async (req, res, next) => {
  try {
    const clientUserId = BigInt(req.user.id);
    const orderId = BigInt(req.params.orderId);

    const aprobacion = await obtenerAprobacionPendiente({ orderId, clientUserId });

    if (!aprobacion) {
      throw crearError(PRODUCT_CUSTOMIZATION_APPROVAL_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    await marcarComoAprobado({ approvalId: aprobacion.id });
    triggerProductoAprobado({ orderId });

    res.status(HTTP_STATUS.OK).json({ mensaje: PRODUCT_CUSTOMIZATION_APPROVAL_MESSAGES.CLIENT_APPROVED_OK });
  } catch (error) {
    next(error);
  }
};

export const solicitarAjustesProductoPersonalizado = async (req, res, next) => {
  try {
    const clientUserId = BigInt(req.user.id);
    const orderId = BigInt(req.params.orderId);
    const { adjustmentNotes } = req.body;

    if (!adjustmentNotes || typeof adjustmentNotes !== 'string' || adjustmentNotes.trim().length === 0) {
      throw crearError(PRODUCT_CUSTOMIZATION_APPROVAL_MESSAGES.ADJUSTMENT_NOTES_REQUIRED, HTTP_STATUS.BAD_REQUEST);
    }

    if (adjustmentNotes.trim().length > PRODUCT_CUSTOMIZATION_APPROVAL_VALIDATION.MAX_ADJUSTMENT_NOTES_LENGTH) {
      throw crearError(PRODUCT_CUSTOMIZATION_APPROVAL_MESSAGES.ADJUSTMENT_NOTES_TOO_LONG, HTTP_STATUS.BAD_REQUEST);
    }

    const aprobacion = await obtenerAprobacionPendiente({ orderId, clientUserId });

    if (!aprobacion) {
      throw crearError(PRODUCT_CUSTOMIZATION_APPROVAL_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    await marcarAjustesSolicitados({ approvalId: aprobacion.id, adjustmentNotes: adjustmentNotes.trim() });
    triggerAjustesSolicitados({ orderId, adjustmentNotes: adjustmentNotes.trim() });

    res.status(HTTP_STATUS.OK).json({ mensaje: PRODUCT_CUSTOMIZATION_APPROVAL_MESSAGES.ADJUSTMENTS_REQUESTED_OK });
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
