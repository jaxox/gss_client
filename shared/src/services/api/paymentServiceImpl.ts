/**
 * Real PaymentService Implementation for GSS Client
 * Uses ky HTTP client to communicate with backend API for Stripe payment operations
 */

import { PaymentService } from './payment.service';
import { httpClient, getApiError } from '../http/client';
import type {
  PaymentMethod,
  AuthorizeDepositRequest,
  AuthorizeDepositResponse,
  AddPaymentMethodRequest,
  StripeConfig,
} from '../../types/payment.types';

export class PaymentServiceImpl extends PaymentService {
  constructor(baseURL: string = '') {
    super(baseURL);
  }

  async authorizeDeposit(request: AuthorizeDepositRequest): Promise<AuthorizeDepositResponse> {
    try {
      const response = await httpClient
        .post('payments/authorize', {
          json: request,
        })
        .json<AuthorizeDepositResponse>();

      return response;
    } catch (error) {
      throw getApiError(error);
    }
  }

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const response = await httpClient
        .get('payments/methods')
        .json<{ paymentMethods: PaymentMethod[] }>();

      return response.paymentMethods;
    } catch (error) {
      throw getApiError(error);
    }
  }

  async addPaymentMethod(request: AddPaymentMethodRequest): Promise<PaymentMethod> {
    try {
      const response = await httpClient
        .post('payments/methods', {
          json: request,
        })
        .json<{ paymentMethod: PaymentMethod }>();

      return response.paymentMethod;
    } catch (error) {
      throw getApiError(error);
    }
  }

  async deletePaymentMethod(paymentMethodId: string): Promise<void> {
    try {
      await httpClient.delete(`payments/methods/${paymentMethodId}`).json();
    } catch (error) {
      throw getApiError(error);
    }
  }

  async setDefaultPaymentMethod(paymentMethodId: string): Promise<void> {
    try {
      await httpClient
        .put('payments/methods/default', {
          json: { paymentMethodId },
        })
        .json();
    } catch (error) {
      throw getApiError(error);
    }
  }

  async getStripeConfig(): Promise<StripeConfig> {
    try {
      const response = await httpClient.get('payments/stripe-config').json<StripeConfig>();

      return response;
    } catch (error) {
      throw getApiError(error);
    }
  }
}
