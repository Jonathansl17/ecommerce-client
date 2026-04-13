import prisma from '../../shared/db/prisma.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { CART_MESSAGES } from './cart.constants.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

const CART_ITEM_SELECT = {
  id: true,
  variantId: true,
  quantity: true,
  unitPriceSnap: true,
  createdAt: true,
  variant: {
    select: {
      id: true,
      color: true,
      size: true,
      price: true,
      currentStock: true,
      reservedStock: true,
      minThreshold: true,
      product: {
        select: {
          itemId: true,
          imageUrl: true,
          item: { select: { name: true } },
        },
      },
    },
  },
};

// Obtiene el carrito activo del usuario, o crea uno nuevo si no existe
async function obtenerOCrearCarritoActivo(userId) {
  const carrito = await prisma.cart.findFirst({
    where: { clientUserId: BigInt(userId), status: 'active' },
    include: { cartItems: { select: CART_ITEM_SELECT } },
  });

  if (carrito) return carrito;

  return prisma.cart.create({
    data: { clientUserId: BigInt(userId), status: 'active' },
    include: { cartItems: { select: CART_ITEM_SELECT } },
  });
}

export const obtenerCarrito = async (userId) => {
  const carrito = await obtenerOCrearCarritoActivo(userId);

  const subtotal = carrito.cartItems.reduce(
    (acc, item) => acc + Number(item.unitPriceSnap) * item.quantity,
    0
  );
  const taxes = subtotal * 0.13;

  return {
    id: carrito.id,
    status: carrito.status,
    items: carrito.cartItems,
    subtotal: subtotal.toFixed(2),
    taxes: taxes.toFixed(2),
    total: (subtotal + taxes).toFixed(2),
  };
};

export const agregarItem = async (userId, { variantId, quantity }) => {
  // Verificar que la variante existe y tiene stock suficiente
  const variante = await prisma.productVariant.findUnique({
    where: { id: BigInt(variantId) },
    include: { product: { include: { item: true } } },
  });

  if (!variante) {
    throw crearError(CART_MESSAGES.VARIANT_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  if (variante.product.item.status !== 'active') {
    throw crearError(CART_MESSAGES.PRODUCT_INACTIVE, HTTP_STATUS.BAD_REQUEST);
  }

  const stockDisponible = variante.currentStock - variante.reservedStock;
  if (stockDisponible < quantity) {
    throw crearError(CART_MESSAGES.OUT_OF_STOCK, HTTP_STATUS.BAD_REQUEST);
  }

  const carrito = await obtenerOCrearCarritoActivo(userId);

  // Si el ítem ya existe en el carrito, actualizar la cantidad
  const itemExistente = carrito.cartItems.find(
    (i) => i.variantId === BigInt(variantId)
  );

  if (itemExistente) {
    const nuevaCantidad = itemExistente.quantity + quantity;
    const stockTotal = variante.currentStock - variante.reservedStock;

    if (stockTotal < nuevaCantidad) {
      throw crearError(CART_MESSAGES.OUT_OF_STOCK, HTTP_STATUS.BAD_REQUEST);
    }

    return prisma.cartItem.update({
      where: { id: itemExistente.id },
      data: { quantity: nuevaCantidad },
      select: CART_ITEM_SELECT,
    });
  }

  // Crear nuevo ítem con snapshot del precio actual
  return prisma.cartItem.create({
    data: {
      cartId: carrito.id,
      variantId: BigInt(variantId),
      quantity,
      unitPriceSnap: variante.price,
    },
    select: CART_ITEM_SELECT,
  });
};

export const actualizarCantidad = async (userId, itemId, quantity) => {
  const item = await prisma.cartItem.findFirst({
    where: {
      id: BigInt(itemId),
      cart: { clientUserId: BigInt(userId), status: 'active' },
    },
    include: { variant: true },
  });

  if (!item) {
    throw crearError(CART_MESSAGES.ITEM_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  const stockDisponible = item.variant.currentStock - item.variant.reservedStock;
  if (stockDisponible < quantity) {
    throw crearError(CART_MESSAGES.OUT_OF_STOCK, HTTP_STATUS.BAD_REQUEST);
  }

  return prisma.cartItem.update({
    where: { id: BigInt(itemId) },
    data: { quantity },
    select: CART_ITEM_SELECT,
  });
};

export const eliminarItem = async (userId, itemId) => {
  const item = await prisma.cartItem.findFirst({
    where: {
      id: BigInt(itemId),
      cart: { clientUserId: BigInt(userId), status: 'active' },
    },
  });

  if (!item) {
    throw crearError(CART_MESSAGES.ITEM_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return prisma.cartItem.delete({ where: { id: BigInt(itemId) } });
};
