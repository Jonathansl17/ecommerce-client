export type ReviewRating = 1 | 2 | 3 | 4 | 5;

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export type VoteType = 'helpful' | 'unhelpful';

export type OrderStatus =
  | 'pending_payment'
  | 'confirmed'
  | 'in_preparation'
  | 'ready_shipment'
  | 'shipped'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

export interface PurchasedProductVariant {
  id: string;
  color: string;
  size: string;
  price: string;
}

export interface PurchasedProduct {
  orderId: string;
  orderStatus: OrderStatus;
  itemId: string;
  variantId: string;
  name: string;
  imageUrl: string;
  price: string;
  purchasedAt: string;
  variant: PurchasedProductVariant;
}

export interface ProductReview {
  id: string;
  productId: string;
  clientUserId: string;
  clientUserName: string;
  rating: ReviewRating;
  comment: string;
  status: ReviewStatus;
  edited: boolean;
  helpfulVotes: number;
  unhelpfulVotes: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewVote {
  id: string;
  reviewId: string;
  clientUserId: string;
  voteType: VoteType;
  createdAt: string;
}

export interface RatingsSummary {
  productId: string;
  average: number;
  totalReviews: number;
  stars1: number;
  stars2: number;
  stars3: number;
  stars4: number;
  stars5: number;
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
  deleteReview: (productId: string, reviewId: string) => Promise<void>;
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
  onDelete: () => void;
}

export interface PurchasedProductCardProps {
  item: PurchasedProductWithReview;
  isEditing: boolean;
  submitting: boolean;
  deleting: boolean;
  onStartEditing: () => void;
  onCancel: () => void;
  onSubmit: (data: ReviewFormData) => Promise<void>;
  onDelete: () => Promise<void>;
}

export interface ReviewToastProps {
  message: string;
  onClose: () => void;
}

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  destructive?: boolean;
}
