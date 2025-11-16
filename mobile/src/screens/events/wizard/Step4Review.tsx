/**
 * Step 4: Review & Publish - Following Design
 */
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { GradientButton } from '../../../components/controls';
import { theme } from '../../../theme';
import type { WizardData } from './CreateEventWizard';

interface Props {
  data: WizardData;
  onBack: () => void;
  onPublish: () => Promise<void>;
}

export default function Step4Review({ data, onBack, onPublish }: Props) {
  const [publishing, setPublishing] = useState(false);

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await onPublish();
    } catch (error) {
      Alert.alert('Error', 'Failed to publish event');
    } finally {
      setPublishing(false);
    }
  };

  const formatDate = (d: Date | null) => {
    if (!d) return 'Not set';
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
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

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    if (hours === 0) return `${mins} minutes`;
    return `${hours}h ${mins}m`;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        testID="step4-scroll-view"
        contentContainerStyle={styles.scrollContent}
      >
        {/* Review Card */}
        <View style={styles.reviewCard}>
          {/* Event Title */}
          <View style={styles.reviewSection}>
            <Text style={styles.reviewLabel}>Event Title</Text>
            <Text style={styles.reviewValue}>{data.title}</Text>
          </View>

          <View style={styles.divider} />

          {/* Description */}
          <View style={styles.reviewSection}>
            <Text style={styles.reviewLabel}>Description</Text>
            <Text style={styles.reviewValue}>{data.description}</Text>
          </View>

          <View style={styles.divider} />

          {/* Sport */}
          <View style={styles.reviewSection}>
            <Text style={styles.reviewLabel}>Sport</Text>
            <Text style={styles.reviewValue}>
              🏀 {data.sportId.toUpperCase()}
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Location */}
          <View style={styles.reviewSection}>
            <Text style={styles.reviewLabel}>Location</Text>
            <Text style={styles.reviewValue}>{data.location}</Text>
          </View>

          <View style={styles.divider} />

          {/* Date & Time */}
          <View style={styles.reviewSection}>
            <Text style={styles.reviewLabel}>Date & Time</Text>
            <Text style={styles.reviewValue}>
              {formatDate(data.date)}
              {'\n'}
              {formatTime(data.time)} - {formatTime(data.endTime || null)} (
              {formatDuration(data.duration)})
            </Text>
          </View>

          {/* Show Capacity & Settings if any */}
          {(data.capacity ||
            data.waitlistEnabled !== undefined ||
            data.guestCanInvite !== undefined ||
            data.guestCanPlusOne !== undefined ||
            data.cost) && (
            <>
              <View style={styles.divider} />
              <View style={styles.reviewSection}>
                <Text style={styles.reviewLabel}>Capacity & Settings</Text>
                {data.capacity ? (
                  <Text style={styles.reviewValue}>
                    {data.capacity} participants{'\n'}
                  </Text>
                ) : (
                  <Text style={styles.reviewValue}>Unlimited{'\n'}</Text>
                )}
                <Text style={styles.reviewSubValue}>
                  • Waitlist {data.waitlistEnabled ? 'enabled' : 'disabled'}
                  {'\n'}• Guests {data.guestCanInvite ? 'can' : 'cannot'} invite
                  others{'\n'}• Guest +1{' '}
                  {data.guestCanPlusOne ? 'enabled' : 'disabled'}
                </Text>
              </View>
            </>
          )}

          {/* Show Payment if set */}
          {data.cost && (
            <>
              <View style={styles.divider} />
              <View style={styles.reviewSection}>
                <Text style={styles.reviewLabel}>Payment</Text>
                <Text style={styles.reviewValue}>
                  ${data.cost} per person{'\n'}
                </Text>
                <Text style={styles.reviewSubValue}>
                  Due 1hr after RSVP • Venmo, PayPal
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <GradientButton
            testID="step4-back-button"
            onPress={onBack}
            icon="arrow-left"
            style={styles.backButton}
            disabled={publishing}
          >
            BACK
          </GradientButton>
          <GradientButton
            testID="step4-publish-button"
            onPress={handlePublish}
            icon="check-circle"
            style={styles.publishButton}
            disabled={publishing}
          >
            {publishing ? 'PUBLISHING...' : 'PUBLISH'}
          </GradientButton>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: 32,
  },
  sectionHeader: {
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.textSecondary,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.xl,
  },
  reviewCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  reviewSection: {
    marginVertical: theme.spacing.sm,
  },
  reviewLabel: {
    fontSize: 12,
    fontWeight: theme.fontWeights.bold,
    color: 'rgba(255, 107, 53, 0.8)',
    letterSpacing: 1,
    marginBottom: theme.spacing.xs,
    textTransform: 'uppercase',
  },
  reviewValue: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: theme.fontWeights.semibold,
    lineHeight: 22,
  },
  reviewSubValue: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.xl,
  },
  backButton: {
    flex: 1,
  },
  publishButton: {
    flex: 2,
  },
});
