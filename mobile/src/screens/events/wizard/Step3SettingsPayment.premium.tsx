/**
 * Step 3: Settings & Payment - Premium Athletic Design
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { GradientButton } from '../../../components/controls';
import { CheckboxButton } from '../../../components/buttons';
import { theme } from '../../../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { WizardData } from './CreateEventWizard';
import PaymentModal, { PaymentConfig } from './PaymentModal';

interface Props {
  data: WizardData;
  onNext: (data: Partial<WizardData>) => void;
  onUpdate: (data: Partial<WizardData>) => void;
  onBack: () => void;
}

export default function Step3SettingsPayment({
  data,
  onNext,
  onUpdate,
  onBack,
}: Props) {
  const [capacity, setCapacity] = useState(data.capacity?.toString() || '');
  const [waitlistEnabled, setWaitlistEnabled] = useState(
    data.waitlistEnabled ?? false,
  );
  const [guestCanInvite, setGuestCanInvite] = useState(
    data.guestCanInvite ?? true,
  );
  const [guestCanPlusOne, setGuestCanPlusOne] = useState(
    data.guestCanPlusOne ?? false,
  );
  const [isPaidEvent, setIsPaidEvent] = useState(!!data.paymentConfig);
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig | null>(
    (data.paymentConfig as PaymentConfig) || null,
  );
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Auto-save changes to wizard data
  React.useEffect(() => {
    const capacityValue = capacity.trim() !== '' ? Number(capacity) : null;
    onUpdate({
      capacity: capacityValue,
      waitlistEnabled: hasCapacity ? waitlistEnabled : false,
      guestCanInvite,
      guestCanPlusOne,
      paymentConfig: isPaidEvent ? (paymentConfig as any) : null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    capacity,
    waitlistEnabled,
    guestCanInvite,
    guestCanPlusOne,
    isPaidEvent,
    paymentConfig,
  ]);

  const capacityNum = capacity.trim() !== '' ? Number(capacity) : null;
  const capacityError =
    capacity.trim() !== '' &&
    (isNaN(capacityNum!) || capacityNum! < 2 || capacityNum! > 999)
      ? 'Capacity must be between 2 and 999'
      : null;

  const hasCapacity =
    capacity.trim() !== '' && !capacityError && capacityNum !== null;

  const isValid = !capacityError && (!isPaidEvent || paymentConfig !== null);

  const handleNext = () => {
    if (!isValid) {
      return;
    }
    onNext({
      capacity: capacityNum,
      waitlistEnabled: hasCapacity ? waitlistEnabled : false,
      guestCanInvite,
      guestCanPlusOne,
      paymentConfig: isPaidEvent ? (paymentConfig as any) : null,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        testID="step3-scroll-view"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <Icon name="cog" size={20} color={theme.colors.primary} />
          <Text style={styles.sectionTitle}>EVENT SETTINGS</Text>
        </View>

        <TextInput
          testID="capacity-input"
          label="Capacity"
          value={capacity}
          onChangeText={setCapacity}
          mode="outlined"
          keyboardType="number-pad"
          placeholder="Unlimited"
          placeholderTextColor={theme.colors.textMuted}
          style={styles.input}
          error={!!capacityError}
        />
        {capacityError && <Text style={styles.errorText}>{capacityError}</Text>}

        <View style={styles.toggleRow}>
          {hasCapacity && (
            <CheckboxButton
              label="Waitlist"
              checked={waitlistEnabled}
              onPress={() => setWaitlistEnabled(!waitlistEnabled)}
            />
          )}
          <CheckboxButton
            label="Guest can invite"
            checked={guestCanInvite}
            onPress={() => setGuestCanInvite(!guestCanInvite)}
          />
          <CheckboxButton
            label="Guest can +1"
            checked={guestCanPlusOne}
            onPress={() => setGuestCanPlusOne(!guestCanPlusOne)}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionHeader}>
            <Icon name="credit-card" size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>PAYMENT</Text>
          </View>
          <CheckboxButton
            label="Paid Event"
            checked={isPaidEvent}
            onPress={() => {
              setIsPaidEvent(!isPaidEvent);
              if (!isPaidEvent && !paymentConfig) {
                setShowPaymentModal(true);
              }
            }}
          />
        </View>

        {isPaidEvent && (
          <View style={styles.listContainer}>
            {paymentConfig ? (
              <Pressable
                style={styles.listItem}
                onPress={() => setShowPaymentModal(true)}
              >
                <View style={styles.listIconCircle}>
                  <Icon
                    name="currency-usd"
                    size={20}
                    color={theme.colors.primary}
                  />
                </View>
                <View style={styles.listInfo}>
                  <Text style={styles.listTitle}>
                    {paymentConfig.type === 'required' &&
                      `$${paymentConfig.amount}`}
                    {paymentConfig.type === 'flexible' &&
                      `$${paymentConfig.minAmount}-$${paymentConfig.maxAmount}`}
                    {paymentConfig.type === 'pay-what-you-can' &&
                      'Pay What You Can'}
                  </Text>
                  <Text style={styles.listSubtitle}>
                    {Object.keys(paymentConfig.methods).join(', ')}
                  </Text>
                </View>
                <Pressable
                  onPress={() => setShowPaymentModal(true)}
                  hitSlop={8}
                >
                  <Icon
                    name="pencil"
                    size={18}
                    color={theme.colors.textSecondary}
                  />
                </Pressable>
              </Pressable>
            ) : (
              <Pressable
                style={styles.emptyState}
                onPress={() => setShowPaymentModal(true)}
              >
                <Icon
                  name="plus-circle"
                  size={32}
                  color={theme.colors.primary}
                />
                <Text style={styles.emptyText}>Configure payment settings</Text>
              </Pressable>
            )}
          </View>
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Icon name="arrow-left" size={18} color={theme.colors.text} />
          <Text style={styles.backButtonText}>BACK</Text>
        </Pressable>
        <GradientButton
          testID="step3-review-button"
          onPress={handleNext}
          disabled={!isValid}
          icon="arrow-right"
          style={styles.nextButton}
        >
          REVIEW
        </GradientButton>
      </View>

      <PaymentModal
        visible={showPaymentModal}
        onDismiss={() => setShowPaymentModal(false)}
        onSave={config => {
          setPaymentConfig(config);
          setShowPaymentModal(false);
        }}
        initialConfig={paymentConfig || undefined}
      />
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: theme.colors.background,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',

    marginBottom: 6,
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 24,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.sm,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
    letterSpacing: 0.8,
  },
  listContainer: {
    gap: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  listItemClickable: {
    justifyContent: 'center',
  },
  listIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 107, 53, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cohostAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cohostAvatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  listInfo: {
    flex: 1,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 2,
  },
  listSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  emptyStateInline: {
    padding: 16,
    alignItems: 'center',
  },
  emptyTextSmall: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
  },
  editRemindersText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.primary,
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
  nextButton: {
    flex: 1,
  },
});
