/**
 * Step 2: Social Features - Following Design
 */
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { GradientButton } from '../../../components/controls';
import { theme } from '../../../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { WizardData } from './CreateEventWizard';

interface Props {
  data: WizardData;
  onNext: (data: Partial<WizardData>) => void;
  onBack: () => void;
}

export default function Step2Social({ onNext, onBack }: Props) {
  const [cohosts, setCohosts] = useState<string[]>([]);
  const [links, setLinks] = useState<Array<{ label: string; url: string }>>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [reminders, setReminders] = useState<string[]>([]);

  const handleNext = () => {
    onNext({ cohosts, links, questions, reminders });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        testID="step2-scroll-view"
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Co-hosts */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Icon
              name="account-multiple"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.sectionTitle}>Co-hosts</Text>
            <Pressable style={styles.addButton}>
              <Text style={styles.addButtonText}>+ Add</Text>
            </Pressable>
          </View>
          {cohosts.length === 0 ? (
            <Text style={styles.emptyText}>No co-hosts added</Text>
          ) : (
            cohosts.map((cohost, idx) => (
              <View key={idx} style={styles.listItem}>
                <Text style={styles.listItemText}>{cohost}</Text>
                <Pressable
                  onPress={() =>
                    setCohosts(cohosts.filter((_, i) => i !== idx))
                  }
                >
                  <Icon name="close" size={20} color={theme.colors.textMuted} />
                </Pressable>
              </View>
            ))
          )}
        </View>

        {/* Links */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Icon name="link-variant" size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Links</Text>
            <Pressable style={styles.addButton}>
              <Text style={styles.addButtonText}>+ Add</Text>
            </Pressable>
          </View>
          {links.length === 0 ? (
            <Text style={styles.emptyText}>No links added</Text>
          ) : (
            links.map((link, idx) => (
              <View key={idx} style={styles.listItem}>
                <View>
                  <Text style={styles.listItemText}>{link.label}</Text>
                  <Text style={styles.listItemSubtext}>{link.url}</Text>
                </View>
                <Pressable
                  onPress={() => setLinks(links.filter((_, i) => i !== idx))}
                >
                  <Icon name="close" size={20} color={theme.colors.textMuted} />
                </Pressable>
              </View>
            ))
          )}
        </View>

        {/* Questionnaire */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Icon name="form-select" size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Questionnaire</Text>
            <Pressable style={styles.addButton}>
              <Text style={styles.addButtonText}>+ Add</Text>
            </Pressable>
          </View>
          {questions.length === 0 ? (
            <Text style={styles.emptyText}>No questions added</Text>
          ) : (
            questions.map((q, idx) => (
              <View key={idx} style={styles.listItem}>
                <Text style={styles.listItemText}>{q}</Text>
                <Pressable
                  onPress={() =>
                    setQuestions(questions.filter((_, i) => i !== idx))
                  }
                >
                  <Icon name="close" size={20} color={theme.colors.textMuted} />
                </Pressable>
              </View>
            ))
          )}
        </View>

        {/* Reminders */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Icon name="bell-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Reminders</Text>
            <Pressable style={styles.addButton}>
              <Text style={styles.addButtonText}>+ Add</Text>
            </Pressable>
          </View>
          {reminders.length === 0 ? (
            <Text style={styles.emptyText}>No reminders configured</Text>
          ) : (
            reminders.map((r, idx) => (
              <View key={idx} style={styles.listItem}>
                <Text style={styles.listItemText}>{r}</Text>
                <Pressable
                  onPress={() =>
                    setReminders(reminders.filter((_, i) => i !== idx))
                  }
                >
                  <Icon name="close" size={20} color={theme.colors.textMuted} />
                </Pressable>
              </View>
            ))
          )}
        </View>

        <View style={styles.buttonContainer}>
          <GradientButton
            testID="step2-back-button"
            onPress={onBack}
            icon="arrow-left"
            style={styles.backButton}
          >
            BACK
          </GradientButton>
          <GradientButton
            testID="step2-next-button"
            onPress={handleNext}
            icon="arrow-right"
            style={styles.nextButton}
          >
            NEXT
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
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    flex: 1,
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text,
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 107, 53, 0.15)',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  addButtonText: {
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.primary,
  },
  emptyText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: 12,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  listItemText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    fontWeight: theme.fontWeights.medium,
  },
  listItemSubtext: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textMuted,
    marginTop: 2,
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
