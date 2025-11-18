/**
 * Location Input Modal
 * Full-screen modal for editing location with autocomplete
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text, TextInput, Appbar, Portal } from 'react-native-paper';
import { theme } from '../theme';

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
}

interface Props {
  visible: boolean;
  value: string;
  locations: Location[];
  onSave: (location: string) => void;
  onDismiss: () => void;
}

export default function LocationInputModal({
  visible,
  value,
  locations,
  onSave,
  onDismiss,
}: Props) {
  const [query, setQuery] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<any>(null);

  useEffect(() => {
    if (visible) {
      setQuery(value);
      // Auto-focus when modal opens
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [visible, value]);

  const filteredLocations = locations
    .filter(
      loc =>
        loc.name.toLowerCase().includes(query.toLowerCase()) ||
        loc.address.toLowerCase().includes(query.toLowerCase()) ||
        loc.city.toLowerCase().includes(query.toLowerCase()),
    )
    .slice(0, 8);

  const handleSave = () => {
    onSave(query);
    onDismiss();
  };

  const handleSelectLocation = (loc: Location) => {
    const fullAddress = `${loc.name}, ${loc.city}, ${loc.state}`;
    setQuery(fullAddress);
    setShowSuggestions(false);
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onRequestClose={onDismiss}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          {/* Header */}
          <Appbar.Header>
            <Appbar.Action
              testID="location-modal-close-button"
              icon="close"
              onPress={onDismiss}
            />
            <Appbar.Content title="Edit Location" />
            <Appbar.Action
              testID="location-save-button"
              icon="check"
              onPress={handleSave}
              disabled={!query.trim()}
            />
          </Appbar.Header>

          {/* Content */}
          <View style={styles.content}>
            <TextInput
              testID="location-search-input"
              ref={inputRef}
              label="Location"
              value={query}
              onChangeText={text => {
                setQuery(text);
                setShowSuggestions(text.length >= 2);
              }}
              mode="outlined"
              placeholder="Enter address or search venues"
              autoFocus
              multiline
              numberOfLines={3}
              style={styles.input}
              left={<TextInput.Icon icon="map-marker" />}
            />

            <Text variant="bodySmall" style={styles.hint}>
              Type to search venues or enter a custom address
            </Text>

            {/* Suggestions */}
            {showSuggestions && filteredLocations.length > 0 && (
              <ScrollView style={styles.suggestionsList}>
                <Text variant="labelSmall" style={styles.suggestionsHeader}>
                  Suggested Locations
                </Text>
                {filteredLocations.map(loc => (
                  <Pressable
                    key={loc.id}
                    style={styles.suggestionItem}
                    onPress={() => handleSelectLocation(loc)}
                  >
                    <View>
                      <Text variant="bodyMedium" style={styles.locationName}>
                        {loc.name}
                      </Text>
                      <Text variant="bodySmall" style={styles.locationAddress}>
                        {loc.address}, {loc.city}, {loc.state}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  input: {
    marginBottom: 8,
    backgroundColor: theme.colors.surface,
  },
  hint: {
    color: theme.colors.textSecondary,
    marginBottom: 16,
  },
  suggestionsList: {
    flex: 1,
  },
  suggestionsHeader: {
    color: theme.colors.textSecondary,
    marginBottom: 8,
    fontWeight: '600',
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  locationName: {
    fontWeight: '600',
    marginBottom: 4,
    color: theme.colors.text,
  },
  locationAddress: {
    color: theme.colors.textSecondary,
  },
});
