import { HTTP_STATUS } from '../../../shared/constants/http.constants.js';
import {
  crearProducto as crearProductoService,
  actualizarProducto as actualizarProductoService,
  eliminarProducto as eliminarProductoService,
} from './internal-products.service.js';

export const crearProducto = async (req, res, next) => {
  try {
    const resultado = await crearProductoService(req.body);
    res.status(HTTP_STATUS.CREATED).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const actualizarProducto = async (req, res, next) => {
  try {
    const resultado = await actualizarProductoService(
      req.params.itemId,
      req.body,
    );
    res.status(HTTP_STATUS.OK).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const eliminarProducto = async (req, res, next) => {
  try {
    const resultado = await eliminarProductoService(req.params.itemId);
    res.status(HTTP_STATUS.OK).json(resultado);
  } catch (error) {
    next(error);
  }
};
