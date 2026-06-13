import prisma from '../../../shared/db/prisma.js';
import { crearError } from '../../../shared/middleware/errorHandler.js';
import { HTTP_STATUS } from '../../../shared/constants/http.constants.js';
import {
  INTERNAL_PRODUCTS_MESSAGES,
  PRODUCT_ITEM_TYPE,
} from './internal-products.constants.js';

// El admin manda un payload plano y client lo reparte en 4 tablas:
// Item + Product + ProductVariant + Category. Item.id es la PK compartida:
// Product.itemId = Item.id y ProductVariant.productId = Product.itemId.
export const crearProducto = async (body) => {
  const itemId = await prisma.$transaction(async (tx) => {
    const category = await tx.category.upsert({
      where: { name: body.category },
      update: {},
      create: { name: body.category },
    });

    const item = await tx.item.create({
      data: {
        name: body.name,
        itemType: PRODUCT_ITEM_TYPE,
        status: body.status,
      },
    });

    await tx.product.create({
      data: {
        itemId: item.id,
        categoryId: category.id,
        description: body.description ?? '',
        imageUrl: body.imageUrl,
        type: body.type,
      },
    });

    await tx.productVariant.create({
      data: {
        productId: item.id,
        color: body.variant.color,
        size: body.variant.size,
        price: body.variant.price,
        currentStock: body.variant.currentStock,
        minThreshold: body.variant.minThreshold,
        reservedStock: body.variant.reservedStock,
      },
    });

    return item.id;
  });

  return { itemId: itemId.toString() };
};

// El body es el estado completo, por lo que se sobrescribe sin calcular
// diferencias. reservedStock no se toca: lo gestionan las ordenes de client.
export const actualizarProducto = async (rawItemId, body) => {
  const itemId = BigInt(rawItemId);

  await prisma.$transaction(async (tx) => {
    const item = await tx.item.findUnique({ where: { id: itemId } });
    if (!item) {
      throw crearError(
        INTERNAL_PRODUCTS_MESSAGES.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
      );
    }

    const category = await tx.category.upsert({
      where: { name: body.category },
      update: {},
      create: { name: body.category },
    });

    await tx.item.update({
      where: { id: itemId },
      data: { name: body.name, status: body.status },
    });

    await tx.product.update({
      where: { itemId },
      data: {
        categoryId: category.id,
        description: body.description ?? '',
        imageUrl: body.imageUrl,
        type: body.type,
      },
    });

    await tx.productVariant.updateMany({
      where: { productId: itemId },
      data: {
        price: body.variant.price,
        currentStock: body.variant.currentStock,
        minThreshold: body.variant.minThreshold,
      },
    });
  });

  return { itemId: rawItemId };
};

// Borrado logico: hay FKs desde order_items, cart_items y favorites que
// apuntan al producto/variante, asi que un DELETE fisico romperia referencias.
export const eliminarProducto = async (rawItemId) => {
  const itemId = BigInt(rawItemId);

  const item = await prisma.item.findUnique({ where: { id: itemId } });
  if (!item) {
    throw crearError(INTERNAL_PRODUCTS_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  await prisma.item.update({
    where: { id: itemId },
    data: { status: 'inactive' },
  });

  return { itemId: rawItemId };
};
