import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Modal as RNModal,
  Pressable,
  TextInput as RNTextInput,
} from 'react-native';
import { Text, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CoHostCard, CoHostUser } from '../../../components/cohosts';
import { theme } from '../../../theme';

// Mock user data for development
const MOCK_USERS = [
  {
    id: '1',
    name: 'Sarah Johnson',
    level: 12,
    xp: 2450,
    reliability: 92, // % of events they actually showed up to
    eventsHosted: 15,
    sports: ['Tennis', 'Pickleball'],
    type: 'friend' as const,
  },
  {
    id: '2',
    name: 'Mike Chen',
    level: 10,
    xp: 1880,
    reliability: 88,
    eventsHosted: 12,
    sports: ['Badminton', 'Table Tennis'],
    type: 'friend' as const,
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    level: 15,
    xp: 3250,
    reliability: 95,
    eventsHosted: 23,
    sports: ['Tennis', 'Padel'],
    type: 'friend' as const,
  },
  {
    id: '4',
    name: 'James Wilson',
    level: 8,
    xp: 1200,
    reliability: 78,
    eventsHosted: 8,
    sports: ['Pickleball'],
    type: 'friend' as const,
  },
  {
    id: '5',
    name: 'Lisa Park',
    level: 6,
    xp: 850,
    reliability: 65,
    eventsHosted: 5,
    sports: ['Table Tennis', 'Badminton'],
    type: 'friend' as const,
  },
  {
    id: '6',
    name: 'Jay U',
    level: 99,
    xp: 8580,
    reliability: 100,
    eventsHosted: 85,
    sports: ['Table Tennis', 'Badminton'],
    type: 'friend' as const,
  },
  {
    id: '7',
    name: 'John T',
    level: 98,
    xp: 858,
    reliability: 90,
    eventsHosted: 1,
    sports: ['Table Tennis', 'Badminton'],
    type: 'friend' as const,
  },
];

interface AddCohostsModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSave: (cohosts: CoHostUser[]) => void;
  initialSelected?: CoHostUser[];
}

export default function AddCohostsModal({
  visible,
  onDismiss,
  onSave,
  initialSelected = [],
}: AddCohostsModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCohosts, setSelectedCohosts] =
    useState<CoHostUser[]>(initialSelected);
  const [loading, setLoading] = useState(false);
  const [addedUsers, setAddedUsers] = useState<Set<string>>(new Set());
  const addedTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  // Reset state when modal opens
  useEffect(() => {
    if (visible) {
      setSearchQuery('');
      setSelectedCohosts(initialSelected);
      setAddedUsers(new Set());
      // Simulate loading
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [visible, initialSelected]);

  // Filter and search users
  const filteredUsers = useMemo(() => {
    // Only show friends (users), not groups
    let users = MOCK_USERS.filter(u => u.type === 'friend');

    // Search by name or sport
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      users = users.filter(
        u =>
          u.name.toLowerCase().includes(query) ||
          u.sports.some(sport => sport.toLowerCase().includes(query)),
      );
    }

    // Remove already selected users
    const selectedIds = new Set(selectedCohosts.map(c => c.id));
    users = users.filter(u => !selectedIds.has(u.id));

    // Sort by level (highest first), then by show rate
    return users.sort((a, b) => {
      if (a.type === 'friend' && b.type === 'friend') {
        if (a.level !== b.level) {
          return b.level - a.level;
        }
        return b.reliability - a.reliability;
      }
      return 0;
    });
  }, [searchQuery, selectedCohosts]);

  const handleAddCohost = (user: CoHostUser) => {
    if (selectedCohosts.length >= 5) return;

    setSelectedCohosts(prev => [...prev, user]);
    setAddedUsers(prev => new Set(prev).add(user.id));

    // Remove "Added" state after 300ms
    const timer = setTimeout(() => {
      setAddedUsers(prev => {
        const next = new Set(prev);
        next.delete(user.id);
        return next;
      });
      addedTimersRef.current.delete(user.id);
    }, 300);

    // Store timer for cleanup
    addedTimersRef.current.set(user.id, timer);
  };

  // Cleanup all timers when component unmounts or modal closes
  useEffect(() => {
    const timers = addedTimersRef.current;
    return () => {
      timers.forEach(timer => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  const handleRemoveCohost = (userId: string) => {
    setSelectedCohosts(prev => prev.filter(c => c.id !== userId));
  };

  const handleCancel = () => {
    onDismiss();
  };

  const handleDone = () => {
    onSave(selectedCohosts);
    onDismiss();
  };

  const maxReached = selectedCohosts.length >= 5;

  const renderUserItem = ({ item }: { item: CoHostUser }) => {
    const isAdded = addedUsers.has(item.id);

    return (
      <CoHostCard
        user={item}
        onPress={() => handleAddCohost(item)}
        onAdd={() => handleAddCohost(item)}
        addIcon={isAdded ? 'check' : 'plus'}
        disabled={maxReached || isAdded}
        backgroundColor="transparent"
        accessibilityLabel={`${item.name}, Level ${item.level}, ${item.xp} XP, ${item.reliability} percent reliability, add as cohost button`}
      />
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="account-search" size={64} color="rgba(255, 255, 255, 0.3)" />
      <Text variant="titleMedium" style={styles.emptyTitle}>
        No users found
      </Text>
      <Text variant="bodyMedium" style={styles.emptySubtitle}>
        Try searching by name or sport
      </Text>
    </View>
  );

  const renderLoadingSkeleton = () => (
    <View style={styles.loadingContainer}>
      {[1, 2, 3].map(i => (
        <View key={i} style={styles.skeletonItem}>
          <View style={styles.skeletonAvatar} />
          <View style={styles.skeletonContent}>
            <View style={styles.skeletonLine} />
            <View style={[styles.skeletonLine, styles.skeletonLineShort]} />
          </View>
        </View>
      ))}
    </View>
  );

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
          <Text style={styles.headerTitle}>Add Cohosts</Text>
          <Pressable
            onPress={handleDone}
            disabled={selectedCohosts.length === 0}
            style={styles.checkButton}
          >
            <Icon
              name="check"
              size={24}
              color={
                selectedCohosts.length === 0
                  ? 'rgba(255, 255, 255, 0.3)'
                  : '#ff6b35'
              }
            />
          </Pressable>
        </View>

        <View style={styles.content}>
          {/* Search Input */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputWrapper}>
              <Icon
                name="magnify"
                size={20}
                color="rgba(255, 255, 255, 0.5)"
                style={styles.searchIcon}
              />
              <RNTextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search for co-hosts"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                style={styles.searchInput}
                accessibilityLabel="Search for cohosts"
              />
            </View>
          </View>

          {/* Results Header */}
          <Text variant="bodyMedium" style={styles.sectionHeader}>
            Results ({filteredUsers.length})
          </Text>

          {/* Results List */}
          <View style={styles.resultsContainer}>
            {loading ? (
              renderLoadingSkeleton()
            ) : filteredUsers.length === 0 ? (
              renderEmptyState()
            ) : (
              <FlatList
                data={filteredUsers}
                renderItem={renderUserItem}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>

          {/* Selected Cohosts Section */}
          {selectedCohosts.length > 0 && (
            <>
              <Divider style={styles.divider} />
              <Text variant="bodyMedium" style={styles.sectionHeader}>
                Selected Cohosts ({selectedCohosts.length}/5)
              </Text>
              <View style={styles.selectedContainer}>
                {selectedCohosts.map(cohost => (
                  <CoHostCard
                    key={cohost.id}
                    user={cohost}
                    backgroundColor="rgba(255, 107, 53, 0.1)"
                    onRemove={() => handleRemoveCohost(cohost.id)}
                    accessibilityLabel={`${cohost.name}, Level ${cohost.level}, ${cohost.xp} XP, ${cohost.reliability} percent reliability, remove button`}
                  />
                ))}
              </View>
            </>
          )}

          {/* Helper Text */}
          <View style={styles.footer}>
            <Text
              variant="bodySmall"
              style={[styles.helperText, maxReached && styles.helperTextError]}
            >
              {maxReached ? 'Maximum cohosts reached' : 'Max 5 cohosts'}
            </Text>
          </View>
        </View>
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
  content: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 15,
    color: '#ffffff',
    padding: 0,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    color: theme.colors.textSecondary,
    marginBottom: 8,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  resultsContainer: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    marginTop: 16,
    color: theme.colors.text,
    fontWeight: '700',
  },
  emptySubtitle: {
    marginTop: 4,
    color: theme.colors.textSecondary,
  },
  loadingContainer: {
    padding: 16,
  },
  skeletonItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  skeletonAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.surfaceElevated,
  },
  skeletonContent: {
    flex: 1,
    marginLeft: 12,
  },
  skeletonLine: {
    height: 12,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonLineShort: {
    width: '60%',
  },
  divider: {
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: theme.colors.border,
  },
  selectedContainer: {
    paddingBottom: 8,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  helperText: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  helperTextError: {
    color: '#EF4444',
  },
});
