'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import {
  CHECKOUT_STRINGS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_METHODS,
  MIN_ADDRESS_LENGTH,
  MAX_ADDRESS_LENGTH,
  MAX_REFERENCE_LENGTH,
} from '../constants/checkout.constants';
import type { CheckoutPayload, PaymentMethod } from '../types/checkout.types';

export interface CheckoutFormProps {
  enviando: boolean;
  error: string | null;
  onSubmit: (payload: CheckoutPayload) => void;
}

export function CheckoutForm({ enviando, error, onSubmit }: CheckoutFormProps) {
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [externalReference, setExternalReference] = useState('');

  const addressLength = shippingAddress.trim().length;
  const isAddressValid =
    addressLength >= MIN_ADDRESS_LENGTH && addressLength <= MAX_ADDRESS_LENGTH;
  const isSubmitDisabled = enviando || !isAddressValid;

  function handleAddressChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setShippingAddress(e.target.value);
  }

  function handlePaymentMethodChange(e: ChangeEvent<HTMLInputElement>) {
    setPaymentMethod(e.target.value as PaymentMethod);
  }

  function handleExternalReferenceChange(e: ChangeEvent<HTMLInputElement>) {
    setExternalReference(e.target.value);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitDisabled) return;

    const payload: CheckoutPayload = {
      shippingAddress: shippingAddress.trim(),
      paymentMethod,
    };

    if (externalReference.trim().length > 0) {
      payload.externalReference = externalReference.trim();
    }

    onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Top-level error */}
      {error !== null && (
        <div
          role="alert"
          className="rounded-2xl border border-destructive/40 bg-destructive/5 px-4 py-3"
        >
          <p className="text-sm font-medium text-destructive">{error}</p>
        </div>
      )}

      {/* Shipping address */}
      <div className="space-y-2">
        <label
          htmlFor="checkout-address"
          className="block text-sm font-semibold text-foreground"
        >
          {CHECKOUT_STRINGS.addressLabel}
        </label>
        <textarea
          id="checkout-address"
          name="shippingAddress"
          rows={3}
          value={shippingAddress}
          onChange={handleAddressChange}
          placeholder={CHECKOUT_STRINGS.addressPlaceholder}
          maxLength={MAX_ADDRESS_LENGTH}
          disabled={enviando}
          aria-describedby="checkout-address-counter"
          aria-required="true"
          className="w-full resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
        <p
          id="checkout-address-counter"
          className="text-right text-xs text-muted-foreground"
          aria-live="polite"
        >
          {CHECKOUT_STRINGS.addressCounter(addressLength, MAX_ADDRESS_LENGTH)}
        </p>
      </div>

      {/* Payment method */}
      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold text-foreground">
          {CHECKOUT_STRINGS.paymentMethodLabel}
        </legend>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {PAYMENT_METHODS.map((method) => (
            <label
              key={method}
              className={[
                'flex cursor-pointer items-center justify-center rounded-xl border px-3 py-2 text-sm font-medium transition-colors',
                paymentMethod === method
                  ? 'border-ring bg-accent text-accent-foreground'
                  : 'border-input bg-background text-foreground hover:bg-accent/50',
                enviando ? 'cursor-not-allowed opacity-50' : '',
              ]
                .join(' ')
                .trim()}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method}
                checked={paymentMethod === method}
                onChange={handlePaymentMethodChange}
                disabled={enviando}
                className="sr-only"
              />
              {PAYMENT_METHOD_LABELS[method]}
            </label>
          ))}
        </div>
      </fieldset>

      {/* External reference (optional) */}
      <div className="space-y-2">
        <label
          htmlFor="checkout-reference"
          className="block text-sm font-semibold text-foreground"
        >
          {CHECKOUT_STRINGS.externalReferenceLabel}
        </label>
        <input
          id="checkout-reference"
          name="externalReference"
          type="text"
          value={externalReference}
          onChange={handleExternalReferenceChange}
          placeholder={CHECKOUT_STRINGS.externalReferencePlaceholder}
          maxLength={MAX_REFERENCE_LENGTH}
          disabled={enviando}
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitDisabled}
        className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {enviando ? CHECKOUT_STRINGS.submittingButton : CHECKOUT_STRINGS.submitButton}
      </button>
    </form>
  );
}
