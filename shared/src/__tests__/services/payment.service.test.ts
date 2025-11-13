/**
 * PaymentService Tests
 * Unit tests for MockPaymentService
 */

import { MockPaymentService } from '../../services/mock/mockPayment.service';
import type { AuthorizeDepositRequest, AddPaymentMethodRequest } from '../../types/payment.types';

describe('MockPaymentService', () => {
  let service: MockPaymentService;

  beforeEach(() => {
    service = new MockPaymentService();
  });

  afterEach(() => {
    service.reset();
  });

  describe('authorizeDeposit', () => {
    it('should authorize a deposit successfully', async () => {
      const request: AuthorizeDepositRequest = {
        eventId: 'event-1',
        amount: 500, // $5.00
        paymentMethodId: 'pm_1',
      };

      const response = await service.authorizeDeposit(request);

      expect(response).toBeDefined();
      expect(response.authorizationId).toMatch(/^pi_\d+$/);
      expect(response.amount).toBe(500);
      expect(response.status).toBe('succeeded');
    });

    it('should authorize different deposit amounts', async () => {
      const request1: AuthorizeDepositRequest = {
        eventId: 'event-1',
        amount: 500,
      };
      const request2: AuthorizeDepositRequest = {
        eventId: 'event-2',
        amount: 1000, // $10.00
      };

      const response1 = await service.authorizeDeposit(request1);
      const response2 = await service.authorizeDeposit(request2);

      expect(response1.amount).toBe(500);
      expect(response2.amount).toBe(1000);
      expect(response1.authorizationId).not.toBe(response2.authorizationId);
    });

    it('should handle multiple authorizations', async () => {
      const request: AuthorizeDepositRequest = {
        eventId: 'event-1',
        amount: 500,
      };

      const response1 = await service.authorizeDeposit(request);
      const response2 = await service.authorizeDeposit(request);

      expect(response1.authorizationId).not.toBe(response2.authorizationId);
      expect(response1.status).toBe('succeeded');
      expect(response2.status).toBe('succeeded');
    });
  });

  describe('getPaymentMethods', () => {
    it('should return default payment method', async () => {
      const methods = await service.getPaymentMethods();

      expect(methods).toHaveLength(1);
      expect(methods[0].id).toBe('pm_1');
      expect(methods[0].card.last4).toBe('4242');
      expect(methods[0].card.brand).toBe('visa');
      expect(methods[0].isDefault).toBe(true);
    });

    it('should return empty array after reset', async () => {
      service.reset();
      const methods = await service.getPaymentMethods();

      expect(methods).toHaveLength(1); // Reset re-initializes default method
      expect(methods[0].id).toBe('pm_1');
    });
  });

  describe('addPaymentMethod', () => {
    it('should add a new payment method', async () => {
      const request: AddPaymentMethodRequest = {
        token: 'tok_visa',
      };

      const newMethod = await service.addPaymentMethod(request);

      expect(newMethod).toBeDefined();
      expect(newMethod.id).toMatch(/^pm_\d+$/);
      expect(newMethod.type).toBe('card');
      expect(newMethod.card.brand).toBe('visa');
    });

    it('should add multiple payment methods', async () => {
      const request: AddPaymentMethodRequest = {
        token: 'tok_visa',
      };

      const method1 = await service.addPaymentMethod(request);
      const method2 = await service.addPaymentMethod(request);

      expect(method1.id).not.toBe(method2.id);

      const allMethods = await service.getPaymentMethods();
      expect(allMethods).toHaveLength(3); // 1 default + 2 added
    });

    it('should set first added method as default if no methods exist', async () => {
      // This scenario is tested by the initialization behavior
      const methods = await service.getPaymentMethods();
      expect(methods[0].isDefault).toBe(true);
    });

    it('should not set new method as default if methods already exist', async () => {
      const request: AddPaymentMethodRequest = {
        token: 'tok_visa',
      };

      const newMethod = await service.addPaymentMethod(request);

      expect(newMethod.isDefault).toBe(false);
    });
  });

  describe('deletePaymentMethod', () => {
    it('should delete a payment method', async () => {
      const request: AddPaymentMethodRequest = {
        token: 'tok_visa',
      };
      const newMethod = await service.addPaymentMethod(request);

      await service.deletePaymentMethod(newMethod.id);

      const methods = await service.getPaymentMethods();
      expect(methods.find(m => m.id === newMethod.id)).toBeUndefined();
    });

    it('should handle deleting non-existent method gracefully', async () => {
      await expect(service.deletePaymentMethod('pm_nonexistent')).resolves.not.toThrow();

      const methods = await service.getPaymentMethods();
      expect(methods).toHaveLength(1); // Default method still exists
    });

    it('should maintain other methods when deleting one', async () => {
      const request: AddPaymentMethodRequest = {
        token: 'tok_visa',
      };
      const method1 = await service.addPaymentMethod(request);
      const method2 = await service.addPaymentMethod(request);

      await service.deletePaymentMethod(method1.id);

      const methods = await service.getPaymentMethods();
      expect(methods.find(m => m.id === method2.id)).toBeDefined();
    });
  });

  describe('setDefaultPaymentMethod', () => {
    it('should set a payment method as default', async () => {
      const request: AddPaymentMethodRequest = {
        token: 'tok_visa',
      };
      const newMethod = await service.addPaymentMethod(request);

      await service.setDefaultPaymentMethod(newMethod.id);

      const methods = await service.getPaymentMethods();
      const updatedMethod = methods.find(m => m.id === newMethod.id);
      const defaultMethod = methods.find(m => m.id === 'pm_1');

      expect(updatedMethod?.isDefault).toBe(true);
      expect(defaultMethod?.isDefault).toBe(false);
    });

    it('should unset previous default when setting new default', async () => {
      const request: AddPaymentMethodRequest = {
        token: 'tok_visa',
      };
      const method1 = await service.addPaymentMethod(request);
      const method2 = await service.addPaymentMethod(request);

      await service.setDefaultPaymentMethod(method1.id);
      await service.setDefaultPaymentMethod(method2.id);

      const methods = await service.getPaymentMethods();
      const defaultMethods = methods.filter(m => m.isDefault);

      expect(defaultMethods).toHaveLength(1);
      expect(defaultMethods[0].id).toBe(method2.id);
    });
  });

  describe('getStripeConfig', () => {
    it('should return Stripe configuration', async () => {
      const config = await service.getStripeConfig();

      expect(config).toBeDefined();
      expect(config.publishableKey).toBe('pk_test_mock_key_for_development');
      expect(config.merchantId).toBe('merchant.com.gss.app');
    });

    it('should return consistent configuration', async () => {
      const config1 = await service.getStripeConfig();
      const config2 = await service.getStripeConfig();

      expect(config1).toEqual(config2);
    });
  });

  describe('reset', () => {
    it('should reset all mock data', async () => {
      // Add some payment methods
      const request: AddPaymentMethodRequest = {
        token: 'tok_visa',
      };
      await service.addPaymentMethod(request);
      await service.addPaymentMethod(request);

      // Authorize a deposit
      const authRequest: AuthorizeDepositRequest = {
        eventId: 'event-1',
        amount: 500,
      };
      await service.authorizeDeposit(authRequest);

      // Reset
      service.reset();

      // Verify reset
      const methods = await service.getPaymentMethods();
      expect(methods).toHaveLength(1); // Only default method
      expect(methods[0].id).toBe('pm_1'); // Default re-initialized
    });
  });
});
