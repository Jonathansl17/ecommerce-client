import { API_BASE_URL, REQUEST_TIMEOUT_MS } from '@/lib/constants/api.constants';
import type { ReviewResponse, VoteType } from '../types/reviews.types';
import type {
  DateFilter,
  HelpfulFilter,
  MyReviewVotes,
  ProductReviewsServerResponse,
  RatingFilter,
} from '../types/product-reviews.types';

interface FetchProductReviewsArgs {
  productId: string;
  page: number;
  limit: number;
  rating: RatingFilter;
  date: DateFilter;
  helpful: HelpfulFilter;
}

export async function fetchProductReviews({
  productId,
  page,
  limit,
  rating,
  date,
  helpful,
}: FetchProductReviewsArgs): Promise<ProductReviewsServerResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    date,
    helpful,
  });
  if (rating !== 'all') params.set('rating', rating);

  try {
    const response = await fetch(
      `${API_BASE_URL}/reviews/product/${encodeURIComponent(productId)}?${params}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'fetch',
        },
        credentials: 'include',
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const message =
        (body && typeof body.error === 'string' && body.error) ||
        'Error al cargar las reseñas.';
      throw new Error(message);
    }

    return (await response.json()) as ProductReviewsServerResponse;
  } finally {
    clearTimeout(timeout);
  }
}

// Helper compartido por las 3 funciones de votación.
async function votesFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'fetch',
        ...init.headers,
      },
      credentials: 'include',
      signal: controller.signal,
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const message =
        (body && typeof body.error === 'string' && body.error) ||
        'Error al procesar el voto.';
      throw new Error(message);
    }

    if (response.status === 204) return undefined as T;
    return (await response.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchMyVotes(reviewIds: string[]): Promise<MyReviewVotes> {
  if (reviewIds.length === 0) return {};
  const params = new URLSearchParams({ reviewIds: reviewIds.join(',') });
  return votesFetch<MyReviewVotes>(`/reviews/me/votes?${params}`);
}

export async function voteOnReview(
  reviewId: string,
  voteType: VoteType,
): Promise<void> {
  await votesFetch<{ message: string; voteType: VoteType }>(
    `/reviews/${encodeURIComponent(reviewId)}/vote`,
    { method: 'POST', body: JSON.stringify({ voteType }) },
  );
}

export async function removeReviewVote(reviewId: string): Promise<void> {
  await votesFetch<{ message: string }>(
    `/reviews/${encodeURIComponent(reviewId)}/vote`,
    { method: 'DELETE' },
  );
}


// Helper para las operaciones de respuesta: lanza con el mensaje del backend.
async function responseFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'fetch',
        ...init.headers,
      },
      credentials: 'include',
      signal: controller.signal,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      const message =
        (body && typeof body.error === 'string' && body.error) ||
        'Error al procesar la respuesta.';
      throw new Error(message);
    }

    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

export async function respondToReview(
  reviewId: string,
  content: string,
): Promise<ReviewResponse> {
  const body = await responseFetch<{ message: string; response: ReviewResponse }>(
    `/reviews/${encodeURIComponent(reviewId)}/response`,
    { method: 'POST', body: JSON.stringify({ content }) },
  );
  return body.response;
}

export async function updateReviewResponse(
  reviewId: string,
  content: string,
): Promise<ReviewResponse> {
  const body = await responseFetch<{ message: string; response: ReviewResponse }>(
    `/reviews/${encodeURIComponent(reviewId)}/response`,
    { method: 'PUT', body: JSON.stringify({ content }) },
  );
  return body.response;
}

export async function deleteReviewResponse(reviewId: string): Promise<void> {
  await responseFetch<{ message: string }>(
    `/reviews/${encodeURIComponent(reviewId)}/response`,
    { method: 'DELETE' },
  );
}

// Eliminación por moderación (US-REV-006): admin elimina la reseña de otro usuario
// indicando el motivo obligatorio. Solo lo permite el backend a usuarios admin.
export async function deleteReviewAsAdmin(
  reviewId: string,
  reason: string,
): Promise<void> {
  await responseFetch<{ message: string }>(
    `/reviews/${encodeURIComponent(reviewId)}/moderation`,
    { method: 'DELETE', body: JSON.stringify({ reason }) },
  );
}
