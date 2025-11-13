/**
 * Payment Types for GSS Client
 * Stripe payment integration types for deposit authorization
 */

export interface PaymentMethod {
  id: string;
  type: 'card';
  card: {
    brand: string; // 'visa', 'mastercard', 'amex', 'discover'
    last4: string;
    expMonth: number;
    expYear: number;
  };
  billingDetails?: {
    name?: string;
    email?: string;
  };
  isDefault: boolean;
  createdAt: string;
}

export interface PaymentAuthorization {
  id: string; // Stripe PaymentIntent ID
  amount: number; // Amount in cents
  currency: string; // 'usd'
  status:
    | 'requires_payment_method'
    | 'requires_confirmation'
    | 'requires_action'
    | 'processing'
    | 'requires_capture'
    | 'canceled'
    | 'succeeded';
  paymentMethodId: string;
  createdAt: string;
}

export interface AuthorizeDepositRequest {
  eventId: string;
  amount: number; // Amount in cents
  paymentMethodId?: string; // Optional if using default
}

export interface AuthorizeDepositResponse {
  authorizationId: string;
  amount: number;
  status: string;
}

export interface AddPaymentMethodRequest {
  token: string; // Stripe token or payment method ID
}

export interface StripeConfig {
  publishableKey: string;
  merchantId?: string; // For Apple Pay
}
