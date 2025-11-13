import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, FlatList, Modal, SafeAreaView } from 'react-native';
import { Appbar, Text, TextInput, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CoHostCard, CoHostUser } from '../../../components/cohosts';

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

  // Reset state when modal opens
  useEffect(() => {
    if (visible) {
      setSearchQuery('');
      setSelectedCohosts(initialSelected);
      setAddedUsers(new Set());
      // Simulate loading
      setLoading(true);
      setTimeout(() => setLoading(false), 500);
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
    setTimeout(() => {
      setAddedUsers(prev => {
        const next = new Set(prev);
        next.delete(user.id);
        return next;
      });
    }, 300);
  };

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
        disabled={maxReached || isAdded}
        actionButton={{
          label: isAdded ? (
            <Icon name="account-minus" size={16} color="#fff" />
          ) : (
            <Icon name="account-plus" size={16} color="#fff" />
          ),
          mode: 'contained',
          onPress: () => handleAddCohost(item),
          disabled: maxReached || isAdded,
          style: [styles.addButton, isAdded && styles.addedButton],
        }}
        accessibilityLabel={`${item.name}, Level ${item.level}, ${item.xp} XP, ${item.reliability} percent reliability, add as cohost button`}
      />
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="account-search" size={64} color="#9CA3AF" />
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
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleCancel}
    >
      <SafeAreaView style={styles.container}>
        {/* App Bar */}
        <Appbar.Header statusBarHeight={0}>
          <Appbar.BackAction onPress={handleCancel} />
          <Appbar.Content title="Add Cohosts" />
          <Appbar.Action
            icon="check"
            onPress={handleDone}
            disabled={selectedCohosts.length === 0}
          />
        </Appbar.Header>

        <View style={styles.content}>
          {/* Search Input */}
          <View style={styles.searchContainer}>
            <TextInput
              mode="outlined"
              placeholder="Search for co-hosts"
              value={searchQuery}
              onChangeText={setSearchQuery}
              left={<TextInput.Icon icon="magnify" />}
              style={styles.searchInput}
              accessibilityLabel="Search for cohosts"
            />
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
                    backgroundColor="#F9FAFB"
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
    </Modal>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchInput: {
    backgroundColor: 'white',
  },
  sectionHeader: {
    paddingHorizontal: 16,
    color: '#6B7280',
    marginBottom: 8,
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
  },
  addButton: {
    minWidth: 48,
    width: 48,
    height: 36,
  },
  addedButton: {
    backgroundColor: '#10B981',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    marginTop: 16,
    color: '#374151',
  },
  emptySubtitle: {
    marginTop: 4,
    color: '#6B7280',
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
    backgroundColor: '#E5E7EB',
  },
  skeletonContent: {
    flex: 1,
    marginLeft: 12,
  },
  skeletonLine: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonLineShort: {
    width: '60%',
  },
  divider: {
    marginVertical: 8,
    marginHorizontal: 16,
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
    color: '#6B7280',
  },
  helperTextError: {
    color: '#EF4444',
  },
});
