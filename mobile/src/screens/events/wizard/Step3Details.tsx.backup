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
} from 'react-native-paper';
import type { WizardData } from './CreateEventWizard';
import AddCohostsModal from './AddCohostsModal';
import AddLinkModal from './AddLinkModal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CoHostCard, CoHostUser } from '../../../components/cohosts';

interface Props {
  data: WizardData;
  onNext: (data: Partial<WizardData>) => void;
  onBack: () => void;
}

// Type for cohost data
export default function Step3Details({ data, onNext, onBack }: Props) {
  const [capacity, setCapacity] = useState(data.capacity?.toString() || '');
  const [cost, setCost] = useState(data.cost?.toString() || '');
  const [paymentDueBy, setPaymentDueBy] = useState(data.paymentDueBy);
  const [paymentMethods, setPaymentMethods] = useState(data.paymentMethods);
  const [cohosts, setCohosts] = useState<CoHostUser[]>([]);
  const [links, setLinks] = useState<
    Array<{ icon: string; title: string; url: string }>
  >(data.links);
  const [guestInvite, setGuestInvite] = useState(data.guestInvite);
  const [waitlistEnabled, setWaitlistEnabled] = useState(false);
  const [touched, setTouched] = useState({ capacity: false, cost: false });
  const [showCohostsModal, setShowCohostsModal] = useState(false);
  const [showLinksModal, setShowLinksModal] = useState(false);

  // Sync state with data when navigating back to this step
  React.useEffect(() => {
    if (data.capacity !== undefined && data.capacity !== null) {
      setCapacity(data.capacity.toString());
    }
    if (data.cost !== undefined && data.cost !== null) {
      setCost(data.cost.toString());
    }
  }, [data.capacity, data.cost]);

  // Validation
  const capacityError =
    capacity.trim() !== '' &&
    (isNaN(Number(capacity)) || Number(capacity) < 2 || Number(capacity) > 1000)
      ? 'Must be between 2 and 1,000 (excluding co/hosts)'
      : null;

  const costError =
    cost.trim() !== '' &&
    (isNaN(Number(cost)) || Number(cost) < 0 || Number(cost) > 1000)
      ? 'Must be between $0 and $1,000'
      : null;

  const showPaymentSection =
    cost.trim() !== '' && !costError && Number(cost) > 0;

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
        <Text variant="labelLarge" style={styles.sectionHeader}>
          Event Details
        </Text>

        {/* Capacity Input with Waitlist Toggle */}
        <View style={styles.capacityRow}>
          <View style={styles.capacityInputContainer}>
            <TextInput
              testID="capacity-input"
              label="Capacity"
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
          </View>

          {/* Waitlist Toggle - Only show if capacity is set */}
          {capacity.trim() !== '' && !capacityError && (
            <View style={styles.waitlistToggle}>
              <Text variant="labelMedium" style={styles.waitlistLabel}>
                Waitlist
              </Text>
              <Switch
                value={waitlistEnabled}
                onValueChange={setWaitlistEnabled}
              />
            </View>
          )}
        </View>

        <HelperText type="error" visible={touched.capacity && !!capacityError}>
          {capacityError}
        </HelperText>

        {/* Cost Input */}
        <TextInput
          testID="cost-input"
          label="Cost Per Person"
          value={cost}
          onChangeText={setCost}
          onBlur={() => setTouched(prev => ({ ...prev, cost: true }))}
          mode="outlined"
          keyboardType="decimal-pad"
          error={touched.cost && !!costError}
          placeholder="Leave blank for free event"
          dense
          left={<TextInput.Affix text="$" />}
          style={styles.input}
        />
        <HelperText type="error" visible={touched.cost && !!costError}>
          {costError}
        </HelperText>

        {/* Payment Section - Only shows if cost is not empty */}
        {showPaymentSection && (
          <>
            <Divider style={styles.divider} />

            {/* Payment Details Card */}
            <View style={styles.paymentCard}>
              <Text variant="labelLarge" style={styles.sectionTitle}>
                Payment Details
              </Text>

              {/* Payment Due By */}
              <Text variant="labelMedium" style={styles.paymentLabel}>
                Payment Due By *
              </Text>
              <RadioButton.Group
                onValueChange={value =>
                  setPaymentDueBy(value as typeof paymentDueBy)
                }
                value={paymentDueBy}
              >
                <Pressable
                  style={[
                    styles.radioCard,
                    paymentDueBy === '1h_after' && styles.radioCardSelected,
                  ]}
                  onPress={() => setPaymentDueBy('1h_after')}
                >
                  <RadioButton value="1h_after" />
                  <Text style={styles.radioText}>1 hour after RSVP</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.radioCard,
                    paymentDueBy === '24h_before' && styles.radioCardSelected,
                  ]}
                  onPress={() => setPaymentDueBy('24h_before')}
                >
                  <RadioButton value="24h_before" />
                  <Text style={styles.radioText}>24 hours before event</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.radioCard,
                    paymentDueBy === 'at_event' && styles.radioCardSelected,
                  ]}
                  onPress={() => setPaymentDueBy('at_event')}
                >
                  <RadioButton value="at_event" />
                  <Text style={styles.radioText}>At the event</Text>
                </Pressable>
              </RadioButton.Group>

              {/* Payment Methods */}
              <Text variant="labelMedium" style={styles.paymentMethodsLabel}>
                Payment Methods
              </Text>

              <View style={styles.paymentMethodsGrid}>
                <TextInput
                  label="Venmo"
                  value={paymentMethods.venmo}
                  onChangeText={value => updatePaymentMethod('venmo', value)}
                  mode="outlined"
                  placeholder="@username"
                  dense
                  style={styles.paymentInput}
                />

                <TextInput
                  label="PayPal"
                  value={paymentMethods.paypal}
                  onChangeText={value => updatePaymentMethod('paypal', value)}
                  mode="outlined"
                  placeholder="email@example.com"
                  keyboardType="email-address"
                  dense
                  style={styles.paymentInput}
                />

                <TextInput
                  label="CashApp"
                  value={paymentMethods.cashapp}
                  onChangeText={value => updatePaymentMethod('cashapp', value)}
                  mode="outlined"
                  placeholder="$cashtag"
                  dense
                  style={styles.paymentInput}
                />

                <TextInput
                  label="Zelle"
                  value={paymentMethods.zelle}
                  onChangeText={value => updatePaymentMethod('zelle', value)}
                  mode="outlined"
                  placeholder="email@example.com or phone"
                  dense
                  style={styles.paymentInput}
                />
              </View>
            </View>
          </>
        )}

        <Divider style={styles.divider} />

        {/* Cohosts Section */}
        <View style={styles.sectionHeaderRow}>
          <Text variant="labelLarge" style={styles.sectionTitle}>
            Co-hosts
          </Text>
          <Button
            mode="outlined"
            onPress={() => setShowCohostsModal(true)}
            icon="account-multiple-plus"
            compact
            style={styles.inlineButton}
            contentStyle={styles.inlineButtonContent}
          >
            {''}
          </Button>
        </View>
        {cohosts.length > 0 && (
          <View style={styles.cohostContainer}>
            {cohosts.map((cohost, index) => (
              <CoHostCard
                key={cohost.id}
                user={cohost}
                backgroundColor="#F9FAFB"
                onRemove={() =>
                  setCohosts(cohosts.filter((_, i) => i !== index))
                }
                accessibilityLabel={`${cohost.name}, Level ${cohost.level}, ${cohost.xp} XP, ${cohost.reliability} percent reliability, remove button`}
              />
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
        <View style={[styles.sectionHeaderRow, styles.marginTop]}>
          <Text variant="labelLarge" style={styles.sectionTitle}>
            Links
          </Text>
          <Button
            mode="outlined"
            onPress={() => setShowLinksModal(true)}
            icon="link-plus"
            compact
            style={styles.inlineButton}
            contentStyle={styles.inlineButtonContent}
          >
            {''}
          </Button>
        </View>
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
        <Text variant="labelLarge" style={styles.sectionTitle}>
          Guest Invite Permissions
        </Text>
        <View style={styles.switchRow}>
          <Text variant="labelLarge" style={styles.switchLabel}>
            Guests can invite others
          </Text>
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
    fontWeight: '600',
    fontSize: 15,
    color: '#111827',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    marginBottom: 0,
    fontWeight: '500',
    fontSize: 14,
    color: '#374151',
  },
  inlineButton: {
    marginLeft: 1,
  },
  inlineButtonContent: {
    height: 30,
  },
  input: {
    marginBottom: 2,
  },
  capacityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  capacityInputContainer: {
    flex: 2,
  },
  waitlistToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  waitlistLabel: {
    fontSize: 14,
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
  paymentCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 8,
    marginBottom: 4,
  },
  paymentLabel: {
    marginTop: 12,
    marginBottom: 8,
    color: '#374151',
    fontWeight: '500',
  },
  radioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 1,
    marginBottom: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  radioCardSelected: {
    borderColor: '#3B82F6',
    borderWidth: 2,
    backgroundColor: '#EFF6FF',
  },
  radioText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#111827',
  },
  paymentMethodsLabel: {
    marginTop: 16,
    marginBottom: 12,
    color: '#374151',
    fontWeight: '500',
  },
  paymentMethodsGrid: {
    gap: 2,
  },
  paymentInput: {
    marginBottom: 2,
    backgroundColor: '#FFFFFF',
    height: 38,
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
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  switchLabel: {
    fontWeight: '500',
    flex: 1,
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
