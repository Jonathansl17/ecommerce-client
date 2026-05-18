// API paths
export const PRODUCT_DETAIL_API_PATHS = {
  product: (id: string) => `/products/${id}`,
} as const;

// Request error codes
export const PRODUCT_DETAIL_REQUEST_ERROR_CODES = {
  NOT_FOUND: 'NOT_FOUND',
  FETCH_FAILED: 'FETCH_FAILED',
  INVALID_RESPONSE: 'INVALID_RESPONSE',
} as const;

// Quantity stepper
export const PRODUCT_DETAIL_QUANTITY = {
  MIN: 1,
  MAX: 99,
  STEP: 1,
} as const;

// Currency format
export const PRODUCT_DETAIL_CURRENCY = {
  LOCALE: 'es-CR',
  SYMBOL: '₡',
} as const;

// UI strings (Spanish)
export const PRODUCT_DETAIL_STRINGS = {
  // Page
  loading: 'Cargando producto...',
  notFound: 'Producto no encontrado',
  errorFallback: 'No se pudo cargar el producto',

  // Image
  imageAlt: (name: string) => `Imagen de ${name}`,
  noImage: 'Sin imagen',

  // Header
  priceFrom: 'Desde',
  ratingLabel: (average: number, total: number) =>
    `${average.toFixed(1)} de 5 — ${total} reseña${total !== 1 ? 's' : ''}`,
  noRatings: 'Sin calificaciones aún',

  // Description
  typeBadgeStandard: 'Estándar',
  typeBadgeCustom: 'Personalizable',
  descriptionLabel: 'Descripción',

  // Variant selector
  variantGroupColor: 'Color',
  variantGroupSize: 'Talla',
  variantOutOfStock: 'Sin stock',
  variantSelected: (color: string, size: string) => `${color} / ${size}`,
  selectVariantPrompt: 'Seleccioná una variante',

  // Add to cart form
  quantityLabel: 'Cantidad',
  decreaseQty: 'Reducir cantidad',
  increaseQty: 'Aumentar cantidad',
  addToCart: 'Agregar al carrito',
  adding: 'Agregando...',
  loginToCart: 'Inicia sesion para comprar',
  addSuccess: 'Agregado al carrito',
  viewCart: 'Ver carrito',
  stockAvailable: (n: number) => `${n} disponible${n !== 1 ? 's' : ''}`,
  noStockSelected: 'Sin stock para esta variante',

  // Errors
  addError: 'No se pudo agregar al carrito',
  outOfStockError: 'Stock insuficiente para la cantidad solicitada',
  productInactiveError: 'El producto no está disponible',
  selectVariantFirst: 'Seleccioná una variante primero',
} as const;
