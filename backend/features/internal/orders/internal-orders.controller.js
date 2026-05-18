import { HTTP_STATUS } from '../../../shared/constants/http.constants.js';
import {
  actualizarEstadoPedido as actualizarEstadoPedidoService,
  cancelarPedidoAdmin as cancelarPedidoAdminService,
} from '../../orders/orders.service.js';
import {
  listarPedidos as listarPedidosService,
  obtenerPedidoPorIdInterno as obtenerPedidoPorIdInternoService,
} from './internal-orders.service.js';

export const listarPedidos = async (req, res, next) => {
  try {
    const resultado = await listarPedidosService(req.validatedQuery);
    res.status(HTTP_STATUS.OK).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const obtenerPedidoPorId = async (req, res, next) => {
  try {
    const pedido = await obtenerPedidoPorIdInternoService(req.params.id);
    res.status(HTTP_STATUS.OK).json(pedido);
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

export const cancelarPedido = async (req, res, next) => {
  try {
    const resultado = await cancelarPedidoAdminService(req.params.id);
    res.status(HTTP_STATUS.OK).json(resultado);
  } catch (error) {
    next(error);
  }
};
