import {
  obtenerMisProductosConReviews as obtenerMisProductosConReviewsService,
  obtenerPorProducto as obtenerPorProductoService,
  crear as crearService,
  actualizar as actualizarService,
  eliminar as eliminarService,
  votarReview as votarReviewService,
  retirarVoto as retirarVotoService,
  obtenerMisVotos as obtenerMisVotosService,
  responderReview as responderReviewService,
  actualizarRespuesta as actualizarRespuestaService,
  eliminarRespuesta as eliminarRespuestaService,
} from './reviews.service.js';
import { REVIEWS_MESSAGES } from './reviews.constants.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';
import { parsePagination } from '../../shared/utils/pagination.js';

export const obtenerMisProductos = async (req, res, next) => {
  try {
    const pagination = parsePagination(req.query, { LIMIT: 5 });
    const result = await obtenerMisProductosConReviewsService(req.user.id, pagination);
    res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const obtenerPorProducto = async (req, res, next) => {
  try {
    const pagination = parsePagination(req.query, { LIMIT: 5 });
    const result = await obtenerPorProductoService(req.params.productId, {
      ...pagination,
      rating: req.query.rating,
      date: req.query.date,
      helpful: req.query.helpful,
    });
    res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const crear = async (req, res, next) => {
  try {
    const review = await crearService(req.user.id, req.body);
    res.status(HTTP_STATUS.CREATED).json({
      message: REVIEWS_MESSAGES.CREATED_SUCCESS,
      review,
    });
  } catch (error) {
    next(error);
  }
};

export const actualizar = async (req, res, next) => {
  try {
    const review = await actualizarService(
      req.user.id,
      req.params.reviewId,
      req.body,
    );
    res.status(HTTP_STATUS.OK).json({
      message: REVIEWS_MESSAGES.UPDATED_SUCCESS,
      review,
    });
  } catch (error) {
    next(error);
  }
};

export const eliminar = async (req, res, next) => {
  try {
    await eliminarService(req.user.id, req.params.reviewId);
    res.status(HTTP_STATUS.OK).json({ message: REVIEWS_MESSAGES.DELETED_SUCCESS });
  } catch (error) {
    next(error);
  }
};

export const votar = async (req, res, next) => {
  try {
    const result = await votarReviewService(
      req.user.id,
      req.params.reviewId,
      req.body,
    );
    res.status(HTTP_STATUS.OK).json({
      message: REVIEWS_MESSAGES.VOTE_REGISTERED,
      voteType: result.voteType,
    });
  } catch (error) {
    next(error);
  }
};

export const retirarVoto = async (req, res, next) => {
  try {
    await retirarVotoService(req.user.id, req.params.reviewId);
    res.status(HTTP_STATUS.OK).json({ message: REVIEWS_MESSAGES.VOTE_REMOVED });
  } catch (error) {
    next(error);
  }
};

export const responder = async (req, res, next) => {
  try {
    const response = await responderReviewService(
      req.user.id,
      req.params.reviewId,
      req.body,
    );
    res.status(HTTP_STATUS.CREATED).json({
      message: REVIEWS_MESSAGES.RESPONSE_CREATED,
      response,
    });
  } catch (error) {
    next(error);
  }
};

export const actualizarRespuesta = async (req, res, next) => {
  try {
    const response = await actualizarRespuestaService(
      req.user.id,
      req.params.reviewId,
      req.body,
    );
    res.status(HTTP_STATUS.OK).json({
      message: REVIEWS_MESSAGES.RESPONSE_UPDATED,
      response,
    });
  } catch (error) {
    next(error);
  }
};

export const eliminarRespuesta = async (req, res, next) => {
  try {
    await eliminarRespuestaService(req.user.id, req.params.reviewId);
    res.status(HTTP_STATUS.OK).json({ message: REVIEWS_MESSAGES.RESPONSE_DELETED });
  } catch (error) {
    next(error);
  }
};

export const obtenerMisVotos = async (req, res, next) => {
  try {
    const reviewIds = (req.query.reviewIds ?? '')
      .toString()
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const votos = await obtenerMisVotosService(req.user.id, reviewIds);
    res.status(HTTP_STATUS.OK).json(votos);
  } catch (error) {
    next(error);
  }
};
