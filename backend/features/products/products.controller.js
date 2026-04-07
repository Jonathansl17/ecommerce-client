import {
  obtenerTodos as obtenerTodosService,
  obtenerPorId as obtenerPorIdService,
  obtenerPorCategoria as obtenerPorCategoriaService,
} from './products.service.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

export const obtenerTodos = async (req, res, next) => {
  try {
    const productos = await obtenerTodosService();
    res.status(HTTP_STATUS.OK).json(productos);
  } catch (error) {
    next(error);
  }
};

export const obtenerPorId = async (req, res, next) => {
  try {
    const producto = await obtenerPorIdService(req.params.id);
    res.status(HTTP_STATUS.OK).json(producto);
  } catch (error) {
    next(error);
  }
};

export const obtenerPorCategoria = async (req, res, next) => {
  try {
    const productos = await obtenerPorCategoriaService(req.params.categoriaId);
    res.status(HTTP_STATUS.OK).json(productos);
  } catch (error) {
    next(error);
  }
};
