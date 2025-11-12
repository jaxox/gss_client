/**
 * Create Event Wizard - Step 3: Details
 * Implements capacity, cost, payment methods, cohosts, links, guest invite toggle
 * Visual Spec: Screen 3 - 25 acceptance criteria
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  HelperText,
  RadioButton,
  Switch,
  Divider,
  Avatar,
} from 'react-native-paper';
import type { WizardData } from './CreateEventWizard';
import AddCohostsModal from './AddCohostsModal';
import AddLinkModal from './AddLinkModal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  data: WizardData;
  onNext: (data: Partial<WizardData>) => void;
  onBack: () => void;
}

// Type for cohost data
type CohostUser = {
  id: string;
  name: string;
  level: number;
  xp: number;
  reliability: number;
  eventsHosted: number;
  sports: string[];
  type: 'friend';
};

export default function Step3Details({ data, onNext, onBack }: Props) {
  const [capacity, setCapacity] = useState(data.capacity?.toString() || '');
  const [cost, setCost] = useState(data.cost?.toString() || '');
  const [paymentDueBy, setPaymentDueBy] = useState(data.paymentDueBy);
  const [paymentMethods, setPaymentMethods] = useState(data.paymentMethods);
  const [cohosts, setCohosts] = useState<CohostUser[]>([]);
  const [links, setLinks] = useState<
    Array<{ icon: string; title: string; url: string }>
  >(data.links);
  const [guestInvite, setGuestInvite] = useState(data.guestInvite);
  const [waitlistEnabled, setWaitlistEnabled] = useState(false);
  const [touched, setTouched] = useState({ capacity: false, cost: false });
  const [showCohostsModal, setShowCohostsModal] = useState(false);
  const [showLinksModal, setShowLinksModal] = useState(false);

  // Helper function for reliability color
  const getReliabilityColor = (reliability: number) => {
    if (reliability >= 85) return '#10B981';
    if (reliability >= 70) return '#F59E0B';
    return '#EF4444';
  };

  // Validation
  const capacityError =
    capacity.trim() !== '' &&
    (isNaN(Number(capacity)) ||
      Number(capacity) < 2 ||
      Number(capacity) > 10000)
      ? 'Capacity must be between 2 and 10,000 (excluding host/cohosts)'
      : null;

  const costError =
    cost.trim() !== '' &&
    (isNaN(Number(cost)) || Number(cost) < 0 || Number(cost) > 10000)
      ? 'Cost must be between $0 and $10,000'
      : null;

  const showPaymentSection = cost.trim() !== '';

  const isValid = !capacityError && !costError;

  const handleNext = () => {
    if (!isValid) {
      setTouched({ capacity: true, cost: true });
      return;
    }
    onNext({
      capacity: capacity.trim() !== '' ? Number(capacity) : null,
      cost: cost.trim() !== '' ? Number(cost) : null,
      paymentDueBy,
      paymentMethods,
      cohosts: cohosts.map(c => c.name), // Convert back to names for data storage
      links,
      guestInvite,
    });
  };

  const updatePaymentMethod = (
    method: keyof typeof paymentMethods,
    value: string,
  ) => {
    setPaymentMethods(prev => ({ ...prev, [method]: value }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        testID="step3-scroll-view"
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Progress Indicator */}
        <View style={styles.progressSection}>
          <View style={styles.progressInline}>
            <Text variant="labelSmall" style={styles.progressText}>
              Step 3 of 4
            </Text>
            <View style={styles.progressDots}>
              <View style={[styles.dot, styles.dotActive]} />
              <View style={styles.dotLine} />
              <View style={[styles.dot, styles.dotActive]} />
              <View style={styles.dotLine} />
              <View style={[styles.dot, styles.dotActive]} />
              <View style={styles.dotLine} />
              <View style={styles.dot} />
            </View>
          </View>
        </View>

        {/* Section Header */}
        <Text variant="titleMedium" style={styles.sectionHeader}>
          Event Details
        </Text>

        {/* Capacity Input */}
        <TextInput
          testID="capacity-input"
          label="Capacity (Optional)"
          value={capacity}
          onChangeText={setCapacity}
          onBlur={() => setTouched(prev => ({ ...prev, capacity: true }))}
          mode="outlined"
          keyboardType="number-pad"
          error={touched.capacity && !!capacityError}
          placeholder="Leave blank for unlimited"
          dense
          style={styles.input}
        />
        <HelperText type={capacityError ? 'error' : 'info'} visible>
          {capacityError || 'Leave blank for unlimited.'}
        </HelperText>

        {/* Waitlist Toggle - Only show if capacity is set */}
        {capacity.trim() !== '' && !capacityError && (
          <View style={styles.switchRow}>
            <View style={styles.switchLabelContainer}>
              <Text variant="bodyLarge" style={styles.switchLabel}>
                Enable Waitlist
              </Text>
              <Text variant="bodySmall" style={styles.switchHelper}>
                Allow users to join a waitlist when the event is full.
              </Text>
            </View>
            <Switch
              value={waitlistEnabled}
              onValueChange={setWaitlistEnabled}
            />
          </View>
        )}

        {/* Cost Input */}
        <TextInput
          testID="cost-input"
          label="Cost Per Person (Optional)"
          value={cost}
          onChangeText={setCost}
          onBlur={() => setTouched(prev => ({ ...prev, cost: true }))}
          mode="outlined"
          keyboardType="decimal-pad"
          error={touched.cost && !!costError}
          placeholder="0.00"
          dense
          left={<TextInput.Affix text="$" />}
          style={styles.input}
        />
        <HelperText type={costError ? 'error' : 'info'} visible>
          {costError || 'Leave blank for free event'}
        </HelperText>

        {/* Payment Section - Only shows if cost is not empty */}
        {showPaymentSection && (
          <>
            <Divider style={styles.divider} />
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Payment Details
            </Text>

            {/* Payment Due By */}
            <Text variant="labelLarge" style={styles.label}>
              Payment Due By *
            </Text>
            <RadioButton.Group
              onValueChange={value =>
                setPaymentDueBy(value as typeof paymentDueBy)
              }
              value={paymentDueBy}
            >
              <View style={styles.radioOption}>
                <RadioButton value="immediate" />
                <Text onPress={() => setPaymentDueBy('immediate')}>
                  Immediately after RSVP
                </Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton value="24h_before" />
                <Text onPress={() => setPaymentDueBy('24h_before')}>
                  24 hours before event
                </Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton value="at_event" />
                <Text onPress={() => setPaymentDueBy('at_event')}>
                  At the event
                </Text>
              </View>
            </RadioButton.Group>

            {/* Payment Methods */}
            <Text variant="labelLarge" style={[styles.label, styles.marginTop]}>
              Payment Methods (Optional)
            </Text>

            <TextInput
              label="Venmo"
              value={paymentMethods.venmo}
              onChangeText={value => updatePaymentMethod('venmo', value)}
              mode="outlined"
              placeholder="@username"
              dense
              style={styles.input}
            />

            <TextInput
              label="PayPal"
              value={paymentMethods.paypal}
              onChangeText={value => updatePaymentMethod('paypal', value)}
              mode="outlined"
              placeholder="email@example.com"
              keyboardType="email-address"
              dense
              style={styles.input}
            />

            <TextInput
              label="CashApp"
              value={paymentMethods.cashapp}
              onChangeText={value => updatePaymentMethod('cashapp', value)}
              mode="outlined"
              placeholder="$cashtag"
              dense
              style={styles.input}
            />

            <TextInput
              label="Zelle"
              value={paymentMethods.zelle}
              onChangeText={value => updatePaymentMethod('zelle', value)}
              mode="outlined"
              placeholder="email@example.com or phone"
              dense
              style={styles.input}
            />
          </>
        )}

        <Divider style={styles.divider} />

        {/* Cohosts Section */}
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Co-hosts (Optional)
        </Text>
        <Button
          mode="outlined"
          onPress={() => setShowCohostsModal(true)}
          icon="account-multiple-plus"
          style={styles.addButton}
        >
          Add Co-hosts
        </Button>
        {cohosts.length > 0 && (
          <View style={styles.cohostContainer}>
            {cohosts.map((cohost, index) => (
              <Pressable
                key={cohost.id}
                style={styles.cohostCard}
                onPress={() =>
                  setCohosts(cohosts.filter((_, i) => i !== index))
                }
                accessibilityRole="button"
                accessibilityLabel={`${cohost.name}, Level ${cohost.level}, ${cohost.xp} XP, ${cohost.reliability} percent reliability, remove button`}
              >
                <Avatar.Text
                  size={48}
                  label={cohost.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                  style={styles.avatar}
                  labelStyle={styles.avatarLabel}
                />

                <View style={styles.userInfo}>
                  <Text variant="bodyLarge" style={styles.userName}>
                    {cohost.name}
                  </Text>

                  <View style={styles.statsRow}>
                    <View style={styles.levelBadge}>
                      <Text variant="labelSmall" style={styles.levelText}>
                        Level {cohost.level}
                      </Text>
                    </View>
                    <Text variant="bodySmall" style={styles.xpText}>
                      •
                    </Text>
                    <Text variant="bodySmall" style={styles.xpText}>
                      {cohost.xp.toLocaleString()} XP
                    </Text>
                  </View>

                  <Text
                    variant="bodySmall"
                    style={[
                      styles.reliabilityText,
                      { color: getReliabilityColor(cohost.reliability) },
                    ]}
                  >
                    {cohost.reliability}% Reliability
                  </Text>
                </View>

                <Button
                  mode="outlined"
                  compact
                  onPress={() =>
                    setCohosts(cohosts.filter((_, i) => i !== index))
                  }
                  textColor="#EF4444"
                  style={styles.removeButton}
                >
                  Remove
                </Button>
              </Pressable>
            ))}
          </View>
        )}

        {/* Add Cohosts Modal */}
        <AddCohostsModal
          visible={showCohostsModal}
          onDismiss={() => setShowCohostsModal(false)}
          onSave={selectedCohosts => {
            setCohosts(selectedCohosts);
          }}
          initialSelected={cohosts}
        />

        {/* Links Section */}
        <Text
          variant="titleMedium"
          style={[styles.sectionTitle, styles.marginTop]}
        >
          Links (Optional)
        </Text>
        <Button
          mode="outlined"
          onPress={() => setShowLinksModal(true)}
          icon="link-plus"
          style={styles.addButton}
        >
          Add Link
        </Button>
        {links.length > 0 && (
          <View style={styles.linkContainer}>
            {links.map((link, index) => (
              <View key={index} style={styles.linkCard}>
                <View style={styles.linkInfo}>
                  <Icon name={link.icon} size={24} color="#3B82F6" />
                  <Text variant="bodyMedium" style={styles.linkTitle}>
                    {link.title}
                  </Text>
                </View>
                <Button
                  mode="outlined"
                  compact
                  onPress={() => setLinks(links.filter((_, i) => i !== index))}
                  textColor="#EF4444"
                  style={styles.removeButton}
                >
                  Remove
                </Button>
              </View>
            ))}
          </View>
        )}

        {/* Add Link Modal */}
        <AddLinkModal
          visible={showLinksModal}
          onDismiss={() => setShowLinksModal(false)}
          onSave={link => {
            setLinks([
              ...links,
              { icon: link.iconName, title: link.title, url: link.url },
            ]);
          }}
        />

        <Divider style={styles.divider} />

        {/* Guest Invite Toggle */}
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Guest Invite Permissions
        </Text>
        <View style={styles.switchRow}>
          <View style={styles.switchLabelContainer}>
            <Text variant="labelLarge" style={styles.switchLabel}>
              Guests can invite others
            </Text>
            <Text variant="bodySmall" style={styles.switchHelper}>
              When enabled, attendees can invite their friends to join the
              event.
            </Text>
          </View>
          <Switch value={guestInvite} onValueChange={setGuestInvite} />
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            testID="step3-back-button"
            mode="outlined"
            onPress={onBack}
            style={styles.backButton}
          >
            Back
          </Button>
          <Button
            testID="step3-next-button"
            mode="contained"
            onPress={handleNext}
            disabled={!isValid}
            style={styles.nextButton}
            icon="arrow-right"
            contentStyle={styles.nextButtonContent}
          >
            Next
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  progressInline: {
    flexDirection: 'row', // make dots + text inline
    alignItems: 'center', // vertically centered
    justifyContent: 'center', // horizontally centered
    gap: 16, // spacing between dots and text (RN 0.71+)
  },
  progressDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9CA3AF',
  },
  dotActive: {
    backgroundColor: '#3B82F6',
  },
  dotLine: {
    width: 16,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 3,
  },
  progressText: {
    color: '#6B7280',
    fontSize: 12,
  },
  sectionHeader: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  sectionTitle: {
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    marginBottom: 2,
  },
  label: {
    marginTop: 6,
    marginBottom: 6,
  },
  marginTop: {
    marginTop: 12,
  },
  divider: {
    marginVertical: 12,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  addButton: {
    marginBottom: 8,
  },
  cohostContainer: {
    marginTop: 6,
  },
  cohostCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    minHeight: 64,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatar: {
    backgroundColor: '#3B82F6',
  },
  avatarLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  userName: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
    color: '#111827',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  levelBadge: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  levelText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 11,
  },
  xpText: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '500',
  },
  reliabilityText: {
    fontSize: 13,
    fontWeight: '600',
  },
  linkContainer: {
    marginTop: 6,
  },
  linkCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: '#F9FAFB',
  },
  linkInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  linkTitle: {
    flex: 1,
    fontWeight: '600',
    color: '#111827',
  },
  removeButton: {
    borderColor: '#EF4444',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  switchLabelContainer: {
    flex: 1,
    marginRight: 16,
  },
  switchLabel: {
    fontWeight: '500',
  },
  switchHelper: {
    color: '#6B7280',
    marginTop: 2,
    fontSize: 13,
  },
  helperText: {
    color: '#6B7280',
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
  nextButtonContent: {
    flexDirection: 'row-reverse',
  },
});
