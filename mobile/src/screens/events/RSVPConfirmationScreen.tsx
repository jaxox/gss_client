/**
 * RSVPConfirmationScreen - RSVP Success Confirmation
 * Displays confirmation message and next steps after successful RSVP
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card, Divider, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface RSVPConfirmationScreenProps {
  route: {
    params: {
      eventId: string;
      eventTitle: string;
      depositAmount?: number;
      authorizationId?: string;
    };
  };
  navigation: any;
}

export default function RSVPConfirmationScreen({
  route,
  navigation,
}: RSVPConfirmationScreenProps) {
  const { eventId, eventTitle, depositAmount, authorizationId } = route.params;
  const theme = useTheme();
  const isFree = !depositAmount || depositAmount === 0;

  const formatAmount = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Success Icon */}
      <View style={styles.iconContainer}>
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: theme.colors.primaryContainer },
          ]}
        >
          <Icon name="check-circle" size={80} color={theme.colors.primary} />
        </View>
      </View>

      {/* Success Message */}
      <View style={styles.messageContainer}>
        <Text variant="headlineMedium" style={styles.title}>
          You're Registered! 🎉
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Your RSVP for <Text style={styles.eventName}>{eventTitle}</Text> has
          been confirmed.
        </Text>
      </View>

      {/* Event Details Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            What's Next?
          </Text>
          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <Icon name="qrcode" size={24} color={theme.colors.primary} />
            <View style={styles.infoText}>
              <Text variant="bodyMedium" style={styles.infoTitle}>
                Check-In Required
              </Text>
              <Text variant="bodySmall" style={styles.infoSubtext}>
                Use the QR code on event day to check in. You will receive it 1
                hour before the event.
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="bell-outline" size={24} color={theme.colors.primary} />
            <View style={styles.infoText}>
              <Text variant="bodyMedium" style={styles.infoTitle}>
                Reminders Set
              </Text>
              <Text variant="bodySmall" style={styles.infoSubtext}>
                You will receive notifications 24 hours and 1 hour before the
                event.
              </Text>
            </View>
          </View>

          {!isFree && depositAmount && (
            <View style={styles.infoRow}>
              <Icon
                name="credit-card-check"
                size={24}
                color={theme.colors.primary}
              />
              <View style={styles.infoText}>
                <Text variant="bodyMedium" style={styles.infoTitle}>
                  Deposit Authorized
                </Text>
                <Text variant="bodySmall" style={styles.infoSubtext}>
                  {formatAmount(depositAmount)} authorized. Refunded
                  automatically when you check in. You will only be charged if
                  you do not check in.
                </Text>
              </View>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Deposit Info Card */}
      {!isFree && depositAmount && (
        <Card style={[styles.card, styles.depositCard]}>
          <Card.Content>
            <View style={styles.depositHeader}>
              <Icon name="information" size={24} color="#1976d2" />
              <Text variant="titleSmall" style={styles.depositTitle}>
                About Your Deposit
              </Text>
            </View>
            <Text variant="bodySmall" style={styles.depositText}>
              • Authorization: {formatAmount(depositAmount)} has been authorized
              on your card
            </Text>
            <Text variant="bodySmall" style={styles.depositText}>
              • No Charge Yet: Your card will NOT be charged unless you fail to
              check in
            </Text>
            <Text variant="bodySmall" style={styles.depositText}>
              • Automatic Refund: The authorization is released when you check
              in successfully
            </Text>
            <Text variant="bodySmall" style={styles.depositText}>
              • Authorization ID: {authorizationId?.substring(0, 12)}...
            </Text>
          </Card.Content>
        </Card>
      )}

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('MyRSVPs')}
          style={styles.primaryButton}
          contentStyle={styles.buttonContent}
          icon="calendar-check"
        >
          View My RSVPs
        </Button>

        <Button
          mode="outlined"
          onPress={() => navigation.navigate('EventDetail', { eventId })}
          style={styles.secondaryButton}
          contentStyle={styles.buttonContent}
        >
          View Event Details
        </Button>

        <Button
          mode="text"
          onPress={() => navigation.navigate('Events')}
          style={styles.textButton}
        >
          Browse More Events
        </Button>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContainer: {
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
  },
  eventName: {
    fontWeight: 'bold',
    color: '#1976d2',
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  infoSubtext: {
    color: '#666',
    lineHeight: 18,
  },
  depositCard: {
    backgroundColor: '#e3f2fd',
  },
  depositHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  depositTitle: {
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#1976d2',
  },
  depositText: {
    color: '#555',
    marginBottom: 8,
    lineHeight: 18,
  },
  buttonContainer: {
    padding: 16,
    paddingTop: 8,
  },
  primaryButton: {
    borderRadius: 8,
    marginBottom: 12,
  },
  secondaryButton: {
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  textButton: {
    marginTop: 4,
  },
  bottomPadding: {
    height: 24,
  },
});
