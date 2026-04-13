import prisma from '../../shared/db/prisma.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { ORDERS_MESSAGES, TAX_RATE } from './orders.constants.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

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
};

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

  return orden;
};

export const obtenerMisPedidos = async (userId) => {
  return prisma.order.findMany({
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
    },
  });
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

  return orden;
};
