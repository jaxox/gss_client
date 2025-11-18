/**
 * Add Reminders Modal - Premium Athletic Design
 * Configure automatic event reminders
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

export interface RemindersConfig {
  rsvpReminder: {
    enabled: boolean;
    daysBefore: number;
  };
  eventReminder: {
    enabled: boolean;
    hoursBefore: number;
  };
}

interface AddRemindersModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSave: (config: RemindersConfig) => void;
  initialConfig?: RemindersConfig;
}

const RSVP_DAYS_OPTIONS = Array.from({ length: 14 }, (_, i) => i + 1);
const EVENT_HOURS_OPTIONS = Array.from({ length: 48 }, (_, i) => i + 1);

export default function AddRemindersModal({
  visible,
  onDismiss,
  onSave,
  initialConfig,
}: AddRemindersModalProps) {
  const [config, setConfig] = useState<RemindersConfig>({
    rsvpReminder: { enabled: false, daysBefore: 7 },
    eventReminder: { enabled: false, hoursBefore: 24 },
  });

  useEffect(() => {
    if (visible && initialConfig) {
      setConfig(initialConfig);
    } else if (visible) {
      setConfig({
        rsvpReminder: { enabled: false, daysBefore: 7 },
        eventReminder: { enabled: false, hoursBefore: 24 },
      });
    }
  }, [visible, initialConfig]);

  const handleSave = () => {
    onSave(config);
    onDismiss();
  };

  const isValid = config.rsvpReminder.enabled || config.eventReminder.enabled;

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
          <Text style={styles.headerTitle}>Reminders</Text>
          <Pressable
            onPress={handleSave}
            disabled={!isValid}
            style={styles.checkButton}
          >
            <Icon
              name="check"
              size={24}
              color={isValid ? '#ff6b35' : 'rgba(255, 255, 255, 0.3)'}
            />
          </Pressable>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.description}>
            Set up automatic reminders to notify guests before the RSVP deadline
            and before the event starts.
          </Text>

          <View style={styles.section}>
            <View style={styles.reminderRow}>
              <View style={styles.reminderInfo}>
                <Text style={styles.reminderLabel}>RSVP REMINDER</Text>
                <Text style={styles.reminderDescription}>
                  Remind guests to RSVP before the deadline
                </Text>
              </View>
              <Pressable
                style={[
                  styles.toggle,
                  config.rsvpReminder.enabled && styles.toggleActive,
                ]}
                onPress={() =>
                  setConfig({
                    ...config,
                    rsvpReminder: {
                      ...config.rsvpReminder,
                      enabled: !config.rsvpReminder.enabled,
                    },
                  })
                }
              >
                {config.rsvpReminder.enabled && (
                  <Icon name="check" size={18} color="#fff" />
                )}
              </Pressable>
            </View>

            {config.rsvpReminder.enabled && (
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Send reminder</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={config.rsvpReminder.daysBefore}
                    onValueChange={value =>
                      setConfig({
                        ...config,
                        rsvpReminder: {
                          ...config.rsvpReminder,
                          daysBefore: value,
                        },
                      })
                    }
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                  >
                    {RSVP_DAYS_OPTIONS.map(days => (
                      <Picker.Item
                        key={days}
                        label={`${days} ${
                          days === 1 ? 'day' : 'days'
                        } before RSVP deadline`}
                        value={days}
                        color={theme.colors.text}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <View style={styles.reminderRow}>
              <View style={styles.reminderInfo}>
                <Text style={styles.reminderLabel}>EVENT REMINDER</Text>
                <Text style={styles.reminderDescription}>
                  Remind guests about the upcoming event
                </Text>
              </View>
              <Pressable
                style={[
                  styles.toggle,
                  config.eventReminder.enabled && styles.toggleActive,
                ]}
                onPress={() =>
                  setConfig({
                    ...config,
                    eventReminder: {
                      ...config.eventReminder,
                      enabled: !config.eventReminder.enabled,
                    },
                  })
                }
              >
                {config.eventReminder.enabled && (
                  <Icon name="check" size={18} color="#fff" />
                )}
              </Pressable>
            </View>

            {config.eventReminder.enabled && (
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Send reminder</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={config.eventReminder.hoursBefore}
                    onValueChange={value =>
                      setConfig({
                        ...config,
                        eventReminder: {
                          ...config.eventReminder,
                          hoursBefore: value,
                        },
                      })
                    }
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                  >
                    {EVENT_HOURS_OPTIONS.map(hours => (
                      <Picker.Item
                        key={hours}
                        label={`${hours} ${
                          hours === 1 ? 'hour' : 'hours'
                        } before event`}
                        value={hours}
                        color={theme.colors.text}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            )}
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
  description: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 24,
    lineHeight: 20,
  },
  section: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 16,
    marginBottom: 16,
  },
  reminderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reminderInfo: {
    flex: 1,
    marginRight: 16,
  },
  reminderLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
    letterSpacing: 0.8,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  reminderDescription: {
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
    marginBottom: 8,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  pickerWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    height: 120,
  },
  picker: {
    height: 100,
    width: '100%',
  },
  pickerItem: {
    color: '#ffffff',
    fontSize: 16,
    height: 120,
  },
});
