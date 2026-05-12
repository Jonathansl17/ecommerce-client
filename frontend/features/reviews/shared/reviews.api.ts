import { API_BASE_URL, REQUEST_TIMEOUT_MS } from '@/lib/constants/api.constants';
import type {
  PaginatedResponse,
  ProductReview,
  PurchasedProductWithReview,
  ReviewFormData,
} from '../types/reviews.types';

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'fetch',
        ...options.headers,
      },
      credentials: 'include',
      signal: controller.signal,
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const message =
        (body && typeof body.error === 'string' && body.error) ||
        'Error en la solicitud.';
      throw new Error(message);
    }

    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchPurchasedProductsWithReviews(
  page: number,
  limit: number,
): Promise<PaginatedResponse<PurchasedProductWithReview>> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  return apiFetch<PaginatedResponse<PurchasedProductWithReview>>(
    `/reviews/me?${params}`,
  );
}

export async function submitReview(
  productId: string,
  data: ReviewFormData,
): Promise<ProductReview> {
  const result = await apiFetch<{ review: ProductReview }>('/reviews', {
    method: 'POST',
    body: JSON.stringify({ productId: Number(productId), rating: data.rating, comment: data.comment }),
  });
  return result.review;
}

export async function updateReview(
  reviewId: string,
  data: ReviewFormData,
): Promise<ProductReview> {
  const result = await apiFetch<{ review: ProductReview }>(`/reviews/${reviewId}`, {
    method: 'PUT',
    body: JSON.stringify({ rating: data.rating, comment: data.comment }),
  });
  return result.review;
}

export async function deleteReview(reviewId: string): Promise<void> {
  await apiFetch<void>(`/reviews/${reviewId}`, { method: 'DELETE' });
}
