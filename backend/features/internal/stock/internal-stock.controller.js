import { HTTP_STATUS } from '../../../shared/constants/http.constants.js';
import { decrementarStock as decrementarStockService } from './internal-stock.service.js';

export const decrementarStock = async (req, res, next) => {
  try {
    const resultado = await decrementarStockService(req.body);
    res.status(HTTP_STATUS.OK).json(resultado);
  } catch (error) {
    next(error);
  }
};
