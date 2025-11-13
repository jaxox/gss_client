/**
 * PaymentService Interface for GSS Client
 * Handles Stripe payment authorization for event deposits
 */

import type {
  PaymentMethod,
  AuthorizeDepositRequest,
  AuthorizeDepositResponse,
  AddPaymentMethodRequest,
  StripeConfig,
} from '../../types/payment.types';

export interface IPaymentService {
  // Deposit Authorization
  authorizeDeposit(request: AuthorizeDepositRequest): Promise<AuthorizeDepositResponse>;

  // Payment Method Management
  getPaymentMethods(): Promise<PaymentMethod[]>;
  addPaymentMethod(request: AddPaymentMethodRequest): Promise<PaymentMethod>;
  deletePaymentMethod(paymentMethodId: string): Promise<void>;
  setDefaultPaymentMethod(paymentMethodId: string): Promise<void>;

  // Configuration
  getStripeConfig(): Promise<StripeConfig>;
}

/**
 * Abstract base class for PaymentService implementations
 */
export abstract class PaymentService implements IPaymentService {
  protected baseURL: string;

  constructor(baseURL: string = '') {
    this.baseURL = baseURL;
  }

  abstract authorizeDeposit(request: AuthorizeDepositRequest): Promise<AuthorizeDepositResponse>;
  abstract getPaymentMethods(): Promise<PaymentMethod[]>;
  abstract addPaymentMethod(request: AddPaymentMethodRequest): Promise<PaymentMethod>;
  abstract deletePaymentMethod(paymentMethodId: string): Promise<void>;
  abstract setDefaultPaymentMethod(paymentMethodId: string): Promise<void>;
  abstract getStripeConfig(): Promise<StripeConfig>;
}
