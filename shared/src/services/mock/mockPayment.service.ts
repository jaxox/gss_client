/**
 * MockPaymentService for GSS Client
 * Mock implementation for development and testing
 */

import { PaymentService } from '../api/payment.service';
import type {
  PaymentMethod,
  AuthorizeDepositRequest,
  AuthorizeDepositResponse,
  AddPaymentMethodRequest,
  StripeConfig,
} from '../../types/payment.types';

export class MockPaymentService extends PaymentService {
  private mockPaymentMethods: PaymentMethod[] = [];
  private mockAuthorizations: Map<string, AuthorizeDepositResponse> = new Map();
  private paymentMethodIdCounter = 2; // Start at 2 because pm_1 is pre-populated
  private authorizationIdCounter = 1;

  constructor() {
    super('mock://api');
    this.initializeMockData();
  }

  // Reset mock data for testing
  public reset(): void {
    this.mockPaymentMethods = [];
    this.mockAuthorizations.clear();
    this.paymentMethodIdCounter = 2; // Start at 2 because pm_1 is pre-populated
    this.authorizationIdCounter = 1;
    this.initializeMockData();
  }

  private initializeMockData(): void {
    // Pre-populate with a test payment method
    this.mockPaymentMethods.push({
      id: 'pm_1',
      type: 'card',
      card: {
        brand: 'visa',
        last4: '4242',
        expMonth: 12,
        expYear: 2025,
      },
      billingDetails: {
        name: 'Test User',
        email: 'test@example.com',
      },
      isDefault: true,
      createdAt: new Date().toISOString(),
    });
  }

  async authorizeDeposit(request: AuthorizeDepositRequest): Promise<AuthorizeDepositResponse> {
    // Simulate network delay
    await new Promise<void>(resolve => setTimeout(() => resolve(), 800));

    const authorizationId = `pi_${this.authorizationIdCounter++}`;
    const response: AuthorizeDepositResponse = {
      authorizationId,
      amount: request.amount,
      status: 'succeeded',
    };

    this.mockAuthorizations.set(authorizationId, response);

    return response;
  }

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    // Simulate network delay
    await new Promise<void>(resolve => setTimeout(() => resolve(), 500));

    return [...this.mockPaymentMethods];
  }

  async addPaymentMethod(_request: AddPaymentMethodRequest): Promise<PaymentMethod> {
    // Simulate network delay
    await new Promise<void>(resolve => setTimeout(() => resolve(), 700));

    const newMethod: PaymentMethod = {
      id: `pm_${this.paymentMethodIdCounter++}`,
      type: 'card',
      card: {
        brand: 'visa', // In real implementation, this comes from Stripe
        last4: '0000',
        expMonth: 12,
        expYear: 2026,
      },
      isDefault: this.mockPaymentMethods.length === 0,
      createdAt: new Date().toISOString(),
    };

    this.mockPaymentMethods.push(newMethod);

    return newMethod;
  }

  async deletePaymentMethod(paymentMethodId: string): Promise<void> {
    // Simulate network delay
    await new Promise<void>(resolve => setTimeout(() => resolve(), 500));

    this.mockPaymentMethods = this.mockPaymentMethods.filter(pm => pm.id !== paymentMethodId);
  }

  async setDefaultPaymentMethod(paymentMethodId: string): Promise<void> {
    // Simulate network delay
    await new Promise<void>(resolve => setTimeout(() => resolve(), 500));

    this.mockPaymentMethods = this.mockPaymentMethods.map(pm => ({
      ...pm,
      isDefault: pm.id === paymentMethodId,
    }));
  }

  async getStripeConfig(): Promise<StripeConfig> {
    // Simulate network delay
    await new Promise<void>(resolve => setTimeout(() => resolve(), 300));

    return {
      publishableKey: 'pk_test_mock_key_for_development',
      merchantId: 'merchant.com.gss.app', // For Apple Pay
    };
  }
}
