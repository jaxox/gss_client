/**
 * Add Questionnaire Modal - Premium Athletic Design
 * Custom RSVP questions for event registration
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
import { Text, TextInput, Provider as PaperProvider } from 'react-native-paper';
import { FABButton, CheckboxButton } from '../../../components/buttons';
import { theme } from '../../../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export interface Question {
  id: string;
  type: 'short-answer' | 'multiple-choice' | 'email';
  question: string;
  required: boolean;
  options?: string[]; // For multiple choice
}

interface AddQuestionnaireModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSave: (question: Question) => void;
  initialQuestion?: Question;
}

const QUESTION_TYPES = [
  { value: 'short-answer', label: 'Short Answer', icon: 'text-short' },
  {
    value: 'multiple-choice',
    label: 'Multiple Choice',
    icon: 'format-list-bulleted-square',
  },
  { value: 'email', label: 'Email', icon: 'email-outline' },
] as const;

export default function AddQuestionnaireModal({
  visible,
  onDismiss,
  onSave,
  initialQuestion,
}: AddQuestionnaireModalProps) {
  const [questionType, setQuestionType] =
    useState<Question['type']>('short-answer');
  const [questionText, setQuestionText] = useState('');
  const [required, setRequired] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    if (visible) {
      if (initialQuestion) {
        setQuestionType(initialQuestion.type);
        setQuestionText(initialQuestion.question);
        setRequired(initialQuestion.required);
        setOptions(initialQuestion.options || []);
      } else {
        setQuestionType('short-answer');
        setQuestionText('');
        setRequired(false);
        setOptions([]);
      }
    }
  }, [visible, initialQuestion]);

  const handleSave = () => {
    // Filter out empty options for multiple choice
    const filteredOptions = options
      .map(opt => opt.trim())
      .filter(opt => opt.length > 0);

    const question: Question = {
      id: initialQuestion?.id || Date.now().toString(),
      type: questionType,
      question: questionText.trim(),
      required,
      options: questionType === 'multiple-choice' ? filteredOptions : undefined,
    };
    onSave(question);
    onDismiss();
  };

  const isValid =
    questionText.trim().length > 0 &&
    (questionType !== 'multiple-choice' ||
      options.some(opt => opt.trim().length > 0));

  if (!visible) return null;

  return (
    <RNModal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onDismiss}
    >
      <PaperProvider>
        <SafeAreaView style={styles.container}>
          {/* Custom Header */}
          <View style={styles.header}>
            <Pressable onPress={onDismiss} style={styles.backButton}>
              <Icon name="arrow-left" size={24} color="#ffffff" />
            </Pressable>
            <Text style={styles.headerTitle}>
              {initialQuestion ? 'Edit Question' : 'Add Question'}
            </Text>
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
            {/* Question Form */}
            <View style={styles.form}>
              {/* Question Type Selector */}
              <Text style={styles.fieldLabel}>Question Type</Text>
              <View>
                <Pressable
                  onPress={() => setOpenMenu(!openMenu)}
                  style={styles.typeDropdownFull}
                >
                  <View style={styles.typeDropdownContent}>
                    <Icon
                      name={
                        QUESTION_TYPES.find(t => t.value === questionType)
                          ?.icon || 'help-circle'
                      }
                      size={20}
                      color="#ff6b35"
                    />
                    <Text style={styles.typeDropdownText}>
                      {QUESTION_TYPES.find(t => t.value === questionType)
                        ?.label || 'Select Type'}
                    </Text>
                  </View>
                  <Icon
                    name={openMenu ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="rgba(255, 255, 255, 0.6)"
                  />
                </Pressable>

                {/* Custom Dropdown Menu */}
                {openMenu && (
                  <View style={styles.dropdownMenu}>
                    {QUESTION_TYPES.map(type => (
                      <Pressable
                        key={type.value}
                        onPress={() => {
                          setQuestionType(type.value);
                          setOpenMenu(false);
                        }}
                        style={({ pressed }) => [
                          styles.dropdownItem,
                          pressed && styles.dropdownItemPressed,
                          questionType === type.value &&
                            styles.dropdownItemSelected,
                        ]}
                      >
                        <View style={styles.dropdownItemContent}>
                          <Icon
                            name={type.icon}
                            size={20}
                            color={
                              questionType === type.value
                                ? '#ff6b35'
                                : 'rgba(255, 255, 255, 0.6)'
                            }
                          />
                          <Text
                            style={[
                              styles.dropdownItemText,
                              questionType === type.value &&
                                styles.dropdownItemTextSelected,
                            ]}
                          >
                            {type.label}
                          </Text>
                        </View>
                        {questionType === type.value && (
                          <Icon name="check" size={18} color="#ff6b35" />
                        )}
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              {/* Question Text Input */}
              <View style={styles.questionHeader}>
                <Text style={styles.fieldLabel}>Question</Text>
                <CheckboxButton
                  label="Required"
                  checked={required}
                  onPress={() => setRequired(!required)}
                />
              </View>
              <TextInput
                value={questionText}
                onChangeText={setQuestionText}
                placeholder="Enter your question"
                placeholderTextColor={theme.colors.textMuted}
                mode="outlined"
                multiline
                numberOfLines={2}
                maxLength={80}
                style={[styles.input, styles.questionInput]}
                outlineColor={theme.colors.border}
                activeOutlineColor={theme.colors.primary}
                textColor={theme.colors.text}
                theme={{
                  colors: {
                    background: theme.colors.surface,
                  },
                }}
              />
              <Text style={styles.characterCount}>
                {questionText.length}/80
              </Text>

              {/* Multiple Choice Options */}
              {questionType === 'multiple-choice' && (
                <View style={styles.optionsContainer}>
                  <View style={styles.optionsHeader}>
                    <Text style={styles.fieldLabel}>
                      Options ({options.length}/5)
                    </Text>
                    <FABButton
                      onPress={() => setOptions([...options, ''])}
                      size="medium"
                      disabled={options.length >= 5}
                    />
                  </View>

                  {options.map((option, index) => (
                    <View key={index} style={styles.optionRow}>
                      <TextInput
                        value={option}
                        onChangeText={text => {
                          const newOptions = [...options];
                          newOptions[index] = text;
                          setOptions(newOptions);
                        }}
                        placeholder={`Option ${index + 1}`}
                        placeholderTextColor={theme.colors.textMuted}
                        mode="outlined"
                        maxLength={50}
                        style={[styles.input, styles.optionInput]}
                        outlineColor={theme.colors.border}
                        activeOutlineColor={theme.colors.primary}
                        textColor={theme.colors.text}
                        theme={{
                          colors: {
                            background: theme.colors.surface,
                          },
                        }}
                      />
                      {options.length > 1 && (
                        <FABButton
                          onPress={() => {
                            const newOptions = options.filter(
                              (_, i) => i !== index,
                            );
                            setOptions(newOptions);
                          }}
                          size="small"
                          variant="remove"
                          icon="close"
                        />
                      )}
                    </View>
                  ))}

                  {options.length === 0 && (
                    <Pressable
                      onPress={() => setOptions([''])}
                      style={styles.emptyOptionsPrompt}
                    >
                      <Icon
                        name="plus-circle-outline"
                        size={24}
                        color={theme.colors.textMuted}
                      />
                      <Text style={styles.emptyOptionsText}>
                        Add your first option
                      </Text>
                    </Pressable>
                  )}
                </View>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </PaperProvider>
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
  form: {
    gap: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
    marginTop: 8,
  },
  typeDropdownFull: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  typeDropdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  typeDropdownText: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '500',
  },
  dropdownMenu: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginTop: 8,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  dropdownItemPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  dropdownItemSelected: {
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
  },
  dropdownItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '500',
  },
  dropdownItemTextSelected: {
    color: '#ff6b35',
    fontWeight: '600',
  },
  requiredToggleFull: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 48,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginTop: 8,
  },
  requiredToggleActive: {
    backgroundColor: 'rgba(255, 107, 53, 0.15)',
    borderColor: '#ff6b35',
  },
  toggleIcon: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleIconActive: {
    backgroundColor: '#ff6b35',
    borderColor: '#ff6b35',
  },
  requiredLabel: {
    fontSize: 15,
    color: theme.colors.text,
    fontWeight: '500',
  },
  input: {
    backgroundColor: theme.colors.surface,
    fontSize: theme.fontSizes.md,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  questionInput: {
    minHeight: 56,
    maxHeight: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 4,
    textAlign: 'right',
  },
  optionsContainer: {
    marginTop: 8,
  },
  optionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  optionInput: {
    flex: 1,
    minHeight: 48,
  },
  emptyOptionsPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  emptyOptionsText: {
    fontSize: 14,
    color: theme.colors.textMuted,
  },
});
