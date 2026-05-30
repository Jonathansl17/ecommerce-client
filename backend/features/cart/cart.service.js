import prisma from '../../shared/db/prisma.js';
import { crearError } from '../../shared/middleware/errorHandler.js';
import { CART_MESSAGES } from './cart.constants.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';
import { TAX_RATE } from '../../shared/constants/tax.constants.js';

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
      // currentStock, reservedStock, minThreshold omitidos — son datos internos de inventario
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

// Obtiene el carrito activo del usuario, o crea uno nuevo si no existe.
// Usa transacción Serializable para evitar race condition de doble creación.
async function obtenerOCrearCarritoActivo(userId) {
  const userBigInt = BigInt(userId);
  const include = { cartItems: { select: CART_ITEM_SELECT } };

  return prisma.$transaction(async (tx) => {
    const existente = await tx.cart.findFirst({
      where: { clientUserId: userBigInt, status: 'active' },
      include,
    });

    if (existente) return existente;

    return tx.cart.create({
      data: { clientUserId: userBigInt, status: 'active' },
      include,
    });
  }, { isolationLevel: 'Serializable' });
}

function calcularTotales(items) {
  const subtotalCents = items.reduce(
    (acc, item) => acc + Math.round(Number(item.unitPriceSnap) * 100) * item.quantity,
    0,
  );
  const subtotal = subtotalCents / 100;
  const taxes = Math.round(subtotalCents * TAX_RATE) / 100;
  return {
    subtotal: subtotal.toFixed(2),
    taxes: taxes.toFixed(2),
    total: (subtotal + taxes).toFixed(2),
  };
}

function parseBigIntParam(value, campo) {
  try { return BigInt(value); }
  catch { throw crearError(`Parámetro inválido: ${campo}`, HTTP_STATUS.BAD_REQUEST); }
}

export const obtenerCarrito = async (userId) => {
  const carrito = await obtenerOCrearCarritoActivo(userId);
  const totales = calcularTotales(carrito.cartItems);

  return {
    id: carrito.id,
    status: carrito.status,
    items: carrito.cartItems,
    ...totales,
  };
};

export const agregarItem = async (userId, { variantId, quantity }) => {
  // Verificar que la variante existe y tiene stock suficiente
  const variante = await prisma.productVariant.findUnique({
    where: { id: parseBigIntParam(variantId, 'variantId') },
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
      // Actualizar precio snapshot al precio vigente al modificar cantidad
      data: { quantity: nuevaCantidad, unitPriceSnap: variante.price },
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
  const parsedItemId = parseBigIntParam(itemId, 'itemId');

  const item = await prisma.cartItem.findFirst({
    where: {
      id: parsedItemId,
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
    where: { id: parsedItemId },
    // Actualizar precio snapshot al precio vigente
    data: { quantity, unitPriceSnap: item.variant.price },
    select: CART_ITEM_SELECT,
  });
};

export const eliminarItem = async (userId, itemId) => {
  const parsedItemId = parseBigIntParam(itemId, 'itemId');

  const item = await prisma.cartItem.findFirst({
    where: {
      id: parsedItemId,
      cart: { clientUserId: BigInt(userId), status: 'active' },
    },
  });

  if (!item) {
    throw crearError(CART_MESSAGES.ITEM_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return prisma.cartItem.delete({ where: { id: parsedItemId } });
};
