/**
 * Step 2: Event Details & Social - Premium Athletic Design
 * Includes: Co-hosts, Links, Questionnaire, Reminders
 * Dark theme with orange gradient accents
 */
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { GradientButton } from '../../../components/controls';
import { FABButton } from '../../../components/buttons';
import { theme } from '../../../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CoHostCard from '../../../components/cohosts/CoHostCard';
import AddCohostsModal from './AddCohostsModal';
import AddLinkModal from './AddLinkModal';
import AddRSVPReminderModal from './AddRSVPReminderModal';
import AddEventReminderModal from './AddEventReminderModal';
import AddQuestionnaireModal from './AddQuestionnaireModal';
import type { WizardData } from './CreateEventWizard';

interface Props {
  data: WizardData;
  onNext: (data: Partial<WizardData>) => void;
  onUpdate: (data: Partial<WizardData>) => void;
  onBack: () => void;
}

export default function Step2Social({ data, onNext, onUpdate, onBack }: Props) {
  const [cohosts, setCohosts] = useState<WizardData['cohosts']>(
    data.cohosts || [],
  );
  const [links, setLinks] = useState<WizardData['links']>(data.links || []);
  const [questions, setQuestions] = useState<WizardData['questions']>(
    data.questions || [],
  );
  const [reminders, setReminders] = useState<WizardData['reminders']>(
    data.reminders || null,
  );

  const [showCohostsModal, setShowCohostsModal] = useState(false);
  const [showLinksModal, setShowLinksModal] = useState(false);
  const [showQuestionnaireModal, setShowQuestionnaireModal] = useState(false);
  const [showRSVPReminderModal, setShowRSVPReminderModal] = useState(false);
  const [showEventReminderModal, setShowEventReminderModal] = useState(false);

  // Track editing state
  const [editingLinkIndex, setEditingLinkIndex] = useState<number | null>(null);
  const [editingLink, setEditingLink] = useState<{
    icon: string;
    iconName: string;
    title: string;
    url: string;
  } | null>(null);

  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null,
  );
  const [editingQuestion, setEditingQuestion] = useState<{
    id: string;
    type: 'short-answer' | 'multiple-choice' | 'email';
    question: string;
    required: boolean;
    options?: string[];
  } | null>(null);

  const isMountedRef = useRef(false);

  // Sync state with incoming data only when specific fields actually change
  useEffect(() => {
    setCohosts(data.cohosts || []);
  }, [data.cohosts]);

  useEffect(() => {
    setLinks(data.links || []);
  }, [data.links]);

  useEffect(() => {
    setQuestions(data.questions || []);
  }, [data.questions]);

  useEffect(() => {
    setReminders(data.reminders || null);
  }, [data.reminders]);

  // Track initial mount
  useEffect(() => {
    isMountedRef.current = true;
  }, []);

  // Auto-save changes to wizard data whenever local state changes
  useEffect(() => {
    // Skip on initial mount to avoid overwriting with empty initial state
    if (!isMountedRef.current) return;

    onUpdate({ cohosts, links, questions, reminders });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cohosts, links, questions, reminders]);

  const handleNext = () => {
    onNext({ cohosts, links, questions, reminders });
  };

  const handleRemoveCohost = (id: string) => {
    setCohosts((cohosts || []).filter(c => c.id !== id));
  };

  const handleRemoveLink = (index: number) => {
    setLinks((links || []).filter((_, i) => i !== index));
  };

  const handleEditLink = (index: number) => {
    if (links && links[index]) {
      setEditingLinkIndex(index);
      setEditingLink(links[index]);
      setShowLinksModal(true);
    }
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions((questions || []).filter(q => q.id !== id));
  };

  const handleEditQuestion = (questionId: string) => {
    const question = (questions || []).find(q => q.id === questionId);
    if (question) {
      setEditingQuestionId(questionId);
      setEditingQuestion(question);
      setShowQuestionnaireModal(true);
    }
  };

  const handleAddQuestion = () => {
    setEditingQuestionId(null);
    setEditingQuestion(null);
    setShowQuestionnaireModal(true);
  };

  const handleSaveQuestion = (question: {
    id: string;
    type: 'short-answer' | 'multiple-choice' | 'email';
    question: string;
    required: boolean;
    options?: string[];
  }) => {
    if (editingQuestionId) {
      // Edit existing question
      setQuestions(
        (questions || []).map(q => (q.id === editingQuestionId ? question : q)),
      );
    } else {
      // Add new question
      setQuestions([...(questions || []), question]);
    }
  };

  const handleToggleRSVPReminder = () => {
    if (!reminders || !reminders.rsvpReminder.enabled) {
      // Enable with default
      setReminders({
        ...reminders,
        rsvpReminder: { enabled: true, daysBefore: 7 },
        eventReminder: reminders?.eventReminder || {
          enabled: false,
          hoursBefore: 24,
        },
      });
    } else {
      // Disable
      setReminders({
        ...reminders,
        rsvpReminder: { ...reminders.rsvpReminder, enabled: false },
      });
    }
  };

  const handleToggleEventReminder = () => {
    if (!reminders || !reminders.eventReminder.enabled) {
      // Enable with default
      setReminders({
        ...reminders,
        rsvpReminder: reminders?.rsvpReminder || {
          enabled: false,
          daysBefore: 7,
        },
        eventReminder: { enabled: true, hoursBefore: 24 },
      });
    } else {
      // Disable
      setReminders({
        ...reminders,
        eventReminder: { ...reminders.eventReminder, enabled: false },
      });
    }
  };

  const handleCustomizeRSVPReminder = () => {
    setShowRSVPReminderModal(true);
  };

  const handleCustomizeEventReminder = () => {
    setShowEventReminderModal(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        testID="step2-scroll-view"
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Co-hosts Section */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionHeader}>
            <Icon
              name="account-multiple"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.sectionTitle}>CO-HOSTS</Text>
          </View>
          <FABButton onPress={() => setShowCohostsModal(true)} />
        </View>

        {cohosts && cohosts.length > 0 && (
          <View style={styles.itemList}>
            {cohosts.map(cohost => (
              <CoHostCard
                key={cohost.id}
                user={cohost}
                onRemove={() => handleRemoveCohost(cohost.id)}
                style={styles.cohostCard}
              />
            ))}
          </View>
        )}

        <View style={styles.sectionDivider} />

        {/* Links Section */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionHeader}>
            <Icon name="link-variant" size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>LINKS</Text>
          </View>
          <FABButton
            onPress={() => setShowLinksModal(true)}
            disabled={(links?.length || 0) >= 5}
          />
        </View>

        {links && links.length > 0 && (
          <View style={styles.itemList}>
            {links.map((link, idx) => (
              <Pressable
                key={idx}
                style={({ pressed }) => [
                  styles.listItem,
                  pressed && styles.listItemPressed,
                ]}
                onPress={() => handleEditLink(idx)}
              >
                <View style={styles.linkIconCircle}>
                  <Icon
                    name={link.iconName}
                    size={20}
                    color={theme.colors.primary}
                  />
                </View>
                <View style={styles.listItemInfo}>
                  <Text style={styles.listItemTitle}>{link.title}</Text>
                  <Text style={styles.listItemSubtitle} numberOfLines={1}>
                    {link.url}
                  </Text>
                </View>
                <View
                  onStartShouldSetResponder={() => true}
                  onTouchEnd={e => e.stopPropagation()}
                >
                  <FABButton
                    onPress={() => handleRemoveLink(idx)}
                    size="small"
                    variant="remove"
                    icon="close"
                  />
                </View>
              </Pressable>
            ))}
          </View>
        )}

        <View style={styles.sectionDivider} />

        {/* Questionnaire Section */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionHeader}>
            <Icon
              name="clipboard-text"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.sectionTitle}>QUESTIONNAIRE</Text>
          </View>
          <FABButton onPress={handleAddQuestion} />
        </View>

        {questions && questions.length > 0 && (
          <View style={styles.itemList}>
            {questions.map(q => {
              // Map question type to icon
              const getQuestionIcon = () => {
                switch (q.type) {
                  case 'short-answer':
                    return 'text-short';
                  case 'multiple-choice':
                    return 'format-list-bulleted-square';
                  case 'email':
                    return 'email-outline';
                  default:
                    return 'help-circle';
                }
              };

              return (
                <Pressable
                  key={q.id}
                  style={({ pressed }) => [
                    styles.listItem,
                    pressed && styles.listItemPressed,
                  ]}
                  onPress={() => handleEditQuestion(q.id)}
                >
                  <View style={styles.linkIconCircle}>
                    <Icon
                      name={getQuestionIcon()}
                      size={20}
                      color={theme.colors.primary}
                    />
                  </View>
                  <View style={styles.listItemInfo}>
                    <Text style={styles.listItemTitle} numberOfLines={1}>
                      {q.question}
                    </Text>
                    <Text style={styles.listItemSubtitle}>
                      {q.type
                        .split('-')
                        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(' ')}{' '}
                      • {q.required ? 'Required' : 'Optional'}
                    </Text>
                  </View>
                  <View
                    onStartShouldSetResponder={() => true}
                    onTouchEnd={e => e.stopPropagation()}
                  >
                    <FABButton
                      onPress={() => handleRemoveQuestion(q.id)}
                      size="small"
                      variant="remove"
                      icon="close"
                    />
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

        <View style={styles.sectionDivider} />

        {/* Reminders Section */}
        <View style={styles.sectionHeader}>
          <Icon name="bell" size={20} color={theme.colors.primary} />
          <Text style={styles.sectionTitle}>REMINDERS</Text>
        </View>

        {/* RSVP Reminder Toggle Card */}
        <Pressable
          style={[
            styles.reminderToggleCard,
            reminders?.rsvpReminder?.enabled && styles.reminderToggleCardActive,
          ]}
          onPress={handleCustomizeRSVPReminder}
        >
          <View style={styles.reminderToggleInfo}>
            <Text style={styles.reminderToggleTitle}>RSVP Reminder</Text>
            <Text style={styles.reminderToggleSubtitle}>
              {reminders?.rsvpReminder?.daysBefore || 7} days before deadline
            </Text>
          </View>
          <View
            onStartShouldSetResponder={() => true}
            onTouchEnd={e => {
              e.stopPropagation();
              handleToggleRSVPReminder();
            }}
          >
            <View
              style={[
                styles.reminderToggleSwitch,
                reminders?.rsvpReminder?.enabled &&
                  styles.reminderToggleSwitchActive,
              ]}
            >
              {reminders?.rsvpReminder?.enabled && (
                <Icon name="check" size={16} color="#ff6b35" />
              )}
            </View>
          </View>
        </Pressable>

        {/* Event Reminder Toggle Card */}
        <Pressable
          style={[
            styles.reminderToggleCard,
            reminders?.eventReminder?.enabled &&
              styles.reminderToggleCardActive,
          ]}
          onPress={handleCustomizeEventReminder}
        >
          <View style={styles.reminderToggleInfo}>
            <Text style={styles.reminderToggleTitle}>Event Reminder</Text>
            <Text style={styles.reminderToggleSubtitle}>
              {reminders?.eventReminder?.hoursBefore || 24} hours before event
            </Text>
          </View>
          <View
            onStartShouldSetResponder={() => true}
            onTouchEnd={e => {
              e.stopPropagation();
              handleToggleEventReminder();
            }}
          >
            <View
              style={[
                styles.reminderToggleSwitch,
                reminders?.eventReminder?.enabled &&
                  styles.reminderToggleSwitchActive,
              ]}
            >
              {reminders?.eventReminder?.enabled && (
                <Icon name="check" size={16} color="#ff6b35" />
              )}
            </View>
          </View>
        </Pressable>

        <Text style={styles.reminderHint}>Tap card to customize timing</Text>

        {/* Navigation Buttons */}
        <View style={styles.buttonRow}>
          <GradientButton
            testID="step2-back-button"
            onPress={onBack}
            icon="arrow-left"
            style={styles.button}
          >
            BACK
          </GradientButton>
          <GradientButton
            testID="step2-next-button"
            onPress={handleNext}
            icon="arrow-right"
            style={styles.button}
          >
            NEXT
          </GradientButton>
        </View>
      </ScrollView>

      {/* Modals */}
      <AddCohostsModal
        visible={showCohostsModal}
        onDismiss={() => setShowCohostsModal(false)}
        onSave={newCohosts => {
          setCohosts(newCohosts);
          setShowCohostsModal(false);
        }}
        initialSelected={cohosts || []}
      />
      <AddLinkModal
        visible={showLinksModal}
        onDismiss={() => {
          setShowLinksModal(false);
          setEditingLinkIndex(null);
          setEditingLink(null);
        }}
        onSave={newLink => {
          if (editingLinkIndex !== null) {
            // Update existing link
            const updatedLinks = [...(links || [])];
            updatedLinks[editingLinkIndex] = newLink;
            setLinks(updatedLinks);
          } else {
            // Add new link
            setLinks([...(links || []), newLink]);
          }
          setShowLinksModal(false);
          setEditingLinkIndex(null);
          setEditingLink(null);
        }}
        initialLink={editingLink || undefined}
      />
      <AddQuestionnaireModal
        visible={showQuestionnaireModal}
        onDismiss={() => {
          setShowQuestionnaireModal(false);
          setEditingQuestionId(null);
          setEditingQuestion(null);
        }}
        onSave={question => {
          handleSaveQuestion(question);
          setShowQuestionnaireModal(false);
          setEditingQuestionId(null);
          setEditingQuestion(null);
        }}
        initialQuestion={editingQuestion || undefined}
      />
      <AddRSVPReminderModal
        visible={showRSVPReminderModal}
        onDismiss={() => setShowRSVPReminderModal(false)}
        onSave={rsvpConfig => {
          setReminders({
            ...reminders,
            rsvpReminder: rsvpConfig,
            eventReminder: reminders?.eventReminder || {
              enabled: false,
              hoursBefore: 24,
            },
          });
          setShowRSVPReminderModal(false);
        }}
        initialConfig={reminders?.rsvpReminder}
      />
      <AddEventReminderModal
        visible={showEventReminderModal}
        onDismiss={() => setShowEventReminderModal(false)}
        onSave={eventConfig => {
          setReminders({
            ...reminders,
            rsvpReminder: reminders?.rsvpReminder || {
              enabled: false,
              daysBefore: 7,
            },
            eventReminder: eventConfig,
          });
          setShowEventReminderModal(false);
        }}
        initialConfig={reminders?.eventReminder}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingRight: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 1,
  },
  itemList: {
    gap: 4,
    marginBottom: 4,
  },
  cohostCard: {
    marginHorizontal: 0,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
  },
  listItemPressed: {
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    borderColor: 'rgba(255, 107, 53, 0.2)',
    transform: [{ scale: 0.98 }],
  },
  chevron: {
    marginLeft: 'auto',
    marginRight: -4,
  },
  linkIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 107, 53, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItemInfo: {
    flex: 1,
    minWidth: 0,
  },
  listItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  listItemSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },

  sectionDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 16,
  },
  reminderToggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  reminderToggleCardActive: {
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    borderColor: 'rgba(255, 107, 53, 0.3)',
  },
  reminderToggleInfo: {
    flex: 1,
  },
  reminderToggleTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  reminderToggleSubtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  reminderToggleSwitch: {
    width: 28,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reminderToggleSwitchActive: {
    backgroundColor: 'rgba(255, 107, 53, 0.15)',
    borderColor: '#ff6b35',
    borderWidth: 2,
  },
  reminderHint: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.4)',
    textAlign: 'center',
    marginTop: 0,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
  button: {
    flex: 1,
  },
});
