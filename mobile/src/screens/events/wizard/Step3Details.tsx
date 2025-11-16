/**
 * Step 3: Event Details - Following Design
 * Capacity, co-hosts, payment settings
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Switch, HelperText } from 'react-native-paper';
import { GradientButton } from '../../../components/controls';
import { theme } from '../../../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { WizardData } from './CreateEventWizard';

interface Props {
  data: WizardData;
  onNext: (data: Partial<WizardData>) => void;
  onBack: () => void;
}

export default function Step3Details({ data, onNext, onBack }: Props) {
  const [capacity, setCapacity] = useState(data.capacity?.toString() || '');
  const [waitlistEnabled, setWaitlistEnabled] = useState(false);
  const [guestCanInvite, setGuestCanInvite] = useState(true);
  const [guestCanPlusOne, setGuestCanPlusOne] = useState(false);
  const [isPaidEvent, setIsPaidEvent] = useState(false);
  const [cost, setCost] = useState('');
  const [touched, setTouched] = useState(false);

  const capacityError =
    touched &&
    capacity.trim() !== '' &&
    (isNaN(Number(capacity)) || Number(capacity) < 1 || Number(capacity) > 1000)
      ? 'Capacity must be between 1 and 1,000'
      : null;

  const isValid = !capacityError;

  const handleNext = () => {
    if (!isValid) {
      setTouched(true);
      return;
    }
    onNext({
      capacity: capacity.trim() !== '' ? Number(capacity) : null,
      waitlistEnabled,
      guestCanInvite,
      guestCanPlusOne,
      cost: isPaidEvent && cost.trim() !== '' ? Number(cost) : null,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        testID="step3-scroll-view"
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Capacity */}
        <View style={styles.inputContainer}>
          <TextInput
            testID="capacity-input"
            value={capacity}
            onChangeText={setCapacity}
            onBlur={() => setTouched(true)}
            mode="outlined"
            label="Capacity"
            keyboardType="number-pad"
            error={!!capacityError}
            placeholder="Unlimited"
            placeholderTextColor="rgba(255,255,255,0.4)"
            style={styles.input}
            outlineColor="rgba(255,255,255,0.15)"
            activeOutlineColor={theme.colors.primary}
            textColor="#ffffff"
            theme={{
              colors: {
                background: 'rgba(255,255,255,0.08)',
                onSurfaceVariant: 'rgba(255,255,255,0.7)',
              },
              roundness: theme.radius.lg,
            }}
          />
          <HelperText
            type="error"
            visible={!!capacityError}
            style={styles.helper}
          >
            {capacityError}
          </HelperText>
        </View>

        {/* Toggle Switches */}
        <View style={styles.togglesRow}>
          <View style={styles.toggleItem}>
            <View style={styles.toggleContent}>
              <Icon
                name="format-list-checks"
                size={18}
                color={theme.colors.primary}
              />
              <Text style={styles.toggleLabel}>Waitlist</Text>
            </View>
            <Switch
              value={waitlistEnabled}
              onValueChange={setWaitlistEnabled}
              color={theme.colors.primary}
            />
          </View>

          <View style={styles.toggleItem}>
            <View style={styles.toggleContent}>
              <Icon
                name="account-plus"
                size={18}
                color={theme.colors.primary}
              />
              <Text style={styles.toggleLabel}>Guest can invite</Text>
            </View>
            <Switch
              value={guestCanInvite}
              onValueChange={setGuestCanInvite}
              color={theme.colors.primary}
            />
          </View>

          <View style={styles.toggleItem}>
            <View style={styles.toggleContent}>
              <Icon
                name="account-multiple-plus"
                size={18}
                color={theme.colors.primary}
              />
              <Text style={styles.toggleLabel}>Guest can +1</Text>
            </View>
            <Switch
              value={guestCanPlusOne}
              onValueChange={setGuestCanPlusOne}
              color={theme.colors.primary}
            />
          </View>
        </View>

        <View style={styles.divider} />

        {/* Payment Section */}
        <View style={styles.paymentHeader}>
          <View style={styles.paymentTitleRow}>
            <Icon name="currency-usd" size={20} color={theme.colors.primary} />
            <Text style={[styles.sectionHeader, styles.sectionHeaderNoMargin]}>
              PAYMENT
            </Text>
          </View>
          <Switch
            value={isPaidEvent}
            onValueChange={setIsPaidEvent}
            color={theme.colors.primary}
          />
        </View>

        {isPaidEvent && (
          <View style={styles.paymentDetails}>
            <View style={styles.inputContainer}>
              <TextInput
                testID="cost-input"
                value={cost}
                onChangeText={setCost}
                mode="outlined"
                label="Cost Per Person"
                keyboardType="decimal-pad"
                placeholder="Enter amount"
                placeholderTextColor="rgba(255,255,255,0.4)"
                style={styles.input}
                outlineColor="rgba(255,255,255,0.15)"
                activeOutlineColor={theme.colors.primary}
                textColor="#ffffff"
                theme={{
                  colors: {
                    background: 'rgba(255,255,255,0.08)',
                    onSurfaceVariant: 'rgba(255,255,255,0.7)',
                  },
                  roundness: theme.radius.lg,
                }}
                left={<TextInput.Affix text="$" textStyle={styles.affixText} />}
              />
            </View>
            <Text style={styles.paymentNote}>
              💳 Payment methods can be configured after publishing
            </Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <GradientButton
            testID="step3-back-button"
            onPress={onBack}
            icon="arrow-left"
            style={styles.backButton}
          >
            BACK
          </GradientButton>
          <GradientButton
            testID="step3-next-button"
            onPress={handleNext}
            disabled={!isValid}
            icon="arrow-right"
            style={styles.nextButton}
          >
            REVIEW
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
    marginBottom: theme.spacing.lg,
    marginTop: theme.spacing.md,
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.fontSizes.xs,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.textSecondary,
    letterSpacing: 1,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.surface,
    fontSize: theme.fontSizes.lg,
  },
  helper: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSizes.xs,
  },
  togglesRow: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  toggleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  toggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  toggleLabel: {
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.xl,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  paymentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  paymentDetails: {
    marginTop: theme.spacing.md,
  },
  paymentNote: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
    marginTop: theme.spacing.sm,
  },
  sectionHeaderNoMargin: {
    marginBottom: 0,
    marginTop: 0,
  },
  affixText: {
    color: '#ffffff',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.xl,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 1,
  },
});
