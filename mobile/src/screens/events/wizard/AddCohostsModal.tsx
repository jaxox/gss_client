import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import {
  Modal,
  Portal,
  Text,
  TextInput,
  Chip,
  Button,
  Avatar,
  IconButton,
  Divider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Mock user data for development
const MOCK_USERS = [
  {
    id: '1',
    name: 'Sarah Johnson',
    reliabilityScore: 92,
    eventsHosted: 15,
    sports: ['Tennis', 'Pickleball'],
    type: 'friend' as const,
  },
  {
    id: '2',
    name: 'Mike Chen',
    reliabilityScore: 88,
    eventsHosted: 12,
    sports: ['Badminton', 'Table Tennis'],
    type: 'friend' as const,
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    reliabilityScore: 95,
    eventsHosted: 23,
    sports: ['Tennis', 'Padel'],
    type: 'friend' as const,
  },
  {
    id: '4',
    name: 'James Wilson',
    reliabilityScore: 78,
    eventsHosted: 8,
    sports: ['Pickleball'],
    type: 'friend' as const,
  },
  {
    id: '5',
    name: 'Lisa Park',
    reliabilityScore: 65,
    eventsHosted: 5,
    sports: ['Table Tennis', 'Badminton'],
    type: 'friend' as const,
  },
  {
    id: '6',
    name: 'Bay Area Tennis Club',
    reliabilityScore: 0,
    members: 45,
    sports: ['Tennis'],
    type: 'group' as const,
  },
  {
    id: '7',
    name: 'Pickleball Enthusiasts',
    reliabilityScore: 0,
    members: 32,
    sports: ['Pickleball'],
    type: 'group' as const,
  },
];

type User = (typeof MOCK_USERS)[number];

interface AddCohostsModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSave: (cohosts: User[]) => void;
  initialSelected?: User[];
}

type FilterType = 'all' | 'friends' | 'groups';

export default function AddCohostsModal({
  visible,
  onDismiss,
  onSave,
  initialSelected = [],
}: AddCohostsModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [selectedCohosts, setSelectedCohosts] =
    useState<User[]>(initialSelected);
  const [loading, setLoading] = useState(false);
  const [addedUsers, setAddedUsers] = useState<Set<string>>(new Set());

  // Reset state when modal opens
  useEffect(() => {
    if (visible) {
      setSearchQuery('');
      setSelectedFilter('all');
      setSelectedCohosts(initialSelected);
      setAddedUsers(new Set());
      // Simulate loading
      setLoading(true);
      setTimeout(() => setLoading(false), 500);
    }
  }, [visible, initialSelected]);

  // Filter and search users with debounce simulation
  const filteredUsers = useMemo(() => {
    let users = MOCK_USERS;

    // Filter by type
    if (selectedFilter === 'friends') {
      users = users.filter(u => u.type === 'friend');
    } else if (selectedFilter === 'groups') {
      users = users.filter(u => u.type === 'group');
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      users = users.filter(u => u.name.toLowerCase().includes(query));
    }

    // Remove already selected users
    const selectedIds = new Set(selectedCohosts.map(c => c.id));
    users = users.filter(u => !selectedIds.has(u.id));

    // Sort by reliability (friends only, groups have 0)
    return users.sort((a, b) => {
      if (a.type === 'friend' && b.type === 'friend') {
        return b.reliabilityScore - a.reliabilityScore;
      }
      return 0;
    });
  }, [searchQuery, selectedFilter, selectedCohosts]);

  const getReliabilityColor = (score: number) => {
    if (score >= 85) return '#10B981'; // Green
    if (score >= 70) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleAddCohost = (user: User) => {
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

  const renderUserItem = ({ item }: { item: User }) => {
    const isAdded = addedUsers.has(item.id);

    return (
      <Pressable
        style={styles.userItem}
        onPress={() => handleAddCohost(item)}
        disabled={maxReached || isAdded}
        accessibilityRole="button"
        accessibilityLabel={
          item.type === 'friend'
            ? `${item.name}, ${item.reliabilityScore} percent reliable, ${item.eventsHosted} events hosted, add as cohost button`
            : `${item.name}, group with ${item.members} members, add as cohost button`
        }
      >
        <Avatar.Text
          size={48}
          label={item.type === 'friend' ? getInitials(item.name) : ''}
          style={[styles.avatar, item.type === 'group' && styles.groupAvatar]}
          labelStyle={styles.avatarLabel}
        />

        <View style={styles.userInfo}>
          <View style={styles.userHeader}>
            <Text variant="bodyLarge" style={styles.userName}>
              {item.name}
            </Text>
            {item.type === 'friend' && (
              <Text
                variant="bodyMedium"
                style={[
                  styles.reliability,
                  { color: getReliabilityColor(item.reliabilityScore) },
                ]}
              >
                {item.reliabilityScore}%
              </Text>
            )}
          </View>

          <Text variant="bodySmall" style={styles.userMeta}>
            {item.type === 'friend'
              ? `${item.eventsHosted} events hosted • ${item.sports.join(', ')}`
              : `${item.members} members • ${item.sports.join(', ')}`}
          </Text>
        </View>

        <Button
          mode="contained"
          compact
          onPress={() => handleAddCohost(item)}
          disabled={maxReached || isAdded}
          style={[styles.addButton, isAdded && styles.addedButton]}
          labelStyle={styles.addButtonLabel}
        >
          {isAdded ? (
            <>
              <Icon name="check" size={14} color="#fff" /> Added
            </>
          ) : (
            'Add'
          )}
        </Button>
      </Pressable>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="account-search" size={64} color="#9CA3AF" />
      <Text variant="titleMedium" style={styles.emptyTitle}>
        No users found
      </Text>
      <Text variant="bodyMedium" style={styles.emptySubtitle}>
        Try different keywords or filters
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

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleCancel}
        contentContainerStyle={styles.modalContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text variant="titleLarge" style={styles.title}>
            Add Cohosts
          </Text>
          <IconButton
            icon="close"
            size={24}
            onPress={handleCancel}
            accessibilityLabel="Close dialog"
          />
        </View>

        {/* Search Input */}
        <TextInput
          mode="outlined"
          placeholder="Search by name, location, or sport"
          value={searchQuery}
          onChangeText={setSearchQuery}
          left={<TextInput.Icon icon="magnify" />}
          style={styles.searchInput}
          accessibilityLabel="Search for cohosts"
        />

        {/* Filter Chips */}
        <View style={styles.filterRow}>
          <Chip
            selected={selectedFilter === 'all'}
            onPress={() => setSelectedFilter('all')}
            style={styles.filterChip}
            accessibilityRole="radio"
            accessibilityState={{ selected: selectedFilter === 'all' }}
          >
            All
          </Chip>
          <Chip
            selected={selectedFilter === 'friends'}
            onPress={() => setSelectedFilter('friends')}
            style={styles.filterChip}
            accessibilityRole="radio"
            accessibilityState={{ selected: selectedFilter === 'friends' }}
          >
            Friends
          </Chip>
          <Chip
            selected={selectedFilter === 'groups'}
            onPress={() => setSelectedFilter('groups')}
            style={styles.filterChip}
            accessibilityRole="radio"
            accessibilityState={{ selected: selectedFilter === 'groups' }}
          >
            Groups
          </Chip>
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
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.selectedScroll}
              contentContainerStyle={styles.selectedContent}
            >
              {selectedCohosts.map(cohost => (
                <Chip
                  key={cohost.id}
                  onClose={() => handleRemoveCohost(cohost.id)}
                  style={styles.selectedChip}
                  accessibilityLabel={`${cohost.name}, ${
                    cohost.type === 'friend'
                      ? `${cohost.reliabilityScore} percent reliable`
                      : 'group'
                  }, remove button`}
                >
                  {cohost.name}
                  {cohost.type === 'friend' && (
                    <Text
                      style={[
                        styles.cohostReliability,
                        { color: getReliabilityColor(cohost.reliabilityScore) },
                      ]}
                    >
                      {' '}
                      {cohost.reliabilityScore}%
                    </Text>
                  )}
                </Chip>
              ))}
            </ScrollView>
          </>
        )}

        {/* Helper Text */}
        <Text
          variant="bodySmall"
          style={[styles.helperText, maxReached && styles.helperTextError]}
        >
          {maxReached ? 'Maximum cohosts reached' : 'Max 5 cohosts'}
        </Text>

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
            onPress={handleDone}
            disabled={selectedCohosts.length === 0}
            style={styles.doneButton}
            accessibilityLabel={`Done, ${selectedCohosts.length} cohosts selected`}
          >
            Done {selectedCohosts.length > 0 && `(${selectedCohosts.length})`}
          </Button>
        </View>
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
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
  },
  searchInput: {
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  filterChip: {
    marginRight: 8,
  },
  sectionHeader: {
    color: '#6B7280',
    marginBottom: 8,
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
    minHeight: 200,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 72,
    backgroundColor: 'white',
  },
  avatar: {
    backgroundColor: '#3B82F6',
  },
  groupAvatar: {
    backgroundColor: '#10B981',
  },
  avatarLabel: {
    color: 'white',
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  userName: {
    fontWeight: '600',
    flex: 1,
  },
  reliability: {
    fontWeight: 'bold',
    marginLeft: 8,
  },
  userMeta: {
    color: '#6B7280',
  },
  addButton: {
    minWidth: 60,
    height: 36,
  },
  addedButton: {
    backgroundColor: '#10B981',
  },
  addButtonLabel: {
    fontSize: 12,
    lineHeight: 14,
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
    marginVertical: 16,
  },
  selectedScroll: {
    maxHeight: 80,
    marginBottom: 12,
  },
  selectedContent: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 8,
  },
  selectedChip: {
    marginRight: 8,
  },
  cohostReliability: {
    fontSize: 12,
    marginLeft: 4,
  },
  helperText: {
    textAlign: 'center',
    color: '#6B7280',
    marginBottom: 16,
  },
  helperTextError: {
    color: '#EF4444',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  cancelButton: {
    flex: 1,
  },
  doneButton: {
    flex: 1,
  },
});
