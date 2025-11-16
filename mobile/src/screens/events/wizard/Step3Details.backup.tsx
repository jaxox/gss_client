/**
 * Create Event Wizard - Step 3: Details (Refactored)
 * Following architectural guidelines with reusable components
 */

import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import {
  Text,
  TextInput,
  HelperText,
  RadioButton,
  Switch,
  Divider,
  Button,
} from 'react-native-paper';
import {
  WizardScreenLayout,
  FormSection,
  FormRow,
  AppButtonPrimary,
  AppButtonSecondary,
} from '../../../components';
import { WizardData } from '../../../types/event';
import { theme } from '../../../theme';
import AddCohostsModal from './AddCohostsModal';
import AddLinkModal from './AddLinkModal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CoHostCard, CoHostUser } from '../../../components/cohosts';

interface Props {
  data: WizardData;
  onNext: (data: Partial<WizardData>) => void;
  onBack: () => void;
}

export default function Step3Details({ data, onNext, onBack }: Props) {
  // Form state
  const [capacity, setCapacity] = useState(data.capacity?.toString() || '');
  const [cost, setCost] = useState(data.cost?.toString() || '');
  const [paymentDueBy, setPaymentDueBy] = useState(data.paymentDueBy);
  const [paymentMethods, setPaymentMethods] = useState(data.paymentMethods);
  const [cohosts, setCohosts] = useState<CoHostUser[]>([]);
  const [links, setLinks] = useState(data.links);
  const [guestInvite, setGuestInvite] = useState(data.guestInvite);
  const [waitlistEnabled, setWaitlistEnabled] = useState(false);
  const [touched, setTouched] = useState({ capacity: false, cost: false });
  const [showCohostsModal, setShowCohostsModal] = useState(false);
  const [showLinksModal, setShowLinksModal] = useState(false);

  // Sync with data when navigating back
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
      cohosts: cohosts.map(c => c.name),
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

  const renderBottomButtons = () => (
    <FormRow>
      <AppButtonSecondary
        onPress={onBack}
        style={styles.backButton}
        testID="step3-back-button"
      >
        Back
      </AppButtonSecondary>
      <AppButtonPrimary
        onPress={handleNext}
        disabled={!isValid}
        icon="arrow-right"
        style={styles.nextButton}
        contentStyle={styles.nextButtonContent}
        testID="step3-next-button"
      >
        Next
      </AppButtonPrimary>
    </FormRow>
  );

  return (
    <WizardScreenLayout
      currentStep={3}
      totalSteps={4}
      renderBottomButtons={renderBottomButtons}
    >
      {/* Event Settings Section */}
      <FormSection title="Event Settings">
        {/* Capacity with inline Waitlist toggle */}
        <FormRow justify="flex-start">
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
            />
          </View>
          {capacity.trim() !== '' && !capacityError && (
            <FormRow gap={theme.spacing.sm} style={styles.waitlistToggle}>
              <Text variant="labelMedium">Waitlist</Text>
              <Switch
                value={waitlistEnabled}
                onValueChange={setWaitlistEnabled}
              />
            </FormRow>
          )}
        </FormRow>
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
          style={styles.marginTop}
        />
        <HelperText type="error" visible={touched.cost && !!costError}>
          {costError}
        </HelperText>
      </FormSection>

      {/* Payment Section */}
      {showPaymentSection && (
        <>
          <Divider style={styles.divider} />
          <FormSection title="Payment Details">
            <View style={styles.paymentCard}>
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
          </FormSection>
        </>
      )}

      <Divider style={styles.divider} />

      {/* Co-hosts Section */}
      <FormSection>
        <FormRow>
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
        </FormRow>
        {cohosts.length > 0 && (
          <View style={styles.cohostContainer}>
            {cohosts.map((cohost, index) => (
              <CoHostCard
                key={cohost.id}
                user={cohost}
                backgroundColor={theme.colors.surface}
                onRemove={() =>
                  setCohosts(cohosts.filter((_, i) => i !== index))
                }
                accessibilityLabel={`${cohost.name}, Level ${cohost.level}, ${cohost.xp} XP, ${cohost.reliability} percent reliability, remove button`}
              />
            ))}
          </View>
        )}
      </FormSection>

      <AddCohostsModal
        visible={showCohostsModal}
        onDismiss={() => setShowCohostsModal(false)}
        onSave={selectedCohosts => setCohosts(selectedCohosts)}
        initialSelected={cohosts}
      />

      {/* Links Section */}
      <FormSection>
        <FormRow>
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
        </FormRow>
        {links.length > 0 && (
          <View style={styles.linkContainer}>
            {links.map((link, index) => (
              <View key={index} style={styles.linkCard}>
                <View style={styles.linkInfo}>
                  <Icon
                    name={link.icon}
                    size={24}
                    color={theme.colors.primary}
                  />
                  <Text variant="bodyMedium" style={styles.linkTitle}>
                    {link.title}
                  </Text>
                </View>
                <Button
                  mode="outlined"
                  compact
                  onPress={() => setLinks(links.filter((_, i) => i !== index))}
                  textColor={theme.colors.error}
                >
                  Remove
                </Button>
              </View>
            ))}
          </View>
        )}
      </FormSection>

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
      <FormSection title="Guest Invite Permissions">
        <FormRow>
          <Text variant="labelLarge" style={styles.switchLabel}>
            Guests can invite others
          </Text>
          <Switch value={guestInvite} onValueChange={setGuestInvite} />
        </FormRow>
      </FormSection>
    </WizardScreenLayout>
  );
}

const styles = StyleSheet.create({
  capacityInputContainer: {
    flex: 2,
  },
  waitlistToggle: {
    flex: 1,
  },
  marginTop: {
    marginTop: theme.spacing.sm,
  },
  divider: {
    marginVertical: theme.spacing.md,
  },
  paymentCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  paymentLabel: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    color: theme.colors.neutral700,
    fontWeight: theme.fontWeights.medium,
  },
  radioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 1,
    marginBottom: 4,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  radioCardSelected: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
    backgroundColor: theme.colors.primaryLight,
  },
  radioText: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text,
  },
  paymentMethodsLabel: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    color: theme.colors.neutral700,
    fontWeight: theme.fontWeights.medium,
  },
  paymentMethodsGrid: {
    gap: 2,
  },
  paymentInput: {
    marginBottom: 2,
    backgroundColor: theme.colors.background,
    height: 38,
  },
  sectionTitle: {
    marginBottom: 0,
    fontWeight: theme.fontWeights.medium,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.neutral700,
  },
  inlineButton: {
    marginLeft: 1,
  },
  inlineButtonContent: {
    height: 30,
  },
  cohostContainer: {
    marginTop: theme.spacing.sm,
  },
  linkContainer: {
    marginTop: theme.spacing.sm,
  },
  linkCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.sm + 2,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
  },
  linkInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: theme.spacing.md,
  },
  linkTitle: {
    flex: 1,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
  },
  switchLabel: {
    fontWeight: theme.fontWeights.medium,
    flex: 1,
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
