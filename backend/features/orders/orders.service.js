import prisma from '../../shared/db/prisma.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import {
  despacharOrderStatusNotification,
  registrarOrderStatusNotification,
  serializarOrderStatusNotification,
} from '../notifications/order-status-notification.service.js';
import { triggerNotificacionPagoAprobado } from '../notifications/payment-notification.service.js';
import { NOTIFICATION_MESSAGES } from '../notifications/notifications.constants.js';
import { ORDERS_MESSAGES, PAYMENT_MESSAGES, TAX_RATE } from './orders.constants.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

const ORDER_STATUS_NOTIFICATION_SELECT = {
  id: true,
  previousStatus: true,
  newStatus: true,
  changedAt: true,
  deliveryStatus: true,
  deliveryAttempts: true,
  deliveryLastError: true,
  deliveredAt: true,
  createdAt: true,
};

const ORDER_SELECT = {
  id: true,
  status: true,
  subtotal: true,
  taxes: true,
  totalAmount: true,
  shippingAddress: true,
  createdAt: true,
  updatedAt: true,
  orderItems: {
    select: {
      id: true,
      quantity: true,
      unitPriceSnap: true,
      variant: {
        select: {
          id: true,
          color: true,
          size: true,
          product: {
            select: {
              itemId: true,
              imageUrl: true,
              item: { select: { name: true } },
            },
          },
        },
      },
    },
  },
  payments: {
    select: {
      id: true,
      method: true,
      externalReference: true,
      amount: true,
      status: true,
      createdAt: true,
    },
  },
  orderStatusNotifications: {
    orderBy: { changedAt: 'desc' },
    select: ORDER_STATUS_NOTIFICATION_SELECT,
  },
};

const ORDER_WITH_CLIENT_SELECT = {
  ...ORDER_SELECT,
  clientUser: {
    select: {
      id: true,
      fullName: true,
      email: true,
    },
  },
};

function serializarOrderStatusNotifications(historial = []) {
  return historial.map((registro) => ({
    id: registro.id.toString(),
    previousStatus: registro.previousStatus,
    newStatus: registro.newStatus,
    changedAt: registro.changedAt,
    deliveryStatus: registro.deliveryStatus,
    deliveryAttempts: registro.deliveryAttempts,
    deliveryLastError: registro.deliveryLastError,
    deliveredAt: registro.deliveredAt,
    createdAt: registro.createdAt,
  }));
}

function serializarPedido(orden) {
  if (!orden) return orden;

  return {
    id: orden.id.toString(),
    status: orden.status,
    subtotal:
      orden.subtotal != null ? Number(orden.subtotal) : undefined,
    taxes: orden.taxes != null ? Number(orden.taxes) : undefined,
    totalAmount: orden.totalAmount != null ? Number(orden.totalAmount) : undefined,
    shippingAddress: orden.shippingAddress,
    createdAt: orden.createdAt,
    updatedAt: orden.updatedAt,
    payments: orden.payments?.map((payment) => ({
      id: payment.id?.toString?.() ?? payment.id,
      method: payment.method,
      externalReference: payment.externalReference,
      amount: payment.amount != null ? Number(payment.amount) : undefined,
      status: payment.status,
      createdAt: payment.createdAt,
    })),
    orderItems: orden.orderItems?.map((item) => ({
      id: item.id?.toString?.() ?? item.id,
      quantity: item.quantity,
      unitPriceSnap:
        item.unitPriceSnap != null ? Number(item.unitPriceSnap) : undefined,
      variant: item.variant
        ? {
            id: item.variant.id.toString(),
            color: item.variant.color,
            size: item.variant.size,
            product: item.variant.product
              ? {
                  itemId: item.variant.product.itemId.toString(),
                  imageUrl: item.variant.product.imageUrl,
                  item: item.variant.product.item,
                }
              : undefined,
          }
        : undefined,
    })),
    orderStatusNotifications: serializarOrderStatusNotifications(
      orden.orderStatusNotifications,
    ),
  };
}

export const checkout = async (userId, { shippingAddress, paymentMethod, externalReference }) => {
  // 1. Obtener carrito activo con ítems
  const carrito = await prisma.cart.findFirst({
    where: { clientUserId: BigInt(userId), status: 'active' },
    include: {
      cartItems: {
        include: {
          variant: { include: { product: { include: { item: true } } } },
        },
      },
    },
  });

  if (!carrito) {
    throw crearError(ORDERS_MESSAGES.CART_NOT_FOUND, HTTP_STATUS.BAD_REQUEST);
  }

  if (carrito.cartItems.length === 0) {
    throw crearError(ORDERS_MESSAGES.CART_EMPTY, HTTP_STATUS.BAD_REQUEST);
  }

  // 2. Verificar stock disponible para cada ítem
  for (const item of carrito.cartItems) {
    const disponible = item.variant.currentStock - item.variant.reservedStock;
    if (disponible < item.quantity) {
      throw crearError(
        `${ORDERS_MESSAGES.OUT_OF_STOCK}: ${item.variant.product.item.name} (${item.variant.color} / ${item.variant.size})`,
        HTTP_STATUS.BAD_REQUEST
      );
    }
  }

  // 3. Calcular totales usando el unit_price_snap almacenado en el carrito
  const subtotal = carrito.cartItems.reduce(
    (acc, item) => acc + Number(item.unitPriceSnap) * item.quantity,
    0
  );
  const taxes = subtotal * TAX_RATE;
  const totalAmount = subtotal + taxes;

  // 4. Crear Order, OrderItems, Payment y actualizar stock en una sola transacción
  const orden = await prisma.$transaction(async (tx) => {
    // Crear la orden
    const nuevaOrden = await tx.order.create({
      data: {
        clientUserId: BigInt(userId),
        cartId: carrito.id,
        status: 'pending_payment',
        subtotal,
        taxes,
        totalAmount,
        shippingAddress,
      },
    });

    // Crear los ítems de la orden (snapshot de precio y cantidad)
    await tx.orderItem.createMany({
      data: carrito.cartItems.map((item) => ({
        orderId: nuevaOrden.id,
        variantId: item.variantId,
        quantity: item.quantity,
        unitPriceSnap: item.unitPriceSnap,
      })),
    });

    // Crear el registro de pago (estado inicial: pending)
    await tx.payment.create({
      data: {
        orderId: nuevaOrden.id,
        method: paymentMethod,
        externalReference: externalReference || '',
        amount: totalAmount,
        status: 'pending',
      },
    });

    // Incrementar reserved_stock para cada variante
    for (const item of carrito.cartItems) {
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { reservedStock: { increment: item.quantity } },
      });
    }

    // Marcar el carrito como convertido
    await tx.cart.update({
      where: { id: carrito.id },
      data: { status: 'converted' },
    });

    // Retornar la orden completa
    return tx.order.findUnique({
      where: { id: nuevaOrden.id },
      select: ORDER_SELECT,
    });
  });

  return serializarPedido(orden);
};

export const obtenerMisPedidos = async (userId) => {
  const pedidos = await prisma.order.findMany({
    where: { clientUserId: BigInt(userId) },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      status: true,
      totalAmount: true,
      createdAt: true,
      updatedAt: true,
      payments: {
        select: { method: true, status: true, amount: true },
        take: 1,
        orderBy: { createdAt: 'desc' },
      },
      orderItems: {
        select: { quantity: true },
      },
      orderStatusNotifications: {
        orderBy: { changedAt: 'desc' },
        select: ORDER_STATUS_NOTIFICATION_SELECT,
      },
    },
  });

  return pedidos.map(serializarPedido);
};

export const obtenerPedidoPorId = async (userId, orderId) => {
  const orden = await prisma.order.findFirst({
    where: {
      id: BigInt(orderId),
      clientUserId: BigInt(userId),
    },
    select: ORDER_SELECT,
  });

  if (!orden) {
    throw crearError(ORDERS_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return serializarPedido(orden);
};

export const aprobarPago = async (orderId, paymentId) => {
  const parsedOrderId = BigInt(orderId);
  const parsedPaymentId = BigInt(paymentId);

  const payment = await prisma.payment.findFirst({
    where: { id: parsedPaymentId, orderId: parsedOrderId },
    select: {
      id: true,
      method: true,
      externalReference: true,
      amount: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!payment) {
    throw crearError(PAYMENT_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  if (payment.status === 'approved') {
    return { message: PAYMENT_MESSAGES.ALREADY_APPROVED };
  }

  const approvedAt = new Date();

  const [pagoActualizado, orden] = await prisma.$transaction(async (tx) => {
    const pago = await tx.payment.update({
      where: { id: parsedPaymentId },
      data: { status: 'approved', updatedAt: approvedAt },
      select: {
        id: true,
        method: true,
        externalReference: true,
        amount: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const pedido = await tx.order.findUnique({
      where: { id: parsedOrderId },
      select: {
        id: true,
        clientUser: {
          select: { id: true, fullName: true, email: true },
        },
      },
    });

    return [pago, pedido];
  });

  triggerNotificacionPagoAprobado({
    order: { id: orden.id },
    clientUser: orden.clientUser,
    payment: pagoActualizado,
  });

  return {
    message: PAYMENT_MESSAGES.APPROVE_SUCCESS,
    payment: {
      id: pagoActualizado.id.toString(),
      method: pagoActualizado.method,
      externalReference: pagoActualizado.externalReference,
      amount: Number(pagoActualizado.amount),
      status: pagoActualizado.status,
      createdAt: pagoActualizado.createdAt,
      updatedAt: pagoActualizado.updatedAt,
    },
  };
};

export const actualizarEstadoPedido = async (orderId, { status: newStatus }) => {
  const parsedOrderId = BigInt(orderId);
  const changedAt = new Date();

  const currentOrder = await prisma.order.findUnique({
    where: { id: parsedOrderId },
    select: {
      id: true,
      status: true,
      clientUserId: true,
      cartId: true,
      subtotal: true,
      taxes: true,
      totalAmount: true,
      shippingAddress: true,
      createdAt: true,
      updatedAt: true,
      clientUser: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
      orderItems: ORDER_SELECT.orderItems,
      payments: ORDER_SELECT.payments,
    },
  });

  if (!currentOrder) {
    throw crearError(ORDERS_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  if (currentOrder.status === newStatus) {
        return {
          order: serializarPedido(await prisma.order.findUnique({
            where: { id: parsedOrderId },
            select: ORDER_SELECT,
          })),
          orderStatusNotification: null,
          message: ORDERS_MESSAGES.STATUS_UNCHANGED,
        };
  }

  const previousStatus = currentOrder.status;

  const { order, orderStatusNotification } = await prisma.$transaction(async (tx) => {
    const updatedOrderCount = await tx.order.updateMany({
      where: {
        id: parsedOrderId,
        status: previousStatus,
      },
      data: {
        status: newStatus,
      },
    });

    if (updatedOrderCount.count === 0) {
      const latestOrder = await tx.order.findUnique({
        where: { id: parsedOrderId },
        select: { status: true },
      });

      if (latestOrder?.status === newStatus) {
        return {
          order: serializarPedido(await tx.order.findUnique({
            where: { id: parsedOrderId },
            select: ORDER_SELECT,
          })),
          orderStatusNotification: null,
        };
      }

      throw crearError('Conflicto al actualizar el estado del pedido', HTTP_STATUS.CONFLICT);
    }

    const updatedOrder = await tx.order.findUnique({
      where: { id: parsedOrderId },
      select: ORDER_WITH_CLIENT_SELECT,
    });

    const createdOrderStatusNotification = await registrarOrderStatusNotification({
      tx,
      order: updatedOrder,
      previousStatus,
      newStatus,
      changedAt,
    });

    return {
      order: updatedOrder,
      orderStatusNotification: createdOrderStatusNotification,
    };
  });

  if (orderStatusNotification) {
    despacharOrderStatusNotification({
      orderStatusNotificationId: orderStatusNotification.id,
      order,
      previousStatus,
      newStatus,
      changedAt,
    }).catch((error) => {
      console.error('[ORDER_STATUS_NOTIFICATION] Unexpected async delivery error.', {
        orderId: order.id.toString(),
        errorMessage: error?.message ?? NOTIFICATION_MESSAGES.EMAIL_UNKNOWN_ERROR,
      });
    });
  }

  const responseOrder =
    order?.clientUser != null
      ? (() => {
          const { clientUser, ...orderWithoutClientUser } = order;
          return orderWithoutClientUser;
        })()
      : order;

  return {
    order: serializarPedido(responseOrder),
    orderStatusNotification:
      orderStatusNotification != null
        ? serializarOrderStatusNotification(orderStatusNotification)
        : null,
    message:
      orderStatusNotification == null
        ? ORDERS_MESSAGES.STATUS_UNCHANGED
        : ORDERS_MESSAGES.STATUS_UPDATED_SUCCESS,
    integrationComment: NOTIFICATION_MESSAGES.ORDER_STATUS_NOTIFICATION_TRIGGER_COMMENT,
  };
};
