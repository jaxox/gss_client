/**
 * EventsScreen - Event Discovery and Browse
 * Displays nearby public events with search and filters
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {
  Searchbar,
  FAB,
  Text,
  useTheme,
  Chip,
  Button,
} from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { searchEvents } from '../../store/events/eventsSlice';
import EventCard from '../../components/events/EventCard';
import type { EventFilterRequest } from '@shared/types/event.types';

export default function EventsScreen({ navigation }: any) {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const { searchResults, loading, error } = useAppSelector(
    state => state.events,
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Common sports for quick filter
  const sports = [
    { id: 'basketball', name: 'Basketball', icon: '🏀' },
    { id: 'soccer', name: 'Soccer', icon: '⚽' },
    { id: 'tennis', name: 'Tennis', icon: '🎾' },
    { id: 'volleyball', name: 'Volleyball', icon: '🏐' },
    { id: 'running', name: 'Running', icon: '🏃' },
  ];

  const fetchEvents = useCallback(async () => {
    const searchRequest: EventFilterRequest = {
      page: 1,
      limit: 20,
    };

    if (selectedSport) {
      searchRequest.sportIds = [selectedSport];
    }

    // Note: Location filtering requires geolocation permission
    // For now, we'll implement basic search
    // TODO: Add geolocation support and text search in future iteration

    await dispatch(searchEvents(searchRequest));
  }, [dispatch, selectedSport]);

  // Fetch events on mount and when filters change
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement text search when backend supports it
  };

  const handleSearchSubmit = () => {
    // TODO: Implement text search when backend supports it
    fetchEvents();
  };

  const handleEventPress = (eventId: string) => {
    navigation.navigate('EventDetail', { eventId });
  };

  const handleCreateEvent = () => {
    navigation.navigate('CreateEvent');
  };

  const toggleSportFilter = (sportId: string) => {
    setSelectedSport(current => (current === sportId ? null : sportId));
  };

  const renderEventCard = ({ item }: { item: any }) => (
    <EventCard
      event={item}
      onPress={handleEventPress}
      showDistance={false} // TODO: Enable when geolocation added
      distance={null}
    />
  );

  const renderEmptyState = () => {
    if (loading.search) {
      return null;
    }

    return (
      <View style={styles.emptyContainer}>
        <Text variant="headlineSmall" style={styles.emptyTitle}>
          {searchQuery || selectedSport
            ? 'No events found'
            : 'No events nearby'}
        </Text>
        <Text variant="bodyMedium" style={styles.emptyText}>
          {searchQuery || selectedSport
            ? 'Try adjusting your search or filters'
            : 'Be the first to create an event!'}
        </Text>
        <Button
          mode="contained"
          onPress={handleCreateEvent}
          style={styles.createButton}
        >
          Create Event
        </Button>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Searchbar
        placeholder="Search events..."
        onChangeText={handleSearch}
        value={searchQuery}
        onSubmitEditing={handleSearchSubmit}
        style={styles.searchbar}
      />

      <View style={styles.filtersRow}>
        {sports.map(sport => (
          <Chip
            key={sport.id}
            selected={selectedSport === sport.id}
            onPress={() => toggleSportFilter(sport.id)}
            style={styles.sportChip}
            textStyle={styles.chipText}
          >
            {sport.icon} {sport.name}
          </Chip>
        ))}
      </View>

      {error.search && (
        <View style={styles.errorBanner}>
          <Text style={{ color: theme.colors.error }}>{error.search}</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={searchResults}
        renderItem={renderEventCard}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
          />
        }
        contentContainerStyle={
          searchResults.length === 0 ? styles.emptyListContent : undefined
        }
      />

      {loading.search && !refreshing && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={handleCreateEvent}
        label="Create Event"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchbar: {
    elevation: 0,
    backgroundColor: '#f5f5f5',
    marginBottom: 12,
  },
  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sportChip: {
    marginBottom: 4,
  },
  chipText: {
    fontSize: 12,
  },
  errorBanner: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#ffebee',
    borderRadius: 4,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    minHeight: 400,
  },
  emptyTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
  },
  createButton: {
    marginTop: 8,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
