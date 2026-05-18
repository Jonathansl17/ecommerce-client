export const CATALOG_STRINGS = {
  title: 'Catálogo',
  subtitle: 'Explora todos los productos disponibles en la tienda.',
  loading: 'Cargando productos...',
  empty: 'No hay productos disponibles en este momento.',
  errorFallback: 'No se pudo cargar el catálogo',
  viewDetail: 'Ver detalle',
  buy: 'Comprar',
  buying: 'Agregando...',
  outOfStock: 'Agotado',
  priceFrom: 'Desde',
  category: 'Categoría',
  noImage: 'Sin imagen',
  unauthorized: 'Debes iniciar sesión para ver el catálogo',
  forbidden: 'No tienes permisos para acceder a este catálogo',
  invalidResponse: 'La respuesta del servidor no tiene el formato esperado',
} as const;

export const CATALOG_API_STRINGS = {
  errorName: 'CatalogRequestError',
  invalidResponseShape: 'Invalid catalog response shape',
  requestUnauthorized: 'Request unauthorized',
  requestForbidden: 'Request forbidden',
  fetchProductsFailed: 'Unable to fetch catalog products',
  productsRequestKey: 'catalog-products',
} as const;

export const CATALOG_REQUEST_ERROR_CODES = {
  REQUEST_UNAUTHORIZED: 'REQUEST_UNAUTHORIZED',
  REQUEST_FORBIDDEN: 'REQUEST_FORBIDDEN',
  INVALID_RESPONSE: 'INVALID_RESPONSE',
  PRODUCTS_FETCH_FAILED: 'PRODUCTS_FETCH_FAILED',
} as const;

export const CATALOG_API_PATHS = {
  products: '/products',
  productsByCategory: (categoryId: string) => `/products/categoria/${categoryId}`,
} as const;

export const CATALOG_IMAGE_FALLBACK_ALT = 'Producto sin imagen';
