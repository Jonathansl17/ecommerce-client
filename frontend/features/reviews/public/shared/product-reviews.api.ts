import type { ProductReview } from '@/features/reviews/types/reviews.types';
import { MOCK_PRODUCT_REVIEWS } from '../mocks/product-reviews.mock';

const REVIEW_ARTIFICIAL_DELAY_MS = 350;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchProductReviews(productId: string): Promise<ProductReview[]> {
  await delay(REVIEW_ARTIFICIAL_DELAY_MS);
  return MOCK_PRODUCT_REVIEWS.filter(
    (r) => r.productId === productId && r.status === 'approved',
  );
}
