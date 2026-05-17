// Defaults aplicables a cualquier listado paginado.
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 50,
};

// Convierte query params (`?page=2&limit=5`) en parámetros listos para Prisma.
// Limpia entradas inválidas: page < 1 → 1; limit fuera de rango → default.
export function parsePagination(query, overrides = {}) {
  const defaults = { ...PAGINATION_DEFAULTS, ...overrides };
  const rawPage = Number.parseInt(query.page, 10);
  const rawLimit = Number.parseInt(query.limit, 10);

  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : defaults.PAGE;
  let limit =
    Number.isFinite(rawLimit) && rawLimit > 0 ? rawLimit : defaults.LIMIT;
  if (limit > defaults.MAX_LIMIT) limit = defaults.MAX_LIMIT;

  return {
    page,
    limit,
    skip: (page - 1) * limit,
    take: limit,
  };
}

// Empaqueta cualquier listado en el shape estándar { data, pagination }.
export function paginatedResponse(data, page, limit, total) {
  return { data, pagination: { page, limit, total } };
}
