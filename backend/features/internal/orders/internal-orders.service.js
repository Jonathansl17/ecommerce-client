import prisma from '../../../shared/db/prisma.js';
import { crearError } from '../../../shared/middleware/errorHandler.js';
import { HTTP_STATUS } from '../../../shared/constants/http.constants.js';
import {
  ORDER_WITH_CLIENT_SELECT,
  serializarPedido,
} from '../../orders/orders.service.js';
import { INTERNAL_ORDERS_MESSAGES } from './internal-orders.constants.js';

function serializarPedidoConCliente(orden) {
  if (!orden) return orden;
  const base = serializarPedido(orden);
  return {
    ...base,
    clientUser: orden.clientUser
      ? {
          id: orden.clientUser.id.toString(),
          fullName: orden.clientUser.fullName,
          email: orden.clientUser.email,
        }
      : null,
  };
}

function construirWhere({ status, clientUserId, from, to }) {
  const where = {};

  if (status) {
    where.status = status;
  }

  if (clientUserId) {
    where.clientUserId = BigInt(clientUserId);
  }

  if (from || to) {
    const createdAt = {};
    if (from) {
      const fromDate = new Date(from);
      if (Number.isNaN(fromDate.getTime())) {
        throw crearError(
          INTERNAL_ORDERS_MESSAGES.INVALID_DATE_RANGE,
          HTTP_STATUS.BAD_REQUEST,
        );
      }
      createdAt.gte = fromDate;
    }
    if (to) {
      const toDate = new Date(to);
      if (Number.isNaN(toDate.getTime())) {
        throw crearError(
          INTERNAL_ORDERS_MESSAGES.INVALID_DATE_RANGE,
          HTTP_STATUS.BAD_REQUEST,
        );
      }
      createdAt.lte = toDate;
    }
    where.createdAt = createdAt;
  }

  return where;
}

export const listarPedidos = async ({
  status,
  clientUserId,
  from,
  to,
  limit,
  offset,
}) => {
  const where = construirWhere({ status, clientUserId, from, to });

  const [total, pedidos] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      select: ORDER_WITH_CLIENT_SELECT,
    }),
  ]);

  return {
    total,
    items: pedidos.map(serializarPedidoConCliente),
  };
};

export const obtenerPedidoPorIdInterno = async (orderId) => {
  const orden = await prisma.order.findUnique({
    where: { id: BigInt(orderId) },
    select: ORDER_WITH_CLIENT_SELECT,
  });

  if (!orden) {
    throw crearError(
      INTERNAL_ORDERS_MESSAGES.NOT_FOUND,
      HTTP_STATUS.NOT_FOUND,
    );
  }

  return serializarPedidoConCliente(orden);
};
