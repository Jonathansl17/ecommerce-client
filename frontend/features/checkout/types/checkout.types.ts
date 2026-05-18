export type PaymentMethod = 'SINPE' | 'cash' | 'card' | 'other';

export interface CheckoutPayload {
  shippingAddress: string;
  paymentMethod: PaymentMethod;
  externalReference?: string;
}

export interface CheckoutResponse {
  message: string;
  order: {
    id: string;
  };
}
