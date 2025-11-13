/**
 * RSVPPaymentDialog - Stripe Payment Elements dialog for deposit authorization
 */

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { CheckCircle, Warning } from '@mui/icons-material';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import type { EventDetailView } from '@gss/shared';

interface RSVPPaymentDialogProps {
  open: boolean;
  event: EventDetailView;
  loading: boolean;
  onConfirm: (paymentMethodId: string) => Promise<void>;
  onClose: () => void;
}

interface PaymentFormProps {
  event: EventDetailView;
  loading: boolean;
  onConfirm: (paymentMethodId: string) => Promise<void>;
  onClose: () => void;
}

// Payment form component with Stripe hooks
function PaymentForm({ event, loading, onConfirm, onClose }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Submit the payment element to create a payment method
      const { error: submitError, paymentMethod } = await stripe.createPaymentMethod({
        elements,
      });

      if (submitError) {
        setError(submitError.message || 'Payment method creation failed');
        setProcessing(false);
        return;
      }

      if (!paymentMethod) {
        setError('No payment method created');
        setProcessing(false);
        return;
      }

      // Call the parent's onConfirm with the payment method ID
      await onConfirm(paymentMethod.id);
      setProcessing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment authorization failed');
      setProcessing(false);
    }
  };

  const depositAmount = `$${(event.depositAmount / 100).toFixed(0)}`;

  return (
    <form onSubmit={handleSubmit}>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Alert severity="info" icon={<Warning />}>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              Deposit Authorization
            </Typography>
            <Typography variant="caption">
              We'll authorize {depositAmount} on your card. You won't be charged unless you don't
              check in at the event. The deposit will be refunded when you check in.
            </Typography>
          </Alert>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Event Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {event.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Deposit: {depositAmount}
          </Typography>
        </Box>

        <Box sx={{ my: 3 }}>
          <PaymentElement />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={processing || loading}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={!stripe || processing || loading}
          startIcon={processing || loading ? <CircularProgress size={20} /> : <CheckCircle />}
        >
          {processing || loading ? 'Processing...' : `Authorize ${depositAmount}`}
        </Button>
      </DialogActions>
    </form>
  );
}

export default function RSVPPaymentDialog({
  open,
  event,
  loading,
  onConfirm,
  onClose,
}: RSVPPaymentDialogProps) {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [setupError, setSetupError] = useState<string | null>(null);

  useEffect(() => {
    if (open && !stripePromise) {
      // Initialize Stripe
      const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
      if (!publishableKey) {
        setSetupError('Stripe is not configured. Please contact support.');
        return;
      }
      setStripePromise(loadStripe(publishableKey));
    }
  }, [open, stripePromise]);

  useEffect(() => {
    if (open && !clientSecret) {
      // In a real app, you'd call your backend to create a SetupIntent or PaymentIntent
      // For now, we'll use a mock client secret (this won't work with real Stripe)
      // TODO: Replace with actual API call to create SetupIntent
      const mockClientSecret = 'pi_mock_client_secret_for_development';
      setClientSecret(mockClientSecret);
    }
  }, [open, clientSecret]);

  const handleClose = () => {
    setClientSecret(null);
    setSetupError(null);
    onClose();
  };

  const depositAmount = `$${(event.depositAmount / 100).toFixed(0)}`;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Authorize Deposit - {depositAmount}</DialogTitle>

      {setupError ? (
        <>
          <DialogContent>
            <Alert severity="error">{setupError}</Alert>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleClose} variant="contained">
              Close
            </Button>
          </DialogActions>
        </>
      ) : !stripePromise || !clientSecret ? (
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        </DialogContent>
      ) : (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: 'stripe',
            },
          }}
        >
          <PaymentForm
            event={event}
            loading={loading}
            onConfirm={onConfirm}
            onClose={handleClose}
          />
        </Elements>
      )}
    </Dialog>
  );
}
