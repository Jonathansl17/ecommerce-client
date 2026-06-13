// Valores compartidos con los enums de Prisma (schema.prisma).
export const PRODUCT_TYPES = ['standard', 'custom'];
export const ITEM_STATUSES = ['active', 'inactive'];

// Tipo de item que representa un producto (enum ItemType).
export const PRODUCT_ITEM_TYPE = 'product';

// Limites alineados con las columnas de la base de datos.
export const INTERNAL_PRODUCTS_LIMITS = {
  NAME_MAX: 100, // Item.name VarChar(100)
  DESCRIPTION_MAX: 5000, // Product.description Text (limite defensivo)
  IMAGE_URL_MAX: 300, // Product.imageUrl VarChar(300)
  CATEGORY_MAX: 80, // Category.name VarChar(80)
  COLOR_MAX: 50, // ProductVariant.color VarChar(50)
  SIZE_MAX: 30, // ProductVariant.size VarChar(30)
  PRICE_MAX: 99999999.99, // ProductVariant.price Decimal(10,2)
};

export const INTERNAL_PRODUCTS_MESSAGES = {
  NOT_FOUND: 'Producto no encontrado',
  INVALID_ITEM_ID: 'itemId debe ser numerico',
};
