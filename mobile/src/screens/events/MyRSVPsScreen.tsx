/**
 * MyRSVPsScreen - User's RSVP Management
 * Displays list of user's confirmed RSVPs with status badges and management options
 */

import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import {
  Text,
  Card,
  Chip,
  ActivityIndicator,
  useTheme,
  Button,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getMyRSVPs } from '../../store/events/eventsSlice';
import type { Event } from '@shared/types/event.types';

export default function MyRSVPsScreen({ navigation }: any) {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const { myRSVPs, loading, error, user } = useAppSelector(state => ({
    myRSVPs: state.events.myRSVPs,
    loading: state.events.loading.fetch,
    error: state.events.error.fetch,
    user: state.auth.user,
  }));

  const loadRSVPs = useCallback(() => {
    if (user?.id) {
      dispatch(getMyRSVPs(user.id));
    }
  }, [user?.id, dispatch]);

  useEffect(() => {
    loadRSVPs();
  }, [loadRSVPs]);

  const handleRefresh = () => {
    loadRSVPs();
  };

  const handleEventPress = (eventId: string) => {
    navigation.navigate('EventDetail', { eventId });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (event: Event) => {
    const eventDate = new Date(event.dateTime);
    const now = new Date();
    const isPastEvent = eventDate < now;

    // Note: check-in status and cancellation would come from RSVP object
    // For now, simplified logic based on event date
    if (isPastEvent) {
      // Placeholder: would check actual check-in status from backend
      return {
        label: 'Completed',
        color: theme.colors.primary,
        icon: 'check-circle',
      };
    }

    return {
      label: 'Confirmed',
      color: '#4caf50',
      icon: 'calendar-check',
    };
  };

  const renderRSVPCard = ({ item: event }: { item: Event }) => {
    const status = getStatusBadge(event);
    const depositAmount = event.depositAmount || 0;
    const isFree = depositAmount === 0;

    return (
      <Card style={styles.card} onPress={() => handleEventPress(event.id)}>
        <Card.Content>
          {/* Header Row */}
          <View style={styles.cardHeader}>
            <View style={styles.headerLeft}>
              <Text variant="titleMedium" style={styles.eventTitle}>
                {event.title}
              </Text>
              <Chip
                icon={status.icon}
                style={[
                  styles.statusChip,
                  { backgroundColor: status.color + '20' },
                ]}
                textStyle={{ color: status.color }}
                compact
              >
                {status.label}
              </Chip>
            </View>
          </View>

          {/* Sport */}
          <View style={styles.infoRow}>
            <Text style={styles.sportIcon}>{event.sport?.icon || '⚽'}</Text>
            <Text variant="bodyMedium" style={styles.infoText}>
              {event.sport?.name || 'Sport'}
            </Text>
          </View>

          {/* Date & Time */}
          <View style={styles.infoRow}>
            <Icon name="calendar" size={20} color="#666" />
            <Text variant="bodyMedium" style={styles.infoText}>
              {formatDate(event.dateTime)} at {formatTime(event.dateTime)}
            </Text>
          </View>

          {/* Location */}
          <View style={styles.infoRow}>
            <Icon name="map-marker" size={20} color="#666" />
            <Text variant="bodyMedium" style={styles.infoText}>
              {event.location.city}, {event.location.state}
            </Text>
          </View>

          {/* Deposit Status */}
          {!isFree && (
            <View style={[styles.infoRow, styles.depositRow]}>
              <Icon name="credit-card-check" size={20} color="#1976d2" />
              <Text variant="bodySmall" style={styles.depositText}>
                ${(depositAmount / 100).toFixed(2)} Authorized - Refundable on
                check-in
              </Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <Button
              mode="outlined"
              onPress={() => handleEventPress(event.id)}
              style={styles.actionButton}
              compact
            >
              View Details
            </Button>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="calendar-remove" size={80} color="#ccc" />
      <Text variant="headlineSmall" style={styles.emptyTitle}>
        No RSVPs Yet
      </Text>
      <Text variant="bodyMedium" style={styles.emptyText}>
        You have not RSVP'd to any events yet.
      </Text>
      <Text variant="bodyMedium" style={styles.emptyText}>
        Browse events and RSVP to join!
      </Text>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Events')}
        style={styles.browseButton}
        icon="magnify"
      >
        Browse Events
      </Button>
    </View>
  );

  if (loading && myRSVPs.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading your RSVPs...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Icon name="alert-circle" size={60} color={theme.colors.error} />
        <Text variant="titleMedium" style={styles.errorTitle}>
          Failed to Load RSVPs
        </Text>
        <Text variant="bodyMedium" style={styles.errorText}>
          {error}
        </Text>
        <Button mode="contained" onPress={loadRSVPs} style={styles.retryButton}>
          Try Again
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={myRSVPs}
        renderItem={renderRSVPCard}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.listContainer,
          myRSVPs.length === 0 && styles.emptyListContainer,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
          />
        }
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
  },
  errorTitle: {
    marginTop: 16,
    marginBottom: 8,
    color: '#d32f2f',
    textAlign: 'center',
  },
  errorText: {
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 8,
  },
  listContainer: {
    padding: 16,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  eventTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sportIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  infoText: {
    marginLeft: 8,
    color: '#666',
  },
  depositRow: {
    backgroundColor: '#e3f2fd',
    padding: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  depositText: {
    marginLeft: 8,
    color: '#1976d2',
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    marginTop: 24,
    marginBottom: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  browseButton: {
    marginTop: 24,
  },
});
