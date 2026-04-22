import {
  obtenerTodos as obtenerTodosService,
  obtenerPorId as obtenerPorIdService,
  actualizar as actualizarService,
  eliminar as eliminarService,
  obtenerPerfil as obtenerPerfilService,
} from './clients.service.js';
import { CLIENTS_MESSAGES } from './clients.constants.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

export const obtenerTodos = async (req, res, next) => {
  try {
    const clientes = await obtenerTodosService();
    res.status(HTTP_STATUS.OK).json(clientes);
  } catch (error) {
    next(error);
  }
};

export const obtenerPorId = async (req, res, next) => {
  try {
    const cliente = await obtenerPorIdService(req.params.id);
    res.status(HTTP_STATUS.OK).json(cliente);
  } catch (error) {
    next(error);
  }
};

export const actualizar = async (req, res, next) => {
  try {
    const cliente = await actualizarService(req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json(cliente);
  } catch (error) {
    next(error);
  }
};

export const eliminar = async (req, res, next) => {
  try {
    const cliente = await eliminarService(req.params.id);
    res.status(HTTP_STATUS.OK).json({
      message: CLIENTS_MESSAGES.DELETED_SUCCESS,
      cliente,
    });
  } catch (error) {
    next(error);
  }
};

export const obtenerPerfil = async (req, res, next) => {
  try {
    const cliente = await obtenerPerfilService(req.user.id);
    res.status(HTTP_STATUS.OK).json(cliente);
  } catch (error) {
    next(error);
  }
};
