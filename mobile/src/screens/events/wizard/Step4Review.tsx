/**
 * Create Event Wizard - Step 4: Review & Publish
 * Implements WYSIWYG preview card with edit button and publish functionality
 * Visual Spec: Screen 4 - 18 acceptance criteria
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { WizardData } from './CreateEventWizard';

interface Props {
  data: WizardData;
  onBack: () => void;
  onPublish: () => Promise<void>;
}

export default function Step4Review({ data, onBack, onPublish }: Props) {
  const theme = useTheme();
  const [publishing, setPublishing] = useState(false);

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await onPublish();
    } finally {
      setPublishing(false);
    }
  };

  const formatDate = (d: Date | null) => {
    if (!d) return 'Not set';
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (t: Date | null) => {
    if (!t) return 'Not set';
    return t.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getDurationLabel = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return `${hours} hour${hours !== 1 ? 's' : ''}`;
    return `${hours}h ${mins}m`;
  };

  const getPaymentMethodsList = () => {
    const methods: string[] = [];
    if (data.paymentMethods.venmo)
      methods.push(`Venmo: ${data.paymentMethods.venmo}`);
    if (data.paymentMethods.paypal)
      methods.push(`PayPal: ${data.paymentMethods.paypal}`);
    if (data.paymentMethods.cashapp)
      methods.push(`CashApp: ${data.paymentMethods.cashapp}`);
    if (data.paymentMethods.zelle)
      methods.push(`Zelle: ${data.paymentMethods.zelle}`);
    if (data.paymentMethods.cash) methods.push('Cash (at event)');
    return methods.length > 0 ? methods : ['None specified'];
  };

  const getPaymentDueByLabel = () => {
    switch (data.paymentDueBy) {
      case 'immediate':
        return 'Immediately after RSVP';
      case '24h_before':
        return '24 hours before event';
      case 'at_event':
        return 'At the event';
      default:
        return 'Not set';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Progress Indicator */}
        <View style={styles.progressSection}>
          <View style={styles.progressDots}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dotLine} />
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dotLine} />
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dotLine} />
            <View style={[styles.dot, styles.dotActive]} />
          </View>
          <Text variant="labelMedium" style={styles.progressText}>
            Step 4 of 4
          </Text>
        </View>

        {/* Section Header */}
        <Text variant="titleLarge" style={styles.sectionHeader}>
          Review & Publish
        </Text>

        {/* Event Preview Card */}
        <Card mode="elevated" style={styles.previewCard} elevation={2}>
          <Card.Content>
            {/* Title */}
            <Text variant="headlineSmall" style={styles.eventTitle}>
              {data.title}
            </Text>

            {/* Sport Badge */}
            <View style={styles.sportBadge}>
              <Icon name="badminton" size={16} color={theme.colors.primary} />
              <Text
                variant="labelMedium"
                style={[styles.sportText, { color: theme.colors.primary }]}
              >
                {data.sportId.toUpperCase()}
              </Text>
            </View>

            {/* Description */}
            <Text variant="bodyMedium" style={styles.description}>
              {data.description}
            </Text>

            {/* Location & Time Section */}
            <View style={styles.section}>
              <View style={styles.infoRow}>
                <Icon name="map-marker" size={20} color="#666" />
                <Text variant="bodyMedium" style={styles.infoText}>
                  {data.location || 'Not set'}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Icon name="calendar" size={20} color="#666" />
                <Text variant="bodyMedium" style={styles.infoText}>
                  {formatDate(data.date)}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Icon name="clock-outline" size={20} color="#666" />
                <Text variant="bodyMedium" style={styles.infoText}>
                  {formatTime(data.time)} • {getDurationLabel(data.duration)}
                </Text>
              </View>
            </View>

            {/* Details Section */}
            <View style={styles.section}>
              <View style={styles.infoRow}>
                <Icon name="account-group" size={20} color="#666" />
                <Text variant="bodyMedium" style={styles.infoText}>
                  {data.capacity
                    ? `${data.capacity} spots`
                    : 'Unlimited capacity'}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Icon name="currency-usd" size={20} color="#666" />
                <Text variant="bodyMedium" style={styles.infoText}>
                  {data.cost ? `$${data.cost} per person` : 'Free event'}
                </Text>
              </View>

              {data.cost && (
                <View style={[styles.infoRow, styles.indented]}>
                  <Text variant="bodySmall" style={styles.paymentDueBy}>
                    Payment due: {getPaymentDueByLabel()}
                  </Text>
                </View>
              )}

              {data.cost && (
                <View style={[styles.infoRow, styles.indented]}>
                  <Text variant="bodySmall" style={styles.subInfo}>
                    {getPaymentMethodsList().join(' • ')}
                  </Text>
                </View>
              )}
            </View>

            {/* Optional Details */}
            {data.cohosts.length > 0 && (
              <View style={styles.section}>
                <View style={styles.infoRow}>
                  <Icon name="account-multiple" size={20} color="#666" />
                  <Text variant="bodyMedium" style={styles.infoText}>
                    Co-hosts: {data.cohosts.join(', ')}
                  </Text>
                </View>
              </View>
            )}

            {data.links.length > 0 && (
              <View style={styles.section}>
                <View style={styles.infoRow}>
                  <Icon name="link" size={20} color="#666" />
                  <Text variant="bodyMedium" style={styles.infoText}>
                    {data.links.length} link{data.links.length !== 1 ? 's' : ''}{' '}
                    attached
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.section}>
              <View style={styles.infoRow}>
                <Icon
                  name={data.guestInvite ? 'check-circle' : 'close-circle'}
                  size={20}
                  color={data.guestInvite ? '#10B981' : '#666'}
                />
                <Text variant="bodyMedium" style={styles.infoText}>
                  Guest invites: {data.guestInvite ? 'Enabled' : 'Disabled'}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Edit Button */}
        <Button
          mode="outlined"
          onPress={onBack}
          icon="pencil"
          style={styles.editButton}
        >
          Edit Event Details
        </Button>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={onBack}
            style={styles.backButton}
            disabled={publishing}
          >
            Back
          </Button>
          <Button
            mode="contained"
            onPress={handlePublish}
            disabled={publishing}
            loading={publishing}
            style={styles.publishButton}
            icon="rocket-launch"
            contentStyle={styles.publishButtonContent}
          >
            {publishing ? 'Publishing...' : 'Publish Event'}
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  progressSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  progressDots: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#9CA3AF',
  },
  dotActive: {
    backgroundColor: '#3B82F6',
  },
  dotLine: {
    width: 24,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 4,
  },
  progressText: {
    color: '#6B7280',
  },
  sectionHeader: {
    marginBottom: 20,
    fontWeight: 'bold',
  },
  previewCard: {
    marginBottom: 16,
  },
  eventTitle: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  sportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 4,
  },
  sportText: {
    fontWeight: '600',
  },
  description: {
    marginBottom: 16,
    color: '#374151',
  },
  section: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  infoText: {
    flex: 1,
    color: '#374151',
  },
  indented: {
    marginLeft: 28,
  },
  paymentDueBy: {
    color: '#6B7280',
    fontStyle: 'italic',
  },
  subInfo: {
    color: '#6B7280',
  },
  editButton: {
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  backButton: {
    flex: 1,
  },
  publishButton: {
    flex: 2,
  },
  publishButtonContent: {
    flexDirection: 'row-reverse',
  },
});
