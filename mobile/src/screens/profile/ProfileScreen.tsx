import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Text,
  Avatar,
  Button,
  TextInput,
  Chip,
  ActivityIndicator,
  HelperText,
  IconButton,
  Divider,
  Card,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getProfile } from '../../store/profile/profileSlice';
import { getInitials, generateAvatarColor } from '@gss/shared';

// Offline banner component
const OfflineBanner = () => (
  <View style={styles.offlineBanner}>
    <Text variant="labelSmall" style={styles.offlineText}>
      ⚠️ Offline Mode - Showing cached data
    </Text>
  </View>
);

// Skeleton loading component
const SkeletonBox = ({
  width,
  height,
  style,
}: {
  width?: number | string;
  height?: number;
  style?: any;
}) => <View style={[styles.skeleton, { width, height }, style]} />;

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { currentProfile, isLoading } = useAppSelector(state => state.profile);

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const profile = currentProfile || user;
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [homeCity, setHomeCity] = useState(profile?.homeCity || '');

  // Validation errors
  const [displayNameError, setDisplayNameError] = useState<string | null>(null);
  const [homeCityError, setHomeCityError] = useState<string | null>(null);

  // Form dirty state
  const [isDirty, setIsDirty] = useState(false);

  // Load profile on mount
  useEffect(() => {
    if (user?.id) {
      dispatch(getProfile(user.id));
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName);
      setHomeCity(profile.homeCity);
    }
  }, [profile]);

  useEffect(() => {
    // Track if form has unsaved changes
    if (user) {
      const hasChanges =
        displayName !== user.displayName || homeCity !== user.homeCity;
      setIsDirty(hasChanges);
    }
  }, [displayName, homeCity, user]);

  const validateDisplayName = (name: string): string | null => {
    if (!name || name.trim().length === 0) {
      return 'Display name is required';
    }
    if (name.length < 2) {
      return 'Display name must be at least 2 characters';
    }
    if (name.length > 50) {
      return 'Display name must not exceed 50 characters';
    }
    if (!/^[a-zA-Z0-9\s]+$/.test(name)) {
      return 'Display name can only contain letters, numbers, and spaces';
    }
    return null;
  };

  const validateCity = (city: string): string | null => {
    if (!city || city.trim().length === 0) {
      return 'Home city is required';
    }
    if (city.length < 2) {
      return 'Home city must be at least 2 characters';
    }
    if (city.length > 100) {
      return 'Home city must not exceed 100 characters';
    }
    return null;
  };

  const handleEditPress = () => {
    setIsEditMode(true);
    setError(null);
    setDisplayNameError(null);
    setHomeCityError(null);
  };

  const handleCancelEdit = () => {
    // Revert to original values
    if (user) {
      setDisplayName(user.displayName);
      setHomeCity(user.homeCity);
    }
    setIsEditMode(false);
    setError(null);
    setDisplayNameError(null);
    setHomeCityError(null);
    setIsDirty(false);
  };

  const handleSave = async () => {
    // Validate all fields
    const nameError = validateDisplayName(displayName);
    const cityError = validateCity(homeCity);

    setDisplayNameError(nameError);
    setHomeCityError(cityError);

    if (nameError || cityError) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // TODO: Dispatch profile update action
      // await dispatch(updateProfile({ displayName, homeCity })).unwrap();

      // Simulate API call for now
      await new Promise<void>(resolve => setTimeout(() => resolve(), 500));

      setIsEditMode(false);
      setIsDirty(false);
      // TODO: Show success toast/snackbar
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const avatarColor = profile ? generateAvatarColor(profile.id) : '#6200EE';
  const initials = profile ? getInitials(profile.displayName) : '?';

  // Guard: Don't render if no user (must be after all hooks)
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text variant="bodyLarge">Please log in to view your profile</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Skeleton loading UI
  if (isLoading && !currentProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text variant="headlineSmall" style={styles.headerTitle}>
            My Profile
          </Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Avatar Skeleton */}
          <View style={styles.avatarSection}>
            <SkeletonBox
              width={100}
              height={100}
              style={styles.skeletonRounded}
            />
            <SkeletonBox
              width={200}
              height={32}
              style={styles.skeletonMarginTop12}
            />
          </View>

          {/* Profile Card Skeleton */}
          <Card style={styles.card}>
            <Card.Content>
              <SkeletonBox width="40%" height={16} />
              <SkeletonBox
                width="80%"
                height={24}
                style={styles.skeletonMarginTop8}
              />
              <Divider style={styles.divider} />
              <SkeletonBox width="40%" height={16} />
              <SkeletonBox
                width="70%"
                height={24}
                style={styles.skeletonMarginTop8}
              />
              <Divider style={styles.divider} />
              <SkeletonBox width="40%" height={16} />
              <SkeletonBox
                width="60%"
                height={24}
                style={styles.skeletonMarginTop8}
              />
            </Card.Content>
          </Card>

          {/* Stats Card Skeleton */}
          <Card style={styles.card}>
            <Card.Content>
              <SkeletonBox width="50%" height={20} />
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <SkeletonBox width={60} height={48} />
                </View>
                <View style={styles.statItem}>
                  <SkeletonBox width={60} height={48} />
                </View>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header with Edit Button */}
          <View style={styles.header}>
            <Text variant="headlineSmall" style={styles.headerTitle}>
              My Profile
            </Text>
            {!isEditMode && (
              <IconButton
                icon="pencil"
                size={24}
                onPress={handleEditPress}
                mode="contained-tonal"
              />
            )}
          </View>

          {/* Offline Indicator */}
          {error && error.includes('network') && <OfflineBanner />}

          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <Avatar.Text
              size={100}
              label={initials}
              style={[styles.avatar, { backgroundColor: avatarColor }]}
              color="#fff"
            />
            <View style={styles.avatarBadgeContainer}>
              <Chip icon="information" compact mode="flat">
                Avatar Upload Coming Soon
              </Chip>
            </View>
          </View>

          {/* Profile Information Card */}
          <Card style={styles.card}>
            <Card.Content>
              {isEditMode ? (
                // Edit Mode
                <>
                  <TextInput
                    label="Display Name"
                    value={displayName}
                    onChangeText={text => {
                      setDisplayName(text);
                      setDisplayNameError(validateDisplayName(text));
                    }}
                    mode="outlined"
                    style={styles.input}
                    error={!!displayNameError}
                    disabled={isSaving}
                  />
                  {displayNameError ? (
                    <HelperText type="error" visible={!!displayNameError}>
                      {displayNameError}
                    </HelperText>
                  ) : null}

                  <TextInput
                    label="Home City"
                    value={homeCity}
                    onChangeText={text => {
                      setHomeCity(text);
                      setHomeCityError(validateCity(text));
                    }}
                    mode="outlined"
                    style={styles.input}
                    error={!!homeCityError}
                    disabled={isSaving}
                  />
                  {homeCityError ? (
                    <HelperText type="error" visible={!!homeCityError}>
                      {homeCityError}
                    </HelperText>
                  ) : null}

                  <TextInput
                    label="Email"
                    value={user.email}
                    mode="outlined"
                    style={styles.input}
                    disabled
                    right={<TextInput.Icon icon="lock" />}
                  />

                  {error ? (
                    <HelperText type="error" visible={!!error}>
                      {error}
                    </HelperText>
                  ) : null}

                  {/* Action Buttons */}
                  <View style={styles.actionButtons}>
                    <Button
                      mode="outlined"
                      onPress={handleCancelEdit}
                      style={styles.cancelButton}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button
                      mode="contained"
                      onPress={handleSave}
                      style={styles.saveButton}
                      disabled={!isDirty || isSaving}
                      loading={isSaving}
                    >
                      Save Changes
                    </Button>
                  </View>
                </>
              ) : (
                // View Mode
                <>
                  <View style={styles.fieldRow}>
                    <Text variant="labelMedium" style={styles.fieldLabel}>
                      Display Name
                    </Text>
                    <Text variant="bodyLarge" style={styles.fieldValue}>
                      {user.displayName}
                    </Text>
                  </View>

                  <Divider style={styles.divider} />

                  <View style={styles.fieldRow}>
                    <Text variant="labelMedium" style={styles.fieldLabel}>
                      Email
                    </Text>
                    <Text variant="bodyLarge" style={styles.fieldValue}>
                      {user.email}
                    </Text>
                  </View>

                  <Divider style={styles.divider} />

                  <View style={styles.fieldRow}>
                    <Text variant="labelMedium" style={styles.fieldLabel}>
                      Home City
                    </Text>
                    <Text variant="bodyLarge" style={styles.fieldValue}>
                      {user.homeCity}
                    </Text>
                  </View>

                  <Divider style={styles.divider} />

                  <View style={styles.fieldRow}>
                    <Text variant="labelMedium" style={styles.fieldLabel}>
                      Reliability Score
                    </Text>
                    <View style={styles.fieldValueRow}>
                      <Text variant="bodyLarge" style={styles.fieldValue}>
                        {(user.reliabilityScore * 100).toFixed(0)}%
                      </Text>
                      <Chip icon="lock" compact mode="flat">
                        Private
                      </Chip>
                    </View>
                  </View>
                </>
              )}
            </Card.Content>
          </Card>

          {/* Gamification Stats Card */}
          {!isEditMode && (
            <Card style={styles.card}>
              <Card.Title title="Gamification Stats" />
              <Card.Content>
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text variant="labelMedium" style={styles.statLabel}>
                      Level
                    </Text>
                    <Text variant="headlineMedium" style={styles.statValue}>
                      {user.level}
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text variant="labelMedium" style={styles.statLabel}>
                      XP
                    </Text>
                    <Text variant="headlineMedium" style={styles.statValue}>
                      {user.xp.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatar: {
    marginBottom: 12,
  },
  avatarBadgeContainer: {
    marginTop: 8,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  input: {
    marginBottom: 8,
  },
  fieldRow: {
    paddingVertical: 12,
  },
  fieldLabel: {
    color: '#666',
    marginBottom: 4,
  },
  fieldValue: {
    color: '#000',
  },
  fieldValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  divider: {
    marginVertical: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#666',
    marginBottom: 8,
  },
  statValue: {
    fontWeight: 'bold',
    color: '#6200EE',
  },
  skeleton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    height: 16,
  },
  skeletonRounded: {
    borderRadius: 50,
  },
  skeletonMarginTop12: {
    marginTop: 12,
  },
  skeletonMarginTop8: {
    marginTop: 8,
  },
  offlineBanner: {
    backgroundColor: '#FFF3CD',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6F00',
  },
  offlineText: {
    color: '#856404',
    textAlign: 'center',
  },
});
