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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../../../theme';
import { LinkPreviewCard } from '../../../components/links';

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
  initialLink?: LinkData;
}

const ICONS = [
  {
    name: 'link',
    mdiName: 'link-variant',
    titleSuggestion: 'Custom Link',
  },
  {
    name: 'discord',
    mdiName: 'discord',
    titleSuggestion: 'Discord Server',
  },
  {
    name: 'whatsapp',
    mdiName: 'whatsapp',
    titleSuggestion: 'WhatsApp Group',
  },
  {
    name: 'facebook',
    mdiName: 'facebook',
    titleSuggestion: 'Facebook Group',
  },
  {
    name: 'instagram',
    mdiName: 'instagram',
    titleSuggestion: 'Instagram',
  },
  {
    name: 'maps',
    mdiName: 'map-marker',
    titleSuggestion: 'Location',
  },
  {
    name: 'youtube',
    mdiName: 'youtube',
    titleSuggestion: 'YouTube Channel',
  },
  {
    name: 'emailing-group',
    mdiName: 'email-multiple',
    titleSuggestion: 'Emailing Group',
  },
  {
    name: 'car',
    mdiName: 'car',
    titleSuggestion: 'Carpool / Ride Share',
  },
  {
    name: 'chat',
    mdiName: 'chat',
    titleSuggestion: 'Chat Group',
  },
  {
    name: 'calendar',
    mdiName: 'calendar',
    titleSuggestion: 'Calendar',
  },
  {
    name: 'ticket',
    mdiName: 'ticket',
    titleSuggestion: 'Tickets / Registration',
  },
];

// URL validation - validates proper URL format with optional http/https
const URL_PATTERN = /^(https?:\/\/)?([^\s$.?#].[^\s]*)$/gm;

export default function AddLinkModal({
  visible,
  onDismiss,
  onSave,
  initialLink,
}: AddLinkModalProps) {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [touched, setTouched] = useState({ title: false, url: false });

  // Reset or pre-fill state when modal opens
  useEffect(() => {
    if (visible) {
      if (initialLink) {
        // Edit mode - pre-fill with existing data
        setSelectedIcon(initialLink.icon);
        setTitle(initialLink.title);
        setUrl(initialLink.url);
        setTouched({ title: false, url: false });
      } else {
        // Add mode - reset to defaults
        setSelectedIcon('link');
        setTitle('');
        setUrl('');
        setTouched({ title: false, url: false });
      }
    }
  }, [visible, initialLink]);

  // Validation
  const titleError =
    touched.title && (title.length < 3 || title.length > 40)
      ? 'Title must be 3-40 characters'
      : null;

  const getUrlValidation = () => {
    if (!url.trim()) {
      return { isValid: false, message: 'URL is required' };
    }

    // Validate URL format
    URL_PATTERN.lastIndex = 0; // Reset regex state for global flag
    if (!URL_PATTERN.test(url)) {
      return {
        isValid: false,
        message: 'Invalid URL format',
      };
    }

    return { isValid: true, message: '✓ Valid URL' };
  };

  const urlValidation = getUrlValidation();
  // Valid if icon selected, title is 3-40 chars, and URL is valid
  const isValid =
    selectedIcon &&
    title.length >= 3 &&
    title.length <= 40 &&
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
        accessibilityLabel={`${icon.name} icon`}
      >
        <Icon
          name={icon.mdiName}
          size={28}
          color={isSelected ? theme.colors.primary : theme.colors.textSecondary}
        />
      </Pressable>
    );
  };

  const selectedIconData = ICONS.find(i => i.name === selectedIcon);

  if (!visible) return null;

  return (
    <RNModal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleCancel}
    >
      <SafeAreaView style={styles.container}>
        {/* Custom Header */}
        <View style={styles.header}>
          <Pressable onPress={handleCancel} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#ffffff" />
          </Pressable>
          <Text style={styles.headerTitle}>
            {initialLink ? 'Edit Link' : 'Add Link'}
          </Text>
          <Pressable
            onPress={handleAdd}
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
          {/* Icon Selector Grid */}
          <Text variant="bodyMedium" style={styles.sectionLabel}>
            Select Icon
          </Text>
          <View style={styles.iconGrid}>
            {ICONS.map(icon => renderIconCard(icon))}
          </View>

          {/* Link Title Input */}
          <TextInput
            mode="outlined"
            label="Link Title *"
            value={title}
            onChangeText={setTitle}
            onBlur={() => setTouched(prev => ({ ...prev, title: true }))}
            maxLength={40}
            style={styles.input}
            error={touched.title && !!titleError}
            accessibilityLabel="Link title, required, 3 to 40 characters"
            outlineStyle={{ borderRadius: 12 }}
            theme={{
              colors: {
                background: '#1e1e1e',
              },
            }}
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
              : `${title.length}/40 characters`}
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
            multiline
            numberOfLines={1}
            style={[styles.input]}
            error={touched.url && !urlValidation.isValid}
            accessibilityLabel="Link URL, required, enter valid web address"
            outlineStyle={{ borderRadius: 12 }}
            theme={{
              colors: {
                background: '#1e1e1e',
              },
            }}
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
                Preview
              </Text>
              <LinkPreviewCard
                iconName={selectedIconData?.mdiName || 'link'}
                title={title}
                url={url}
              />
            </>
          )}
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
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: 8,
    textTransform: 'uppercase',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 8,
  },
  iconCard: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCardSelected: {
    borderWidth: 2,
    borderColor: '#ff6b35',
    backgroundColor: 'rgba(255, 107, 53, 0.15)',
  },
  input: {
    marginTop: 16,
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
  },
  helperText: {
    marginTop: 4,
    marginLeft: 12,
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  successText: {
    color: '#10B981',
    fontWeight: '600',
  },
  errorText: {
    color: '#EF4444',
    fontWeight: '600',
  },
});
