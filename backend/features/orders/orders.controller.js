import {
  actualizarEstadoPedido as actualizarEstadoPedidoService,
  aprobarPago as aprobarPagoService,
  checkout as checkoutService,
  obtenerMisPedidos as obtenerMisPedidosService,
  obtenerPedidoPorId as obtenerPedidoPorIdService,
} from './orders.service.js';
import { ORDERS_MESSAGES } from './orders.constants.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

export const checkout = async (req, res, next) => {
  try {
    const orden = await checkoutService(req.user.id, req.body);
    res.status(HTTP_STATUS.CREATED).json({
      message: ORDERS_MESSAGES.CHECKOUT_SUCCESS,
      order: orden,
    });
  } catch (error) {
    next(error);
  }
};

export const obtenerMisPedidos = async (req, res, next) => {
  try {
    const pedidos = await obtenerMisPedidosService(req.user.id);
    res.status(HTTP_STATUS.OK).json(pedidos);
  } catch (error) {
    next(error);
  }
};

export const obtenerPedidoPorId = async (req, res, next) => {
  try {
    const pedido = await obtenerPedidoPorIdService(req.user.id, req.params.id);
    res.status(HTTP_STATUS.OK).json(pedido);
  } catch (error) {
    next(error);
  }
};

export const aprobarPago = async (req, res, next) => {
  try {
    const resultado = await aprobarPagoService(req.params.orderId, req.params.paymentId);
    res.status(HTTP_STATUS.OK).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const actualizarEstadoPedido = async (req, res, next) => {
  try {
    const resultado = await actualizarEstadoPedidoService(req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json(resultado);
  } catch (error) {
    next(error);
  }
};
