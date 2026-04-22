import { REVIEW_STRINGS } from '../constants/reviews.constants';
import { MOCK_SEEDED_REVIEWS, REVIEWS_MOCK } from './reviews.mock';
import type {
  ProductReview,
  PurchasedProduct,
  PurchasedProductWithReview,
  RatingsSummary,
  ReviewFormData,
  ReviewRating,
} from '../types/reviews.types';

const REVIEWS_STORAGE_KEY = 'reviews_by_user_v2';
const MOCK_SEED_FLAG_KEY = 'reviews_mock_seeded_v2';
const RATINGS_SUMMARY_STORAGE_KEY = 'ratings_summary_by_product_v1';
const REVIEW_ARTIFICIAL_DELAY_MS = 350;

const PURCHASED_PRODUCTS_MOCK: PurchasedProduct[] = [
  {
    orderId: 'ord-1001',
    orderStatus: 'delivered',
    itemId: 'prod-001',
    variantId: 'var-001-a',
    name: 'Bolso artesanal de cuero',
    imageUrl: '',
    price: '₡28,500',
    purchasedAt: '2026-03-14T10:20:00.000Z',
    variant: {
      id: 'var-001-a',
      color: 'Café',
      size: 'Único',
      price: '₡28,500',
    },
  },
  {
    orderId: 'ord-1002',
    orderStatus: 'delivered',
    itemId: 'prod-002',
    variantId: 'var-002-a',
    name: 'Taza de cerámica pintada a mano',
    imageUrl: '',
    price: '₡6,900',
    purchasedAt: '2026-02-27T15:45:00.000Z',
    variant: {
      id: 'var-002-a',
      color: 'Azul',
      size: '350 ml',
      price: '₡6,900',
    },
  },
  {
    orderId: 'ord-1003',
    orderStatus: 'delivered',
    itemId: 'prod-003',
    variantId: 'var-003-a',
    name: 'Collar tejido con piedras naturales',
    imageUrl: '',
    price: '₡12,300',
    purchasedAt: '2026-01-11T09:05:00.000Z',
    variant: {
      id: 'var-003-a',
      color: 'Multicolor',
      size: '45 cm',
      price: '₡12,300',
    },
  },
];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type StoredReviews = Record<string, ProductReview[]>;
type StoredSummaries = Record<string, RatingsSummary>;

function readStoredReviews(): StoredReviews {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(REVIEWS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredReviews) : {};
  } catch {
    return {};
  }
}

function writeStoredReviews(store: StoredReviews): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(store));
}

function readStoredSummaries(): StoredSummaries {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(RATINGS_SUMMARY_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredSummaries) : {};
  } catch {
    return {};
  }
}

function writeStoredSummaries(store: StoredSummaries): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(RATINGS_SUMMARY_STORAGE_KEY, JSON.stringify(store));
}

function emptySummary(productId: string): RatingsSummary {
  return {
    productId,
    average: 0,
    totalReviews: 0,
    stars1: 0,
    stars2: 0,
    stars3: 0,
    stars4: 0,
    stars5: 0,
  };
}

function recalculateSummary(productId: string): RatingsSummary {
  const allReviews = Object.values(readStoredReviews()).flat();
  const productReviews = allReviews.filter(
    (r) => r.productId === productId && r.status !== 'rejected',
  );

  const summary = emptySummary(productId);
  for (const review of productReviews) {
    summary.totalReviews += 1;
    const key = `stars${review.rating}` as keyof Pick<
      RatingsSummary,
      'stars1' | 'stars2' | 'stars3' | 'stars4' | 'stars5'
    >;
    summary[key] += 1;
  }

  if (summary.totalReviews > 0) {
    const totalScore = productReviews.reduce((acc, r) => acc + r.rating, 0);
    summary.average = Math.round((totalScore / summary.totalReviews) * 10) / 10;
  }

  const store = readStoredSummaries();
  store[productId] = summary;
  writeStoredSummaries(store);
  return summary;
}

function seedMockReviewsIfNeeded(): void {
  if (!REVIEWS_MOCK.enabled || typeof window === 'undefined') return;
  if (window.localStorage.getItem(MOCK_SEED_FLAG_KEY)) return;

  const store = readStoredReviews();
  if (!store[REVIEWS_MOCK.user.id]) {
    store[REVIEWS_MOCK.user.id] = [...MOCK_SEEDED_REVIEWS];
    writeStoredReviews(store);
    for (const review of MOCK_SEEDED_REVIEWS) {
      recalculateSummary(review.productId);
    }
  }
  window.localStorage.setItem(MOCK_SEED_FLAG_KEY, '1');
}

function getUserReviews(clientUserId: string): ProductReview[] {
  seedMockReviewsIfNeeded();
  const store = readStoredReviews();
  return store[clientUserId] ?? [];
}

function saveUserReviews(clientUserId: string, reviews: ProductReview[]): void {
  const store = readStoredReviews();
  store[clientUserId] = reviews;
  writeStoredReviews(store);
}

export async function fetchPurchasedProductsWithReviews(
  clientUserId: string,
): Promise<PurchasedProductWithReview[]> {
  await delay(REVIEW_ARTIFICIAL_DELAY_MS);
  const reviews = getUserReviews(clientUserId);
  return PURCHASED_PRODUCTS_MOCK.filter((p) => p.orderStatus === 'delivered').map(
    (product) => ({
      product,
      review: reviews.find((r) => r.productId === product.itemId) ?? null,
    }),
  );
}

export async function submitReview(
  clientUserId: string,
  clientUserName: string,
  productId: string,
  data: ReviewFormData,
): Promise<ProductReview> {
  await delay(REVIEW_ARTIFICIAL_DELAY_MS);

  const reviews = getUserReviews(clientUserId);
  if (reviews.some((r) => r.productId === productId)) {
    throw new Error(REVIEW_STRINGS.errors.submitFailed);
  }

  const now = new Date().toISOString();
  const newReview: ProductReview = {
    id: `rev-${Date.now()}`,
    productId,
    clientUserId,
    clientUserName,
    rating: data.rating as ReviewRating,
    comment: data.comment.trim(),
    status: 'pending',
    edited: false,
    helpfulVotes: 0,
    unhelpfulVotes: 0,
    createdAt: now,
    updatedAt: now,
  };

  saveUserReviews(clientUserId, [...reviews, newReview]);
  recalculateSummary(productId);
  return newReview;
}

export async function updateReview(
  clientUserId: string,
  reviewId: string,
  data: ReviewFormData,
): Promise<ProductReview> {
  await delay(REVIEW_ARTIFICIAL_DELAY_MS);

  const reviews = getUserReviews(clientUserId);
  const target = reviews.find((r) => r.id === reviewId);
  if (!target) {
    throw new Error(REVIEW_STRINGS.errors.updateFailed);
  }
  if (target.clientUserId !== clientUserId) {
    throw new Error(REVIEW_STRINGS.errors.notOwner);
  }

  const updated: ProductReview = {
    ...target,
    rating: data.rating as ReviewRating,
    comment: data.comment.trim(),
    edited: true,
    updatedAt: new Date().toISOString(),
  };

  saveUserReviews(
    clientUserId,
    reviews.map((r) => (r.id === reviewId ? updated : r)),
  );
  recalculateSummary(updated.productId);
  return updated;
}

export async function deleteReview(
  clientUserId: string,
  reviewId: string,
): Promise<void> {
  await delay(REVIEW_ARTIFICIAL_DELAY_MS);

  const reviews = getUserReviews(clientUserId);
  const target = reviews.find((r) => r.id === reviewId);
  if (!target) {
    throw new Error(REVIEW_STRINGS.errors.deleteNotFound);
  }
  if (target.clientUserId !== clientUserId) {
    throw new Error(REVIEW_STRINGS.errors.notOwner);
  }

  saveUserReviews(
    clientUserId,
    reviews.filter((r) => r.id !== reviewId),
  );
  recalculateSummary(target.productId);
}

export function getRatingsSummary(productId: string): RatingsSummary {
  seedMockReviewsIfNeeded();
  const store = readStoredSummaries();
  return store[productId] ?? emptySummary(productId);
}
