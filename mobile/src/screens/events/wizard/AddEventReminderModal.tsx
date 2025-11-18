/**
 * Add Event Reminder Modal - Premium Athletic Design
 * Configure automatic event start reminders
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
import { Text } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { theme } from '../../../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export interface EventReminderConfig {
  enabled: boolean;
  hoursBefore: number;
}

interface AddEventReminderModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSave: (config: EventReminderConfig) => void;
  initialConfig?: EventReminderConfig;
}

const PICKER_OPTIONS = Array.from({ length: 9 }, (_, i) => i + 1);

export default function AddEventReminderModal({
  visible,
  onDismiss,
  onSave,
  initialConfig,
}: AddEventReminderModalProps) {
  const [config, setConfig] = useState<EventReminderConfig>({
    enabled: true,
    hoursBefore: 24,
  });
  const [unit, setUnit] = useState<'hours' | 'days'>('days');
  const [value, setValue] = useState(1);

  useEffect(() => {
    if (visible && initialConfig) {
      setConfig(initialConfig);
      // Convert hoursBefore to appropriate unit
      const hours = initialConfig.hoursBefore;
      if (hours % 24 === 0 && hours <= 216) {
        setUnit('days');
        setValue(hours / 24);
      } else {
        setUnit('hours');
        setValue(Math.min(hours, 9));
      }
    } else if (visible) {
      setConfig({ enabled: true, hoursBefore: 24 });
      setUnit('days');
      setValue(1);
    }
  }, [visible, initialConfig]);

  useEffect(() => {
    // Update hoursBefore when value or unit changes
    const hours = unit === 'days' ? value * 24 : value;
    setConfig(prev => ({ ...prev, hoursBefore: hours }));
  }, [value, unit]);

  const handleSave = () => {
    onSave(config);
    onDismiss();
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
          <Text style={styles.headerTitle}>Event Reminder</Text>
          <Pressable onPress={handleSave} style={styles.checkButton}>
            <Icon name="check" size={24} color="#ff6b35" />
          </Pressable>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Icon name="clock-alert" size={32} color="#ff6b35" />
            </View>
          </View>

          <Text style={styles.description}>
            Remind guests about the upcoming event. This notification will be
            sent automatically to all attending guests before the event starts.
          </Text>

          <View style={styles.section}>
            <View style={styles.toggleRow}>
              <View style={styles.toggleInfo}>
                <Text style={styles.toggleLabel}>Enable Event Reminder</Text>
                <Text style={styles.toggleDescription}>
                  Send automatic reminder notification
                </Text>
              </View>
              <Pressable
                style={[styles.toggle, config.enabled && styles.toggleActive]}
                onPress={() =>
                  setConfig({ ...config, enabled: !config.enabled })
                }
              >
                {config.enabled && <Icon name="check" size={18} color="#fff" />}
              </Pressable>
            </View>

            {config.enabled && (
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Send reminder</Text>

                {/* Unit Toggle (Hour/Day) */}
                <View style={styles.unitToggleContainer}>
                  <Pressable
                    style={[
                      styles.unitButton,
                      styles.unitButtonLeft,
                      unit === 'hours' && styles.unitButtonActive,
                    ]}
                    onPress={() => setUnit('hours')}
                  >
                    <Text
                      style={[
                        styles.unitButtonText,
                        unit === 'hours' && styles.unitButtonTextActive,
                      ]}
                    >
                      Hour
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.unitButton,
                      styles.unitButtonRight,
                      unit === 'days' && styles.unitButtonActive,
                    ]}
                    onPress={() => setUnit('days')}
                  >
                    <Text
                      style={[
                        styles.unitButtonText,
                        unit === 'days' && styles.unitButtonTextActive,
                      ]}
                    >
                      Day
                    </Text>
                  </Pressable>
                </View>

                {/* Value Picker */}
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={value}
                    onValueChange={setValue}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                  >
                    {PICKER_OPTIONS.map(num => (
                      <Picker.Item
                        key={num}
                        label={`${num} ${
                          unit === 'days'
                            ? num === 1
                              ? 'day'
                              : 'days'
                            : num === 1
                              ? 'hour'
                              : 'hours'
                        } before event`}
                        value={num}
                        color={theme.colors.text}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            )}
          </View>

          <View style={styles.infoBox}>
            <Icon
              name="information"
              size={18}
              color="rgba(255, 255, 255, 0.5)"
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>
              Only guests who RSVPed "Yes" will receive this reminder.
            </Text>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
  checkButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 107, 53, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 53, 0.3)',
  },
  description: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 24,
    lineHeight: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 16,
    marginBottom: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  toggleInfo: {
    flex: 1,
    marginRight: 16,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  toggle: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: 'rgba(255, 107, 53, 0.15)',
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  pickerContainer: {
    marginTop: 12,
  },
  pickerLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    marginBottom: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  unitToggleContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  unitButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitButtonLeft: {
    borderRightWidth: 0.5,
    borderRightColor: 'rgba(255, 255, 255, 0.15)',
  },
  unitButtonRight: {
    borderLeftWidth: 0.5,
    borderLeftColor: 'rgba(255, 255, 255, 0.15)',
  },
  unitButtonActive: {
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
  },
  unitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  unitButtonTextActive: {
    color: '#ff6b35',
  },
  pickerWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    height: 180,
  },
  picker: {
    height: 180,
    width: '100%',
  },
  pickerItem: {
    color: '#ffffff',
    fontSize: 16,
    height: 180,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 18,
  },
});
