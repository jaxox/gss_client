/**
 * Create Event Wizard - Step 4: Review & Publish
 * Implements WYSIWYG preview card with edit button and publish functionality
 * Visual Spec: Screen 4 - 18 acceptance criteria
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  Alert,
  Platform,
  Share,
} from 'react-native';
import { Text, Button, Card, Divider, Chip } from 'react-native-paper';
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
    } finally {
      setPublishing(false);
    }
  };

  // Format date in short form: Wed, Nov 12, 2025
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

  const getDurationLabel = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return `${hours}h`;
    if (hours === 0) return `${mins}m`;
    return `${hours}h ${mins}m`;
  };

  // Handle address actions
  const handleAddressPress = () => {
    Alert.alert('Location', data.location, [
      {
        text: 'Copy Address',
        onPress: async () => {
          try {
            await Share.share({ message: data.location });
          } catch (error) {
            Alert.alert('Error', 'Could not copy address');
          }
        },
      },
      {
        text: 'Open in Maps',
        onPress: () => {
          const url = Platform.select({
            ios: `maps://app?address=${encodeURIComponent(data.location)}`,
            android: `geo:0,0?q=${encodeURIComponent(data.location)}`,
          });
          if (url) {
            Linking.openURL(url).catch(() =>
              Alert.alert('Error', 'Could not open maps'),
            );
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  // Handle link press
  const handleLinkPress = (url: string) => {
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'Could not open link'),
    );
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
      <ScrollView
        testID="step4-scroll-view"
        contentContainerStyle={styles.scrollContent}
      >
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
        <View style={styles.headerSection}>
          <Text variant="headlineMedium" style={styles.sectionHeader}>
            Review & Publish
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Review your event details before publishing
          </Text>
        </View>

        {/* Event Preview Card - Modern Design */}
        <Card mode="elevated" style={styles.previewCard} elevation={3}>
          {/* Hero Section with Title and Sport */}
          <View style={styles.heroSection}>
            <Chip
              mode="flat"
              icon="badminton"
              style={styles.sportChip}
              textStyle={styles.sportChipText}
            >
              {data.sportId.toUpperCase()}
            </Chip>
            <Text variant="headlineSmall" style={styles.eventTitle}>
              {data.title}
            </Text>
            {data.description && (
              <Text variant="bodyMedium" style={styles.description}>
                {data.description}
              </Text>
            )}
          </View>

          <Divider style={styles.divider} />

          {/* Date & Time Section */}
          <View style={styles.cardSection}>
            <View style={styles.sectionTitleRow}>
              <Icon name="calendar-clock" size={20} color="#3B82F6" />
              <Text variant="titleSmall" style={styles.sectionTitle}>
                When
              </Text>
            </View>
            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <Icon name="calendar" size={18} color="#6B7280" />
                <Text variant="bodyMedium" style={styles.detailText}>
                  {formatDate(data.date)}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Icon name="clock-outline" size={18} color="#6B7280" />
                <Text variant="bodyMedium" style={styles.detailText}>
                  {formatTime(data.time)} ({getDurationLabel(data.duration)})
                </Text>
              </View>
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* Location Section - Clickable */}
          <View style={styles.cardSection}>
            <View style={styles.sectionTitleRow}>
              <Icon name="map-marker" size={20} color="#EF4444" />
              <Text variant="titleSmall" style={styles.sectionTitle}>
                Where
              </Text>
            </View>
            <Pressable
              onPress={handleAddressPress}
              style={styles.locationPressable}
            >
              <Icon name="map-marker-outline" size={18} color="#6B7280" />
              <Text variant="bodyMedium" style={styles.locationText}>
                {data.location || 'Not set'}
              </Text>
              <Icon name="chevron-right" size={18} color="#9CA3AF" />
            </Pressable>
          </View>

          <Divider style={styles.divider} />

          {/* Capacity & Cost Section */}
          <View style={styles.cardSection}>
            <View style={styles.sectionTitleRow}>
              <Icon name="ticket" size={20} color="#10B981" />
              <Text variant="titleSmall" style={styles.sectionTitle}>
                Details
              </Text>
            </View>
            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <Icon name="account-group" size={18} color="#6B7280" />
                <Text variant="bodyMedium" style={styles.detailText}>
                  {data.capacity ? `${data.capacity} spots` : 'Unlimited'}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Icon
                  name={data.cost ? 'currency-usd' : 'tag-outline'}
                  size={18}
                  color="#6B7280"
                />
                <Text variant="bodyMedium" style={styles.detailText}>
                  {data.cost ? `$${data.cost} per person` : 'Free'}
                </Text>
              </View>
            </View>

            {/* Payment Details */}
            {data.cost && (
              <View style={styles.paymentDetails}>
                <Text variant="bodySmall" style={styles.paymentLabel}>
                  💳 Payment: {getPaymentDueByLabel()}
                </Text>
                {getPaymentMethodsList()[0] !== 'None specified' && (
                  <View style={styles.paymentMethods}>
                    {getPaymentMethodsList().map((method, index) => (
                      <Chip
                        key={index}
                        mode="outlined"
                        compact
                        style={styles.paymentChip}
                        textStyle={styles.paymentChipText}
                      >
                        {method}
                      </Chip>
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Hosts Section */}
          <>
            <Divider style={styles.divider} />
            <View style={styles.cardSection}>
              <View style={styles.sectionTitleRow}>
                <Icon name="account-multiple" size={20} color="#8B5CF6" />
                <Text variant="titleSmall" style={styles.sectionTitle}>
                  {data.cohosts.length > 0 ? 'Host & Co-hosts' : 'Host'}
                </Text>
              </View>
              <View style={styles.cohostsList}>
                {/* Main Host - Always shown first */}
                <Chip
                  mode="flat"
                  avatar={
                    <Icon name="account-star" size={24} color="#F59E0B" />
                  }
                  style={styles.hostChip}
                >
                  You (Host)
                </Chip>
                {/* Co-hosts */}
                {data.cohosts.map((cohost, index) => (
                  <Chip
                    key={index}
                    mode="flat"
                    avatar={
                      <Icon name="account-circle" size={24} color="#8B5CF6" />
                    }
                    style={styles.cohostChip}
                  >
                    {cohost}
                  </Chip>
                ))}
              </View>
            </View>
          </>

          {/* Links Section - Clickable */}
          {data.links.length > 0 && (
            <>
              <Divider style={styles.divider} />
              <View style={styles.cardSection}>
                <View style={styles.sectionTitleRow}>
                  <Icon name="link-variant" size={20} color="#F59E0B" />
                  <Text variant="titleSmall" style={styles.sectionTitle}>
                    Links
                  </Text>
                </View>
                <View style={styles.linksList}>
                  {data.links.map((link, index) => (
                    <Pressable
                      key={index}
                      onPress={() => handleLinkPress(link.url)}
                      style={styles.linkItem}
                    >
                      <Icon name={link.icon} size={20} color="#3B82F6" />
                      <Text variant="bodyMedium" style={styles.linkTitle}>
                        {link.title}
                      </Text>
                      <Icon name="open-in-new" size={16} color="#9CA3AF" />
                    </Pressable>
                  ))}
                </View>
              </View>
            </>
          )}

          {/* Guest Invite Section */}
          <Divider style={styles.divider} />
          <View style={[styles.cardSection, styles.lastSection]}>
            <View style={styles.guestInviteRow}>
              <Icon
                name={data.guestInvite ? 'account-plus' : 'account-off'}
                size={20}
                color={data.guestInvite ? '#10B981' : '#6B7280'}
              />
              <Text variant="bodyMedium" style={styles.detailText}>
                Guest invites {data.guestInvite ? 'enabled' : 'disabled'}
              </Text>
            </View>
          </View>
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
            testID="step4-back-button"
            mode="outlined"
            onPress={onBack}
            style={styles.backButton}
            disabled={publishing}
          >
            Back
          </Button>
          <Button
            testID="publish-button"
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
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  progressSection: {
    marginBottom: 20,
    alignItems: 'center',
  },
  progressDots: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D1D5DB',
  },
  dotActive: {
    backgroundColor: '#3B82F6',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dotLine: {
    width: 20,
    height: 2,
    backgroundColor: '#3B82F6',
    marginHorizontal: 4,
  },
  progressText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  headerSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    color: '#6B7280',
  },
  previewCard: {
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
  },
  heroSection: {
    padding: 20,
    backgroundColor: '#F0F9FF',
  },
  sportChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#3B82F6',
    marginBottom: 12,
  },
  sportChipText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 12,
  },
  eventTitle: {
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  description: {
    color: '#4B5563',
    lineHeight: 22,
  },
  divider: {
    backgroundColor: '#E5E7EB',
  },
  cardSection: {
    padding: 20,
  },
  lastSection: {
    paddingBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: '700',
    color: '#111827',
  },
  detailsRow: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
  },
  detailText: {
    color: '#374151',
    flex: 1,
  },
  locationPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  locationText: {
    flex: 1,
    color: '#374151',
    fontWeight: '500',
  },
  paymentDetails: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  paymentLabel: {
    color: '#92400E',
    fontWeight: '600',
    marginBottom: 8,
  },
  paymentMethods: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  paymentChip: {
    backgroundColor: 'white',
    borderColor: '#F59E0B',
  },
  paymentChipText: {
    fontSize: 11,
    color: '#92400E',
  },
  cohostsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hostChip: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  cohostChip: {
    backgroundColor: '#F5F3FF',
  },
  linksList: {
    gap: 8,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  linkTitle: {
    flex: 1,
    color: '#3B82F6',
    fontWeight: '500',
  },
  guestInviteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  editButton: {
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  backButton: {
    flex: 1,
    borderRadius: 8,
  },
  publishButton: {
    flex: 2,
    borderRadius: 8,
    backgroundColor: '#10B981',
  },
  publishButtonContent: {
    flexDirection: 'row-reverse',
    paddingVertical: 6,
  },
});
