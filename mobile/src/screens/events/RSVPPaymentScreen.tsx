/**
 * RSVPPaymentScreen - Stripe Payment Authorization for Event Deposits
 * Handles payment method selection and authorization for deposit events
 */

import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import {
  Text,
  Button,
  Card,
  Divider,
  useTheme,
  ActivityIndicator,
} from 'react-native-paper';
import { CardField } from '@stripe/stripe-react-native';

// Stripe card field style constant
const CARD_STYLE = {
  backgroundColor: '#FFFFFF',
  textColor: '#000000',
};
import { useAppDispatch } from '../../store/hooks';
import { createRSVP } from '../../store/events/eventsSlice';
import { MockPaymentService } from '@shared/services/mock/mockPayment.service';

interface RSVPPaymentScreenProps {
  route: {
    params: {
      eventId: string;
      depositAmount: number;
      eventTitle: string;
    };
  };
  navigation: any;
}

// Initialize payment service (using mock for now, switch to real when backend ready)
const paymentService = new MockPaymentService();

export default function RSVPPaymentScreen({
  route,
  navigation,
}: RSVPPaymentScreenProps) {
  const { eventId, depositAmount, eventTitle } = route.params;
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const [isLoading, setIsLoading] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const [isLoadingMethods, setIsLoadingMethods] = useState(true);

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      setIsLoadingMethods(true);
      const methods = await paymentService.getPaymentMethods();
      setPaymentMethods(methods);

      // Select default method if available
      const defaultMethod = methods.find(m => m.isDefault);
      if (defaultMethod) {
        setSelectedMethodId(defaultMethod.id);
      }
    } catch (error) {
      console.error('Failed to load payment methods:', error);
    } finally {
      setIsLoadingMethods(false);
    }
  };

  const handleAuthorizeDeposit = async () => {
    if (!selectedMethodId && !cardComplete) {
      Alert.alert(
        'Payment Required',
        'Please add a payment method to continue.',
      );
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Authorize deposit via payment service
      const authResponse = await paymentService.authorizeDeposit({
        amount: depositAmount,
        eventId,
        paymentMethodId: selectedMethodId || undefined,
      });

      // Step 2: Create RSVP with payment method ID
      await dispatch(
        createRSVP({
          eventId,
          paymentMethodId: selectedMethodId || undefined,
        }),
      ).unwrap();

      // Step 3: Navigate to confirmation screen
      navigation.replace('RSVPConfirmation', {
        eventId,
        eventTitle,
        depositAmount,
        authorizationId: authResponse.authorizationId,
      });
    } catch (error: any) {
      console.error('Payment authorization failed:', error);

      // User-friendly error messages
      let errorMessage = 'Please try again.';
      if (error.message?.includes('declined')) {
        errorMessage =
          'Your card was declined. Please try a different payment method.';
      } else if (error.message?.includes('insufficient')) {
        errorMessage =
          'Insufficient funds. Please use a different payment method.';
      } else if (error.message?.includes('network')) {
        errorMessage =
          'Network error. Please check your connection and try again.';
      }

      Alert.alert('Payment Failed', errorMessage, [
        { text: 'OK' },
        { text: 'Try Again', onPress: () => handleAuthorizeDeposit() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatAmount = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  if (isLoadingMethods) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading payment methods...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Event Summary */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.eventTitle}>
            {eventTitle}
          </Text>
          <Divider style={styles.divider} />
          <View style={styles.amountRow}>
            <Text variant="titleMedium">Deposit Amount:</Text>
            <Text variant="titleLarge" style={styles.amount}>
              {formatAmount(depositAmount)}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Authorization Notice */}
      <Card style={styles.noticeCard}>
        <Card.Content>
          <Text variant="bodyMedium" style={styles.noticeText}>
            💳 <Text style={styles.noticeBold}>Authorization Only</Text>
          </Text>
          <Text variant="bodySmall" style={styles.noticeSubtext}>
            We will authorize {formatAmount(depositAmount)} on your card. You
            will only be charged if you do not check in to the event. The
            deposit will be automatically refunded when you check in.
          </Text>
        </Card.Content>
      </Card>

      {/* Existing Payment Methods */}
      {paymentMethods.length > 0 && (
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Payment Methods
          </Text>
          {paymentMethods.map(method => (
            <Card
              key={method.id}
              style={[
                styles.methodCard,
                selectedMethodId === method.id && styles.selectedMethodCard,
              ]}
              onPress={() => setSelectedMethodId(method.id)}
            >
              <Card.Content style={styles.methodContent}>
                <View style={styles.methodInfo}>
                  <Text variant="bodyLarge">
                    {method.card.brand.toUpperCase()} •••• {method.card.last4}
                  </Text>
                  <Text variant="bodySmall" style={styles.methodExpiry}>
                    Expires {method.card.expMonth}/{method.card.expYear}
                  </Text>
                </View>
                {method.isDefault && (
                  <Text style={styles.defaultBadge}>Default</Text>
                )}
              </Card.Content>
            </Card>
          ))}
        </View>
      )}

      {/* Add New Card */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Add New Payment Method
        </Text>
        <Card style={styles.card}>
          <Card.Content>
            <CardField
              postalCodeEnabled={true}
              placeholders={{
                number: '4242 4242 4242 4242',
              }}
              cardStyle={CARD_STYLE}
              style={styles.cardField}
              onCardChange={cardDetails => {
                setCardComplete(cardDetails.complete);
                if (cardDetails.complete) {
                  setSelectedMethodId(null); // Deselect existing methods
                }
              }}
            />
            <Text variant="bodySmall" style={styles.cardHint}>
              💡 Use test card: 4242 4242 4242 4242 (any CVC, future expiry)
            </Text>
          </Card.Content>
        </Card>
      </View>

      {/* Authorization Button */}
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleAuthorizeDeposit}
          loading={isLoading}
          disabled={isLoading || (!selectedMethodId && !cardComplete)}
          style={styles.authorizeButton}
          contentStyle={styles.authorizeButtonContent}
        >
          Authorize {formatAmount(depositAmount)}
        </Button>
        <Button
          mode="text"
          onPress={() => navigation.goBack()}
          disabled={isLoading}
          style={styles.cancelButton}
        >
          Cancel
        </Button>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
  },
  card: {
    margin: 16,
    marginBottom: 8,
  },
  eventTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 12,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  amount: {
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  noticeCard: {
    margin: 16,
    marginTop: 8,
    backgroundColor: '#e3f2fd',
  },
  noticeText: {
    marginBottom: 8,
  },
  noticeBold: {
    fontWeight: 'bold',
    color: '#1976d2',
  },
  noticeSubtext: {
    color: '#555',
    lineHeight: 20,
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    marginLeft: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  methodCard: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  selectedMethodCard: {
    borderColor: '#1976d2',
    borderWidth: 2,
  },
  methodContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  methodInfo: {
    flex: 1,
  },
  methodExpiry: {
    color: '#666',
    marginTop: 4,
  },
  defaultBadge: {
    backgroundColor: '#4caf50',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardField: {
    width: '100%',
    height: 50,
    marginVertical: 8,
  },
  cardHint: {
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  buttonContainer: {
    padding: 16,
    paddingTop: 24,
  },
  authorizeButton: {
    borderRadius: 8,
  },
  authorizeButtonContent: {
    paddingVertical: 8,
  },
  cancelButton: {
    marginTop: 8,
  },
  bottomPadding: {
    height: 24,
  },
});
