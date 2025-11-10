/**
 * My Events Screen
 * Display user's hosted events with management options
 */

import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import {
  Text,
  Card,
  Button,
  Chip,
  ActivityIndicator,
  FAB,
  useTheme,
  Portal,
  Dialog,
  Paragraph,
} from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  getMyEvents,
  deleteEvent,
  clearError,
} from '../../store/events/eventsSlice';
import type { Event } from '@shared/types/event.types';

export default function MyEventsScreen() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [cancelDialogVisible, setCancelDialogVisible] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const {
    myEvents,
    loading,
    error,
    deleteLoading,
    deleteError,
    deleteSuccess,
    user,
  } = useAppSelector(state => ({
    myEvents: state.events.myEvents,
    loading: state.events.loading.fetch,
    error: state.events.error.fetch,
    deleteLoading: state.events.loading.delete,
    deleteError: state.events.error.delete,
    deleteSuccess: state.events.success.delete,
    user: state.auth.user,
  }));

  const loadEvents = useCallback(() => {
    if (user?.id) {
      dispatch(getMyEvents(user.id));
    }
  }, [user?.id, dispatch]);

  useEffect(() => {
    if (user?.id) {
      loadEvents();
    }
  }, [user?.id, loadEvents]);

  useEffect(() => {
    if (deleteSuccess) {
      setCancelDialogVisible(false);
      setSelectedEventId(null);
      loadEvents();
      dispatch(clearError('delete'));
    }
  }, [deleteSuccess, loadEvents, dispatch]);

  const handleRefresh = () => {
    loadEvents();
  };

  const handleCreateEvent = () => {
    // TODO: Navigate to CreateEventScreen
    console.log('Navigate to create event');
  };

  const handleEventPress = (eventId: string) => {
    // TODO: Navigate to event detail
    console.log('Navigate to event:', eventId);
  };

  const handleEditEvent = (eventId: string) => {
    // TODO: Navigate to CreateEventScreen with event data
    console.log('Edit event:', eventId);
  };

  const handleCancelEvent = (eventId: string) => {
    setSelectedEventId(eventId);
    setCancelDialogVisible(true);
  };

  const confirmCancelEvent = () => {
    if (selectedEventId) {
      dispatch(deleteEvent(selectedEventId));
    }
  };

  const closeCancelDialog = () => {
    setCancelDialogVisible(false);
    setSelectedEventId(null);
  };

  const getEventStatus = (event: Event): string => {
    const now = new Date();
    const eventDate = new Date(event.dateTime);

    if (event.status === 'cancelled') return 'Cancelled';
    if (eventDate < now) return 'Completed';
    return 'Upcoming';
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Upcoming':
        return theme.colors.primary;
      case 'Completed':
        return theme.colors.outline;
      case 'Cancelled':
        return theme.colors.error;
      default:
        return theme.colors.outline;
    }
  };

  const renderEventCard = ({ item: event }: { item: Event }) => {
    const status = getEventStatus(event);
    const participantCount = event.participantCount || 0;
    const capacity = event.capacity;
    const isFull = participantCount >= capacity;

    return (
      <Card style={styles.card} onPress={() => handleEventPress(event.id)}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text variant="titleLarge" style={styles.eventTitle}>
              {event.title}
            </Text>
            <Chip
              textStyle={{ color: getStatusColor(status) }}
              style={[
                styles.statusChip,
                { borderColor: getStatusColor(status) },
              ]}
              mode="outlined"
            >
              {status}
            </Chip>
          </View>

          <Text variant="bodyMedium" style={styles.sportText}>
            {event.sport?.icon} {event.sport?.name}
          </Text>

          <Text variant="bodySmall" style={styles.dateText}>
            📅 {new Date(event.dateTime).toLocaleDateString()} at{' '}
            {new Date(event.dateTime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>

          <Text variant="bodySmall" style={styles.locationText}>
            📍 {event.location.city}, {event.location.state}
          </Text>

          <View style={styles.statsRow}>
            <Chip icon="account-group" compact>
              {participantCount}/{capacity} {isFull && '(Full)'}
            </Chip>
            {event.depositAmount > 0 && (
              <Chip icon="cash" compact>
                ${(event.depositAmount / 100).toFixed(2)}
              </Chip>
            )}
            <Chip
              icon={event.visibility === 'public' ? 'earth' : 'lock'}
              compact
            >
              {event.visibility === 'public' ? 'Public' : 'Private'}
            </Chip>
          </View>
        </Card.Content>
        <Card.Actions>
          <Button mode="outlined" onPress={() => handleEventPress(event.id)}>
            View Details
          </Button>
          {status === 'Upcoming' && (
            <>
              <Button mode="text" onPress={() => handleEditEvent(event.id)}>
                Edit
              </Button>
              <Button
                mode="text"
                onPress={() => handleCancelEvent(event.id)}
                textColor={theme.colors.error}
              >
                Cancel
              </Button>
            </>
          )}
        </Card.Actions>
      </Card>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text variant="headlineSmall" style={styles.emptyTitle}>
        No Events Yet
      </Text>
      <Text variant="bodyMedium" style={styles.emptyText}>
        Create your first event to get started!
      </Text>
      <Button
        mode="contained"
        onPress={handleCreateEvent}
        style={styles.emptyButton}
      >
        Create Event
      </Button>
    </View>
  );

  if (loading && myEvents.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text variant="bodyLarge" style={styles.loadingText}>
          Loading your events...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && (
        <Card
          style={[
            styles.errorCard,
            { backgroundColor: theme.colors.errorContainer },
          ]}
        >
          <Card.Content>
            <Text style={{ color: theme.colors.error }}>{error}</Text>
          </Card.Content>
        </Card>
      )}

      <FlatList
        data={myEvents}
        renderItem={renderEventCard}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.listContent,
          myEvents.length === 0 && styles.emptyListContent,
        ]}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleCreateEvent}
        label="Create Event"
      />

      <Portal>
        <Dialog visible={cancelDialogVisible} onDismiss={closeCancelDialog}>
          <Dialog.Title>Cancel Event</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Are you sure you want to cancel this event? All participants will
              be notified and their deposits will be refunded. This action
              cannot be undone.
            </Paragraph>
            {deleteError && (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                Error: {deleteError}
              </Text>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={closeCancelDialog} disabled={deleteLoading}>
              No, Keep Event
            </Button>
            <Button
              onPress={confirmCancelEvent}
              loading={deleteLoading}
              disabled={deleteLoading}
              textColor={theme.colors.error}
            >
              Yes, Cancel Event
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
  },
  errorCard: {
    margin: 16,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  emptyListContent: {
    flex: 1,
  },
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventTitle: {
    flex: 1,
    marginRight: 8,
    fontWeight: 'bold',
  },
  statusChip: {
    height: 28,
  },
  sportText: {
    marginBottom: 4,
    fontWeight: '600',
  },
  dateText: {
    marginBottom: 4,
    color: '#666',
  },
  locationText: {
    marginBottom: 12,
    color: '#666',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  emptyText: {
    marginBottom: 24,
    color: '#666',
    textAlign: 'center',
  },
  emptyButton: {
    minWidth: 200,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  errorText: {
    marginTop: 8,
  },
});
