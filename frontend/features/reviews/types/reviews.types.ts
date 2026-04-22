export type ReviewRating = 1 | 2 | 3 | 4 | 5;

export interface PurchasedProduct {
  id: string;
  name: string;
  price: string;
  purchasedAt: string;
  orderCompleted: boolean;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: ReviewRating;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewFormData {
  rating: ReviewRating | 0;
  comment: string;
}

export interface ReviewFormErrors {
  rating?: string;
  comment?: string;
  general?: string;
}

export interface PurchasedProductWithReview {
  product: PurchasedProduct;
  review: ProductReview | null;
}

export interface UseReviewsResult {
  items: PurchasedProductWithReview[];
  loading: boolean;
  error: string | null;
  submitReview: (productId: string, data: ReviewFormData) => Promise<ProductReview>;
  updateReview: (reviewId: string, data: ReviewFormData) => Promise<ProductReview>;
}

export interface StarRatingProps {
  value: ReviewRating | 0;
  onChange: (value: ReviewRating) => void;
  disabled?: boolean;
  hasError?: boolean;
}

export interface StarRatingDisplayProps {
  value: ReviewRating;
  size?: 'sm' | 'md';
}

export interface ReviewFormProps {
  initialData?: ReviewFormData;
  submitting: boolean;
  onCancel?: () => void;
  onSubmit: (data: ReviewFormData) => Promise<void>;
  submitLabel: string;
  submittingLabel: string;
}

export interface ReviewCardProps {
  review: ProductReview;
  onEdit: () => void;
}

export interface PurchasedProductCardProps {
  item: PurchasedProductWithReview;
  isEditing: boolean;
  submitting: boolean;
  onStartEditing: () => void;
  onCancel: () => void;
  onSubmit: (data: ReviewFormData) => Promise<void>;
}

export interface ReviewToastProps {
  message: string;
  onClose: () => void;
}
