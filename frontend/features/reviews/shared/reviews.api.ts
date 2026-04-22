import { REVIEW_STRINGS } from '../constants/reviews.constants';
import { MOCK_SEEDED_REVIEWS, REVIEWS_MOCK } from './reviews.mock';
import type {
  ProductReview,
  PurchasedProduct,
  PurchasedProductWithReview,
  ReviewFormData,
  ReviewRating,
} from '../types/reviews.types';

const REVIEWS_STORAGE_KEY = 'reviews_by_user';
const MOCK_SEED_FLAG_KEY = 'reviews_mock_seeded';
const REVIEW_ARTIFICIAL_DELAY_MS = 350;

const PURCHASED_PRODUCTS_MOCK: PurchasedProduct[] = [
  {
    id: 'prod-001',
    name: 'Bolso artesanal de cuero',
    price: '₡28,500',
    purchasedAt: '2026-03-14T10:20:00.000Z',
    orderCompleted: true,
  },
  {
    id: 'prod-002',
    name: 'Taza de cerámica pintada a mano',
    price: '₡6,900',
    purchasedAt: '2026-02-27T15:45:00.000Z',
    orderCompleted: true,
  },
  {
    id: 'prod-003',
    name: 'Collar tejido con piedras naturales',
    price: '₡12,300',
    purchasedAt: '2026-01-11T09:05:00.000Z',
    orderCompleted: true,
  },
];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type StoredReviews = Record<string, ProductReview[]>;

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

function seedMockReviewsIfNeeded(): void {
  if (!REVIEWS_MOCK.enabled || typeof window === 'undefined') return;
  if (window.localStorage.getItem(MOCK_SEED_FLAG_KEY)) return;

  const store = readStoredReviews();
  if (!store[REVIEWS_MOCK.user.id]) {
    store[REVIEWS_MOCK.user.id] = [...MOCK_SEEDED_REVIEWS];
    writeStoredReviews(store);
  }
  window.localStorage.setItem(MOCK_SEED_FLAG_KEY, '1');
}

function getUserReviews(userId: string): ProductReview[] {
  seedMockReviewsIfNeeded();
  const store = readStoredReviews();
  return store[userId] ?? [];
}

function saveUserReviews(userId: string, reviews: ProductReview[]): void {
  const store = readStoredReviews();
  store[userId] = reviews;
  writeStoredReviews(store);
}

export async function fetchPurchasedProductsWithReviews(
  userId: string,
): Promise<PurchasedProductWithReview[]> {
  await delay(REVIEW_ARTIFICIAL_DELAY_MS);
  const reviews = getUserReviews(userId);
  return PURCHASED_PRODUCTS_MOCK.filter((p) => p.orderCompleted).map((product) => ({
    product,
    review: reviews.find((r) => r.productId === product.id) ?? null,
  }));
}

export async function submitReview(
  userId: string,
  userName: string,
  productId: string,
  data: ReviewFormData,
): Promise<ProductReview> {
  await delay(REVIEW_ARTIFICIAL_DELAY_MS);

  const reviews = getUserReviews(userId);
  if (reviews.some((r) => r.productId === productId)) {
    throw new Error(REVIEW_STRINGS.errors.submitFailed);
  }

  const now = new Date().toISOString();
  const newReview: ProductReview = {
    id: `rev-${Date.now()}`,
    productId,
    userId,
    userName,
    rating: data.rating as ReviewRating,
    comment: data.comment.trim(),
    createdAt: now,
    updatedAt: now,
  };

  saveUserReviews(userId, [...reviews, newReview]);
  return newReview;
}

export async function updateReview(
  userId: string,
  reviewId: string,
  data: ReviewFormData,
): Promise<ProductReview> {
  await delay(REVIEW_ARTIFICIAL_DELAY_MS);

  const reviews = getUserReviews(userId);
  const target = reviews.find((r) => r.id === reviewId);
  if (!target) {
    throw new Error(REVIEW_STRINGS.errors.updateFailed);
  }

  const updated: ProductReview = {
    ...target,
    rating: data.rating as ReviewRating,
    comment: data.comment.trim(),
    updatedAt: new Date().toISOString(),
  };

  saveUserReviews(
    userId,
    reviews.map((r) => (r.id === reviewId ? updated : r)),
  );
  return updated;
}
