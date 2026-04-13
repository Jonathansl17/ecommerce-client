import {
  obtenerCarrito as obtenerCarritoService,
  agregarItem as agregarItemService,
  actualizarCantidad as actualizarCantidadService,
  eliminarItem as eliminarItemService,
} from './cart.service.js';
import { CART_MESSAGES } from './cart.constants.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

export const obtenerCarrito = async (req, res, next) => {
  try {
    const carrito = await obtenerCarritoService(req.user.id);
    res.status(HTTP_STATUS.OK).json(carrito);
  } catch (error) {
    next(error);
  }
};

export const agregarItem = async (req, res, next) => {
  try {
    const item = await agregarItemService(req.user.id, req.body);
    res.status(HTTP_STATUS.CREATED).json({
      message: CART_MESSAGES.ITEM_ADDED,
      item,
    });
  } catch (error) {
    next(error);
  }
};

export const actualizarCantidad = async (req, res, next) => {
  try {
    const item = await actualizarCantidadService(
      req.user.id,
      req.params.itemId,
      req.body.quantity
    );
    res.status(HTTP_STATUS.OK).json({
      message: CART_MESSAGES.ITEM_UPDATED,
      item,
    });
  } catch (error) {
    next(error);
  }
};

export const eliminarItem = async (req, res, next) => {
  try {
    await eliminarItemService(req.user.id, req.params.itemId);
    res.status(HTTP_STATUS.OK).json({ message: CART_MESSAGES.ITEM_REMOVED });
  } catch (error) {
    next(error);
  }
};
