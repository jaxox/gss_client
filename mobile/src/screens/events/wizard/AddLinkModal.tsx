import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import {
  Modal,
  Portal,
  Text,
  TextInput,
  Button,
  IconButton,
  Card,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface LinkData {
  icon: string;
  iconName: string;
  title: string;
  url: string;
}

interface AddLinkModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSave: (link: LinkData) => void;
}

const ICONS = [
  {
    name: 'discord',
    mdiName: 'discord',
    label: 'Discord',
    titleSuggestion: 'Discord Server',
  },
  {
    name: 'whatsapp',
    mdiName: 'whatsapp',
    label: 'WhatsApp',
    titleSuggestion: 'WhatsApp Group',
  },
  {
    name: 'facebook',
    mdiName: 'facebook',
    label: 'Facebook',
    titleSuggestion: 'Facebook Group',
  },
  {
    name: 'instagram',
    mdiName: 'instagram',
    label: 'Instagram',
    titleSuggestion: 'Instagram',
  },
  {
    name: 'maps',
    mdiName: 'map-marker',
    label: 'Maps',
    titleSuggestion: 'Location',
  },
  {
    name: 'youtube',
    mdiName: 'youtube',
    label: 'YouTube',
    titleSuggestion: 'YouTube Channel',
  },
  {
    name: 'link',
    mdiName: 'link-variant',
    label: 'Link',
    titleSuggestion: 'Custom Link',
  },
  {
    name: 'emailing-group',
    mdiName: 'email-multiple',
    label: 'Email Group',
    titleSuggestion: 'Emailing Group',
  },
];

const URL_VALIDATIONS: Record<string, RegExp> = {
  discord: /^https?:\/\/(www\.)?(discord\.com|discord\.gg)\//i,
  whatsapp: /^https?:\/\/(www\.)?(chat\.whatsapp\.com|wa\.me)\//i,
  facebook: /^https?:\/\/(www\.)?(facebook\.com|fb\.com)\//i,
  instagram: /^https?:\/\/(www\.)?(instagram\.com|instagr\.am)\//i,
  maps: /^https?:\/\/(www\.)?(maps\.google\.com|goo\.gl\/maps)\//i,
  youtube: /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i,
  link: /^https?:\/\//i, // Generic link - any URL
  'emailing-group': /^https?:\/\//i, // Generic emailing group link - any URL
};

export default function AddLinkModal({
  visible,
  onDismiss,
  onSave,
}: AddLinkModalProps) {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [touched, setTouched] = useState({ title: false, url: false });

  // Reset state when modal opens
  useEffect(() => {
    if (visible) {
      setSelectedIcon(null);
      setTitle('');
      setUrl('');
      setTouched({ title: false, url: false });
    }
  }, [visible]);

  // Auto-suggest title when icon selected
  useEffect(() => {
    if (selectedIcon) {
      const icon = ICONS.find(i => i.name === selectedIcon);
      if (icon) {
        setTitle(icon.titleSuggestion);
      }
    }
  }, [selectedIcon]);

  // Validation
  const titleError =
    touched.title && (title.length < 3 || title.length > 50)
      ? 'Title must be 3-50 characters'
      : null;

  const getUrlValidation = () => {
    if (!url.trim()) {
      return { isValid: false, message: 'URL is required' };
    }

    // Basic URL format check
    if (!url.match(/^https?:\/\//i)) {
      return {
        isValid: false,
        message: 'URL must start with http:// or https://',
      };
    }

    // Icon-specific validation
    if (selectedIcon && URL_VALIDATIONS[selectedIcon]) {
      const pattern = URL_VALIDATIONS[selectedIcon];
      if (!pattern.test(url.toLowerCase())) {
        const icon = ICONS.find(i => i.name === selectedIcon);
        return {
          isValid: false,
          message: `Invalid ${icon?.label} URL format`,
        };
      }
    }

    return { isValid: true, message: '✓ Valid URL' };
  };

  const urlValidation = getUrlValidation();
  // Valid if icon selected, title is 3-50 chars, and URL is valid
  const isValid =
    selectedIcon &&
    title.length >= 3 &&
    title.length <= 50 &&
    urlValidation.isValid;

  const handleSelectIcon = (iconName: string) => {
    setSelectedIcon(iconName);
  };

  const handleCancel = () => {
    onDismiss();
  };

  const handleAdd = () => {
    if (!isValid || !selectedIcon) return;

    const icon = ICONS.find(i => i.name === selectedIcon);
    if (!icon) return;

    onSave({
      icon: selectedIcon,
      iconName: icon.mdiName,
      title,
      url,
    });
    onDismiss();
  };

  const renderIconCard = (icon: (typeof ICONS)[0]) => {
    const isSelected = selectedIcon === icon.name;

    return (
      <Pressable
        key={icon.name}
        onPress={() => handleSelectIcon(icon.name)}
        style={[styles.iconCard, isSelected && styles.iconCardSelected]}
        accessibilityRole="radio"
        accessibilityState={{ selected: isSelected }}
        accessibilityLabel={`${icon.label} icon`}
      >
        <Icon
          name={icon.mdiName}
          size={32}
          color={isSelected ? '#3B82F6' : '#6B7280'}
        />
        <Text
          variant="bodySmall"
          style={[styles.iconLabel, isSelected && styles.iconLabelSelected]}
        >
          {icon.label}
        </Text>
      </Pressable>
    );
  };

  const selectedIconData = ICONS.find(i => i.name === selectedIcon);

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleCancel}
        contentContainerStyle={styles.modalContainer}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text variant="titleLarge" style={styles.title}>
              Add Link
            </Text>
            <IconButton
              icon="close"
              size={24}
              onPress={handleCancel}
              accessibilityLabel="Close dialog"
            />
          </View>

          {/* Icon Selector Grid */}
          <Text variant="bodyMedium" style={styles.sectionLabel}>
            Select Icon *
          </Text>
          <View style={styles.iconGrid}>
            {ICONS.map(icon => renderIconCard(icon))}
          </View>
          {!selectedIcon && (
            <Text variant="bodySmall" style={styles.errorText}>
              Please select an icon
            </Text>
          )}

          {/* Link Title Input */}
          <TextInput
            mode="outlined"
            label="Link Title *"
            value={title}
            onChangeText={setTitle}
            onBlur={() => setTouched(prev => ({ ...prev, title: true }))}
            maxLength={50}
            style={styles.input}
            error={touched.title && !!titleError}
            accessibilityLabel="Link title, required, 3 to 50 characters"
          />
          <Text
            variant="bodySmall"
            style={[
              styles.helperText,
              touched.title && titleError && styles.errorText,
            ]}
          >
            {touched.title && titleError
              ? titleError
              : `${title.length}/50 characters`}
          </Text>

          {/* Link URL Input */}
          <TextInput
            mode="outlined"
            label="Link URL *"
            value={url}
            onChangeText={setUrl}
            onBlur={() => setTouched(prev => ({ ...prev, url: true }))}
            keyboardType="url"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            error={touched.url && !urlValidation.isValid}
            accessibilityLabel="Link URL, required, enter valid web address"
          />
          <Text
            variant="bodySmall"
            style={[
              styles.helperText,
              touched.url && urlValidation.isValid && styles.successText,
              touched.url && !urlValidation.isValid && styles.errorText,
            ]}
          >
            {touched.url ? urlValidation.message : 'Enter a valid URL'}
          </Text>

          {/* Preview Card */}
          {selectedIcon && title && url && (
            <>
              <Text variant="bodyMedium" style={styles.sectionLabel}>
                📋 Preview
              </Text>
              <Card mode="outlined" style={styles.previewCard}>
                <Card.Content style={styles.previewContent}>
                  <Icon
                    name={selectedIconData?.mdiName || 'link'}
                    size={24}
                    color="#3B82F6"
                    style={styles.previewIcon}
                  />
                  <View style={styles.previewText}>
                    <Text variant="bodyLarge" style={styles.previewTitle}>
                      {title}
                    </Text>
                    <Text
                      variant="bodySmall"
                      style={styles.previewUrl}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {url}
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            </>
          )}

          {/* Action Buttons */}
          <View style={styles.actions}>
            <Button
              mode="outlined"
              onPress={handleCancel}
              style={styles.cancelButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleAdd}
              disabled={!isValid}
              style={styles.addButton}
            >
              Add Link
            </Button>
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 8,
    maxHeight: '90%',
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontWeight: 'bold',
  },
  sectionLabel: {
    color: '#6B7280',
    marginBottom: 12,
    fontWeight: '600',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  iconCard: {
    width: 70,
    height: 70,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
  },
  iconCardSelected: {
    borderWidth: 2,
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
    elevation: 4,
  },
  iconLabel: {
    marginTop: 4,
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
  },
  iconLabelSelected: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  input: {
    marginTop: 16,
  },
  helperText: {
    marginTop: 4,
    marginLeft: 12,
    color: '#6B7280',
  },
  successText: {
    color: '#10B981',
  },
  errorText: {
    color: '#EF4444',
  },
  previewCard: {
    marginTop: 12,
    marginBottom: 20,
  },
  previewContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewIcon: {
    marginRight: 12,
  },
  previewText: {
    flex: 1,
  },
  previewTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  previewUrl: {
    color: '#6B7280',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
  },
  addButton: {
    flex: 1,
  },
});
