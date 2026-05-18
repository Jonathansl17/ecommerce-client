import { HTTP_STATUS } from '../../../shared/constants/http.constants.js';
import {
  actualizarEstadoReview as actualizarEstadoReviewService,
  listarReviews as listarReviewsService,
  obtenerEstadisticasReviews as obtenerEstadisticasReviewsService,
  obtenerReviewPorIdInterno as obtenerReviewPorIdInternoService,
} from './internal-reviews.service.js';

export const listarReviews = async (req, res, next) => {
  try {
    const resultado = await listarReviewsService(req.validatedQuery);
    res.status(HTTP_STATUS.OK).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const obtenerReviewPorId = async (req, res, next) => {
  try {
    const review = await obtenerReviewPorIdInternoService(req.params.id);
    res.status(HTTP_STATUS.OK).json(review);
  } catch (error) {
    next(error);
  }
};

export const actualizarEstadoReview = async (req, res, next) => {
  try {
    const resultado = await actualizarEstadoReviewService(
      req.params.id,
      req.body,
    );
    res.status(HTTP_STATUS.OK).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const obtenerEstadisticasReviews = async (req, res, next) => {
  try {
    const stats = await obtenerEstadisticasReviewsService();
    res.status(HTTP_STATUS.OK).json(stats);
  } catch (error) {
    next(error);
  }
};
