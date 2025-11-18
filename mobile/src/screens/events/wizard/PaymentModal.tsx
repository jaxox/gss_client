/**
 * Payment Modal - Premium Athletic Design
 * Configure event payment settings
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
  Modal as RNModal,
} from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { theme } from '../../../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export type PaymentType = 'required' | 'flexible' | 'pay-what-you-can';
export type PaymentDueTiming = '1hr-after-rsvp' | '24hrs-before' | 'at-event';

export interface PaymentMethod {
  venmo?: string;
  paypal?: string;
  cashapp?: string;
  zelle?: string;
}

export interface PaymentConfig {
  type: PaymentType;
  amount?: number;
  minAmount?: number;
  maxAmount?: number;
  dueBy: PaymentDueTiming;
  methods: PaymentMethod;
}

interface PaymentModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSave: (config: PaymentConfig) => void;
  initialConfig?: PaymentConfig;
}

const PAYMENT_TYPES: Array<{
  value: PaymentType;
  label: string;
  description: string;
}> = [
  {
    value: 'required',
    label: 'Required Amount',
    description: 'Set a fixed amount that all guests must pay',
  },
  {
    value: 'flexible',
    label: 'Flexible Range',
    description: 'Allow guests to choose an amount within a range',
  },
  {
    value: 'pay-what-you-can',
    label: 'Pay What You Can',
    description: 'Guests decide what they can afford to pay',
  },
];

const DUE_TIMING_OPTIONS: Array<{ value: PaymentDueTiming; label: string }> = [
  { value: '1hr-after-rsvp', label: '1 hour after RSVP' },
  { value: '24hrs-before', label: '24 hours before event' },
  { value: 'at-event', label: 'At the event' },
];

export default function PaymentModal({
  visible,
  onDismiss,
  onSave,
  initialConfig,
}: PaymentModalProps) {
  const [config, setConfig] = useState<PaymentConfig>({
    type: 'required',
    amount: undefined,
    dueBy: '1hr-after-rsvp',
    methods: {},
  });

  useEffect(() => {
    if (visible && initialConfig) {
      setConfig(initialConfig);
    } else if (visible) {
      setConfig({
        type: 'required',
        amount: undefined,
        dueBy: '1hr-after-rsvp',
        methods: {},
      });
    }
  }, [visible, initialConfig]);

  const updatePaymentMethod = (method: keyof PaymentMethod, value: string) => {
    setConfig({
      ...config,
      methods: { ...config.methods, [method]: value },
    });
  };

  const handleSave = () => {
    onSave(config);
    onDismiss();
  };

  const isValid = () => {
    if (config.type === 'required' && !config.amount) return false;
    if (config.type === 'flexible' && (!config.minAmount || !config.maxAmount))
      return false;
    if (Object.keys(config.methods).length === 0) return false;
    return true;
  };

  if (!visible) return null;

  return (
    <RNModal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onDismiss}
    >
      <SafeAreaView style={styles.container}>
        {/* Custom Header */}
        <View style={styles.header}>
          <Pressable onPress={onDismiss} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#ffffff" />
          </Pressable>
          <Text style={styles.headerTitle}>Payment Settings</Text>
          <Pressable
            onPress={handleSave}
            style={styles.saveButton}
            disabled={!isValid()}
          >
            <Icon
              name="check"
              size={24}
              color={isValid() ? '#ff6b35' : 'rgba(255, 255, 255, 0.3)'}
            />
          </Pressable>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>PAYMENT TYPE</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={config.type}
                onValueChange={value =>
                  setConfig({
                    ...config,
                    type: value,
                    amount: undefined,
                    minAmount: undefined,
                    maxAmount: undefined,
                  })
                }
                style={styles.picker}
                dropdownIconColor={theme.colors.primary}
              >
                {PAYMENT_TYPES.map(type => (
                  <Picker.Item
                    key={type.value}
                    label={type.label}
                    value={type.value}
                    color={theme.colors.text}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {config.type === 'required' && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>AMOUNT</Text>
              <View style={styles.amountInputContainer}>
                <Text style={styles.dollarSign}>$</Text>
                <TextInput
                  mode="flat"
                  placeholder="0.00"
                  value={config.amount?.toString() || ''}
                  onChangeText={text => {
                    if (text === '') {
                      setConfig({ ...config, amount: undefined });
                      return;
                    }
                    const num = parseFloat(text);
                    if (!isNaN(num)) {
                      setConfig({ ...config, amount: Math.min(num, 999) });
                    }
                  }}
                  keyboardType="decimal-pad"
                  style={styles.amountInput}
                  placeholderTextColor={theme.colors.textMuted}
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                />
              </View>
            </View>
          )}

          {config.type === 'flexible' && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>PRICE RANGE</Text>
              <View style={styles.rangeRow}>
                <View style={[styles.amountInputContainer, styles.rangeInput]}>
                  <Text style={styles.dollarSign}>$</Text>
                  <TextInput
                    mode="flat"
                    placeholder="Min"
                    value={config.minAmount?.toString() || ''}
                    onChangeText={text => {
                      if (text === '') {
                        setConfig({ ...config, minAmount: undefined });
                        return;
                      }
                      const num = parseFloat(text);
                      if (!isNaN(num)) {
                        setConfig({ ...config, minAmount: Math.min(num, 999) });
                      }
                    }}
                    keyboardType="decimal-pad"
                    style={styles.amountInput}
                    placeholderTextColor={theme.colors.textMuted}
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                  />
                </View>
                <Text style={styles.rangeSeparator}>—</Text>
                <View style={[styles.amountInputContainer, styles.rangeInput]}>
                  <Text style={styles.dollarSign}>$</Text>
                  <TextInput
                    mode="flat"
                    placeholder="Max"
                    value={config.maxAmount?.toString() || ''}
                    onChangeText={text => {
                      if (text === '') {
                        setConfig({ ...config, maxAmount: undefined });
                        return;
                      }
                      const num = parseFloat(text);
                      if (!isNaN(num)) {
                        setConfig({ ...config, maxAmount: Math.min(num, 999) });
                      }
                    }}
                    keyboardType="decimal-pad"
                    style={styles.amountInput}
                    placeholderTextColor={theme.colors.textMuted}
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                  />
                </View>
              </View>
            </View>
          )}

          {config.type !== 'pay-what-you-can' && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>PAYMENT DUE BY</Text>
              <View style={styles.pickerWrapperTiming}>
                <Picker
                  selectedValue={config.dueBy}
                  onValueChange={value =>
                    setConfig({ ...config, dueBy: value })
                  }
                  style={styles.pickerTiming}
                  dropdownIconColor={theme.colors.primary}
                >
                  {DUE_TIMING_OPTIONS.map(option => (
                    <Picker.Item
                      key={option.value}
                      label={option.label}
                      value={option.value}
                      color={theme.colors.text}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>PAYMENT METHODS</Text>
            <Text style={styles.sectionHint}>
              Enter at least one payment method (username, phone, or email)
            </Text>

            {(['venmo', 'paypal', 'cashapp', 'zelle'] as const).map(method => (
              <TextInput
                key={method}
                label={method.charAt(0).toUpperCase() + method.slice(1)}
                mode="outlined"
                placeholder={`@username or phone`}
                value={config.methods[method] || ''}
                onChangeText={text => {
                  if (text.trim()) {
                    updatePaymentMethod(method, text);
                  } else {
                    const newMethods = { ...config.methods };
                    delete newMethods[method];
                    setConfig({ ...config, methods: newMethods });
                  }
                }}
                style={styles.methodInput}
                placeholderTextColor={theme.colors.textMuted}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    letterSpacing: 0.5,
  },
  saveButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 28,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    letterSpacing: 1,
    marginBottom: 12,
  },
  sectionHint: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginBottom: 12,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingLeft: 16,
    height: 52,
  },
  dollarSign: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: 'transparent',
    height: 52,
  },
  rangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rangeInput: {
    flex: 1,
  },
  rangeSeparator: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
  pickerWrapper: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    height: 100,
    overflow: 'hidden',
  },
  picker: {
    color: theme.colors.text,
    height: 100,
    marginTop: -60,
  },
  pickerWrapperTiming: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    height: 100,
    overflow: 'hidden',
  },
  pickerTiming: {
    color: theme.colors.text,
    height: 100,
    marginTop: -60,
  },
  methodInput: {
    backgroundColor: theme.colors.background,
    marginBottom: 16,
  },
});
