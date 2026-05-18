// API paths
export const CART_API_PATHS = {
  CART: '/api/cart',
  CART_ITEMS: '/api/cart/items',
  CART_ITEM: (itemId: string) => `/api/cart/items/${itemId}`,
} as const;

// Request body keys
export const CART_REQUEST_KEYS = {
  VARIANT_ID: 'variantId',
  QUANTITY: 'quantity',
} as const;

// Error codes (mirror backend CART_MESSAGES keys)
export const CART_ERROR_CODES = {
  OUT_OF_STOCK: 'OUT_OF_STOCK',
  PRODUCT_INACTIVE: 'PRODUCT_INACTIVE',
  ITEM_NOT_FOUND: 'ITEM_NOT_FOUND',
} as const;

// Quantity stepper
export const CART_QUANTITY = {
  MIN: 1,
  STEP: 1,
} as const;

// Currency format
export const CART_CURRENCY_FORMAT = {
  LOCALE: 'es-CR',
  SYMBOL: '₡',
} as const;

// UI strings (Spanish)
export const CART_STRINGS = {
  // Page
  pageTitle: 'Mi carrito',
  pageSubtitle: 'Revisá y modificá los productos antes de continuar al pago',

  // Empty state
  emptyTitle: 'Tu carrito está vacío',
  emptyDescription: 'Explorá el catálogo y agregá los productos que te gusten',
  emptyCtaLabel: 'Ir al catálogo',

  // Item row
  removeItem: 'Eliminar',
  removeItemAriaLabel: (name: string) => `Eliminar ${name} del carrito`,
  decreaseQuantity: 'Reducir cantidad',
  increaseQuantity: 'Aumentar cantidad',
  quantityAriaLabel: 'Cantidad',
  unitPrice: 'Precio unitario',
  itemTotal: 'Total',
  colorLabel: 'Color',
  sizeLabel: 'Talla',
  productImageAlt: (name: string) => `Imagen de ${name}`,
  noImage: 'Sin imagen',

  // Summary
  summaryTitle: 'Resumen del pedido',
  subtotalLabel: 'Subtotal',
  taxesLabel: 'IVA (13%)',
  totalLabel: 'Total',
  checkoutCta: 'Proceder al pago',

  // Loading / errors
  loading: 'Cargando carrito...',
  loadError: 'No se pudo cargar el carrito',
  fetchError: 'Error al obtener el carrito',
  addError: 'No se pudo agregar el producto al carrito',
  updateError: 'No se pudo actualizar la cantidad',
  removeError: 'No se pudo eliminar el producto del carrito',
  outOfStock: 'Stock insuficiente para la cantidad solicitada',
  productInactive: 'El producto no está disponible',
  itemNotFound: 'El producto ya no está en el carrito',
} as const;
