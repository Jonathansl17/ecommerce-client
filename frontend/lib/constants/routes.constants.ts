export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  CATALOG: '/catalogo',
  CATALOG_NEW: '/catalogo?categoria=nuevos',
  CATALOG_OFFERS: '/catalogo?categoria=ofertas',
  ORDER_DETAIL: (id: string) => `/orders/${id}`,
} as const;
