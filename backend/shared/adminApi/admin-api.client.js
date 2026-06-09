// Cliente HTTP delgado para llamar al backend del admin (webhooks).
//
// Variables de entorno (lado cliente):
//   - ADMIN_API_URL   (opcional) base del admin. Default: http://localhost:3000/api
//   - ADMIN_WEBHOOK_KEY (requerida) se envía en el header `x-api-key`. Debe
//     coincidir con ADMIN_API_KEY del backend del admin.
//
// Es servidor-a-servidor: si el admin no responde, el llamador debe tolerar el
// fallo (no revertir su propia operación).

const DEFAULT_ADMIN_API_URL = 'http://localhost:3000/api';
const DEFAULT_TIMEOUT_MS = 10_000;

const buildBaseUrl = () =>
  (process.env.ADMIN_API_URL || DEFAULT_ADMIN_API_URL).replace(/\/$/, '');

const adminApiFetch = async (path, { method = 'GET', timeoutMs = DEFAULT_TIMEOUT_MS } = {}) => {
  const apiKey = process.env.ADMIN_WEBHOOK_KEY;
  if (!apiKey) {
    throw new Error('Falta ADMIN_WEBHOOK_KEY en el entorno del cliente');
  }

  const url = `${buildBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method,
      headers: { 'x-api-key': apiKey },
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`Admin API respondió ${response.status}`);
    }
    return response;
  } finally {
    clearTimeout(timeout);
  }
};

/**
 * Pide al admin que borre la reseña espejo (la que tiene externalId = reviewId
 * del cliente). Idempotente del lado del admin: si ya no existe, responde ok.
 *
 * @param {string|number|bigint} reviewId - id de la reseña en el cliente.
 */
export const deleteReviewOnAdmin = (reviewId) =>
  adminApiFetch(`/reviews/notify/${encodeURIComponent(String(reviewId))}`, {
    method: 'DELETE',
  });
