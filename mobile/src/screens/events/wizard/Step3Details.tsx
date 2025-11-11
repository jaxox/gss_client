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
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  HelperText,
  RadioButton,
  Checkbox,
  Switch,
  Chip,
  Divider,
} from 'react-native-paper';
import type { WizardData } from './CreateEventWizard';
import AddCohostsModal from './AddCohostsModal';
import AddLinkModal from './AddLinkModal';

interface Props {
  data: WizardData;
  onNext: (data: Partial<WizardData>) => void;
  onBack: () => void;
}

export default function Step3Details({ data, onNext, onBack }: Props) {
  const [capacity, setCapacity] = useState(data.capacity?.toString() || '');
  const [cost, setCost] = useState(data.cost?.toString() || '');
  const [paymentDueBy, setPaymentDueBy] = useState(data.paymentDueBy);
  const [paymentMethods, setPaymentMethods] = useState(data.paymentMethods);
  const [cohosts, setCohosts] = useState<string[]>(data.cohosts);
  const [links, setLinks] = useState<Array<{ icon: string; url: string }>>(
    data.links,
  );
  const [guestInvite, setGuestInvite] = useState(data.guestInvite);
  const [touched, setTouched] = useState({ capacity: false, cost: false });
  const [showCohostsModal, setShowCohostsModal] = useState(false);
  const [showLinksModal, setShowLinksModal] = useState(false);

  // Validation
  const capacityError =
    capacity.trim() !== '' && (isNaN(Number(capacity)) || Number(capacity) < 2)
      ? 'Capacity must be at least 2'
      : null;

  const costError =
    cost.trim() !== '' && (isNaN(Number(cost)) || Number(cost) < 0)
      ? 'Cost must be a positive number'
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
      cohosts,
      links,
      guestInvite,
    });
  };

  const togglePaymentMethod = (method: keyof typeof paymentMethods) => {
    if (method === 'cash') {
      setPaymentMethods(prev => ({ ...prev, cash: !prev.cash }));
    }
  };

  const updatePaymentMethod = (
    method: keyof typeof paymentMethods,
    value: string,
  ) => {
    if (method !== 'cash') {
      setPaymentMethods(prev => ({ ...prev, [method]: value }));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
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
            <View style={styles.dot} />
          </View>
          <Text variant="labelMedium" style={styles.progressText}>
            Step 3 of 4
          </Text>
        </View>

        {/* Section Header */}
        <Text variant="titleLarge" style={styles.sectionHeader}>
          Event Details
        </Text>

        {/* Capacity Input */}
        <TextInput
          label="Capacity (Optional)"
          value={capacity}
          onChangeText={setCapacity}
          onBlur={() => setTouched(prev => ({ ...prev, capacity: true }))}
          mode="outlined"
          keyboardType="number-pad"
          error={touched.capacity && !!capacityError}
          placeholder="Leave blank for unlimited"
          style={styles.input}
        />
        <HelperText type={capacityError ? 'error' : 'info'} visible>
          {capacityError || 'Leave blank for unlimited capacity'}
        </HelperText>

        {/* Cost Input */}
        <TextInput
          label="Cost Per Person (Optional)"
          value={cost}
          onChangeText={setCost}
          onBlur={() => setTouched(prev => ({ ...prev, cost: true }))}
          mode="outlined"
          keyboardType="decimal-pad"
          error={touched.cost && !!costError}
          placeholder="0.00"
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
            <HelperText type="info">
              Add at least one payment method or select Cash
            </HelperText>

            <TextInput
              label="Venmo"
              value={paymentMethods.venmo}
              onChangeText={value => updatePaymentMethod('venmo', value)}
              mode="outlined"
              placeholder="@username"
              style={styles.input}
            />

            <TextInput
              label="PayPal"
              value={paymentMethods.paypal}
              onChangeText={value => updatePaymentMethod('paypal', value)}
              mode="outlined"
              placeholder="email@example.com"
              keyboardType="email-address"
              style={styles.input}
            />

            <TextInput
              label="CashApp"
              value={paymentMethods.cashapp}
              onChangeText={value => updatePaymentMethod('cashapp', value)}
              mode="outlined"
              placeholder="$cashtag"
              style={styles.input}
            />

            <TextInput
              label="Zelle"
              value={paymentMethods.zelle}
              onChangeText={value => updatePaymentMethod('zelle', value)}
              mode="outlined"
              placeholder="email@example.com or phone"
              style={styles.input}
            />

            <View style={styles.checkboxRow}>
              <Checkbox
                status={paymentMethods.cash ? 'checked' : 'unchecked'}
                onPress={() => togglePaymentMethod('cash')}
              />
              <Text onPress={() => togglePaymentMethod('cash')}>
                Cash (pay at event)
              </Text>
            </View>
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
          <View style={styles.chipContainer}>
            {cohosts.map((cohost, index) => (
              <Chip
                key={index}
                onClose={() =>
                  setCohosts(cohosts.filter((_, i) => i !== index))
                }
                style={styles.chip}
              >
                {cohost}
              </Chip>
            ))}
          </View>
        )}

        {/* Add Cohosts Modal */}
        <AddCohostsModal
          visible={showCohostsModal}
          onDismiss={() => setShowCohostsModal(false)}
          onSave={selectedCohosts => {
            setCohosts(selectedCohosts.map(c => c.name));
          }}
          initialSelected={[]}
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
                <Text>
                  {link.icon} {link.url}
                </Text>
                <Button
                  onPress={() => setLinks(links.filter((_, i) => i !== index))}
                  compact
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
            setLinks([...links, { icon: link.iconName, url: link.url }]);
          }}
        />

        <Divider style={styles.divider} />

        {/* Guest Invite Toggle */}
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Guest Invite Permissions
        </Text>
        <View style={styles.switchRow}>
          <View style={styles.switchLabel}>
            <Text variant="labelLarge">Guests can invite others</Text>
            <Text variant="bodySmall" style={styles.helperText}>
              When enabled, attendees can invite their friends to join the
              event.
            </Text>
          </View>
          <Switch value={guestInvite} onValueChange={setGuestInvite} />
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button mode="outlined" onPress={onBack} style={styles.backButton}>
            Back
          </Button>
          <Button
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
  sectionTitle: {
    marginBottom: 12,
    fontWeight: '600',
  },
  input: {
    marginBottom: 4,
  },
  label: {
    marginTop: 8,
    marginBottom: 8,
  },
  marginTop: {
    marginTop: 16,
  },
  divider: {
    marginVertical: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  addButton: {
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  linkContainer: {
    marginTop: 8,
  },
  linkCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginBottom: 8,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchLabel: {
    flex: 1,
    marginRight: 16,
  },
  helperText: {
    color: '#6B7280',
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
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
