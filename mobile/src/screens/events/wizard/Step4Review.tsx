/**
 * Step 4: Review & Publish - Premium Athletic Design
 */
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { GradientButton } from '../../../components/controls';
import { theme } from '../../../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.reviewCard}>
          {/* Event Title */}
          <View style={styles.reviewSection}>
            <Text style={styles.reviewLabel}>EVENT TITLE</Text>
            <Text style={styles.reviewValue}>{data.title}</Text>
          </View>

          <View style={styles.divider} />

          {/* Description */}
          <View style={styles.reviewSection}>
            <Text style={styles.reviewLabel}>DESCRIPTION</Text>
            <Text style={styles.reviewValue}>{data.description}</Text>
          </View>

          <View style={styles.divider} />

          {/* Sport */}
          <View style={styles.reviewSection}>
            <Text style={styles.reviewLabel}>SPORT</Text>
            <Text style={styles.reviewValue}>
              🏀 {data.sportId.charAt(0).toUpperCase() + data.sportId.slice(1)}
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Location */}
          <View style={styles.reviewSection}>
            <Text style={styles.reviewLabel}>LOCATION</Text>
            <Text style={styles.reviewValue}>{data.location}</Text>
          </View>

          <View style={styles.divider} />

          {/* Date & Time */}
          <View style={styles.reviewSection}>
            <Text style={styles.reviewLabel}>DATE & TIME</Text>
            <Text style={styles.reviewValue}>
              {formatDate(data.date)}
              {'\n'}
              {formatTime(data.time)} - {formatTime(data.endTime || null)} (
              {formatDuration(data.duration)})
            </Text>
          </View>

          {/* Capacity & Settings */}
          {(data.capacity ||
            data.waitlistEnabled !== undefined ||
            data.guestCanInvite !== undefined ||
            data.guestCanPlusOne !== undefined) && (
            <>
              <View style={styles.divider} />
              <View style={styles.reviewSection}>
                <Text style={styles.reviewLabel}>CAPACITY & SETTINGS</Text>
                <Text style={styles.reviewValue}>
                  {data.capacity
                    ? `${data.capacity} participants`
                    : 'Unlimited'}
                </Text>
                <Text style={styles.reviewSubValue}>
                  • Waitlist {data.waitlistEnabled ? 'enabled' : 'disabled'}
                  {'\n'}• Guests {data.guestCanInvite ? 'can' : 'cannot'} invite
                  others{'\n'}• Guest +1{' '}
                  {data.guestCanPlusOne ? 'enabled' : 'disabled'}
                </Text>
              </View>
            </>
          )}

          {/* Payment */}
          {data.paymentConfig && (
            <>
              <View style={styles.divider} />
              <View style={styles.reviewSection}>
                <Text style={styles.reviewLabel}>PAYMENT</Text>
                <Text style={styles.reviewValue}>
                  {data.paymentConfig.type === 'required' &&
                    `$${data.paymentConfig.amount}`}
                  {data.paymentConfig.type === 'flexible' &&
                    `Flexible Range: $${data.paymentConfig.minAmount} - $${data.paymentConfig.maxAmount}`}
                  {data.paymentConfig.type === 'pay-what-you-can' &&
                    'Pay What You Can'}
                </Text>
                <Text style={styles.reviewSubValue}>
                  Due:{' '}
                  {data.paymentConfig.dueBy === '1hour' && '1 hour after RSVP'}
                  {data.paymentConfig.dueBy === '24hours' &&
                    '24 hours before event'}
                  {data.paymentConfig.dueBy === 'at-event' && 'At the event'}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.reviewSection}>
                <Text style={styles.reviewLabel}>PAYMENT METHODS</Text>
                {Object.entries(data.paymentConfig.methods).map(
                  ([method, value]) =>
                    value && (
                      <Text key={method} style={styles.reviewValue}>
                        {method.charAt(0).toUpperCase() + method.slice(1)}:{' '}
                        {value}
                      </Text>
                    ),
                )}
              </View>
            </>
          )}

          {/* Co-hosts */}
          {data.cohosts && data.cohosts.length > 0 && (
            <>
              <View style={styles.divider} />
              <View style={styles.reviewSection}>
                <Text style={styles.reviewLabel}>CO-HOSTS</Text>
                {data.cohosts.map((cohost, index) => (
                  <Text key={cohost.id} style={styles.reviewValue}>
                    {cohost.name} (Level {cohost.level}, {cohost.reliability}%
                    Reliable)
                    {index < data.cohosts!.length - 1 && '\n'}
                  </Text>
                ))}
              </View>
            </>
          )}

          {/* Links */}
          {data.links && data.links.length > 0 && (
            <>
              <View style={styles.divider} />
              <View style={styles.reviewSection}>
                <Text style={styles.reviewLabel}>LINKS</Text>
                {data.links.map((link, index) => (
                  <View key={index} style={styles.linkItem}>
                    <Text style={styles.reviewValue}>
                      {link.icon} {link.title}
                    </Text>
                    <Text style={styles.linkUrl}>{link.url}</Text>
                    {index < data.links!.length - 1 && (
                      <View style={styles.linkSpacer} />
                    )}
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Questionnaire */}
          {data.questions && data.questions.length > 0 && (
            <>
              <View style={styles.divider} />
              <View style={styles.reviewSection}>
                <Text style={styles.reviewLabel}>QUESTIONNAIRE</Text>
                <Text style={styles.reviewValue}>
                  {data.questions.length} custom{' '}
                  {data.questions.length === 1 ? 'question' : 'questions'}
                </Text>
                <Text style={styles.reviewSubValue}>
                  {data.questions.map(q => `• ${q.question}`).join('\n')}
                </Text>
              </View>
            </>
          )}

          {/* Reminders */}
          {data.reminders && (
            <>
              <View style={styles.divider} />
              <View style={styles.reviewSection}>
                <Text style={styles.reviewLabel}>REMINDERS</Text>
                {data.reminders.rsvpReminder.enabled && (
                  <Text style={styles.reviewValue}>
                    RSVP Reminder: {data.reminders.rsvpReminder.daysBefore}{' '}
                    {data.reminders.rsvpReminder.daysBefore === 1
                      ? 'day'
                      : 'days'}{' '}
                    before deadline
                  </Text>
                )}
                {data.reminders.eventReminder.enabled && (
                  <Text style={styles.reviewValue}>
                    Event Reminder: {data.reminders.eventReminder.hoursBefore}{' '}
                    {data.reminders.eventReminder.hoursBefore === 1
                      ? 'hour'
                      : 'hours'}{' '}
                    before event
                  </Text>
                )}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Pressable
          testID="step4-back-button"
          style={styles.backButton}
          onPress={onBack}
          disabled={publishing}
        >
          <Icon name="arrow-left" size={18} color={theme.colors.text} />
          <Text style={styles.backButtonText}>BACK</Text>
        </Pressable>
        <GradientButton
          testID="step4-publish-button"
          onPress={handlePublish}
          icon="check-circle"
          disabled={publishing}
          loading={publishing}
          style={styles.publishButton}
        >
          {publishing ? 'PUBLISHING...' : 'PUBLISH'}
        </GradientButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  reviewCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  reviewSection: {
    marginVertical: 0,
  },
  reviewLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 107, 53, 0.8)',
    letterSpacing: 1,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  reviewValue: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: 4,
  },
  reviewSubValue: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 16,
  },
  linkItem: {
    marginBottom: 8,
  },
  linkUrl: {
    fontSize: 12,
    color: 'rgba(255, 107, 53, 0.8)',
    marginTop: 2,
  },
  linkSpacer: {
    height: 12,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  backButton: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surfaceElevated,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
    letterSpacing: 1,
  },
  publishButton: {
    flex: 1,
  },
});
