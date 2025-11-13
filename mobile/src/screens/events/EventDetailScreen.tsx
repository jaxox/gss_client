/**
 * EventDetailScreen - Event Detail View with RSVP
 * Displays complete event information and RSVP button
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  Text,
  Button,
  Chip,
  Divider,
  useTheme,
  Avatar,
} from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  getEvent,
  createRSVP,
  cancelRSVP,
  getMyRSVPs,
} from '../../store/events/eventsSlice';

interface EventDetailScreenProps {
  route: {
    params: {
      eventId: string;
    };
  };
  navigation: any;
}

export default function EventDetailScreen({
  route,
  navigation,
}: EventDetailScreenProps) {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { eventId } = route.params;

  const { currentEvent, loading, error, myRSVPs, user } = useAppSelector(
    state => ({
      currentEvent: state.events.currentEvent,
      loading: state.events.loading,
      error: state.events.error,
      myRSVPs: state.events.myRSVPs,
      user: state.auth.user,
    }),
  );

  const [isRSVPing, setIsRSVPing] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Check if user has RSVP'd to this event
  const userHasRSVPd = myRSVPs.some(event => event.id === eventId);

  useEffect(() => {
    dispatch(getEvent(eventId));
    if (user?.id) {
      dispatch(getMyRSVPs(user.id));
    }
  }, [dispatch, eventId, user?.id]);

  if (loading.fetch || !currentEvent) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading event...</Text>
      </View>
    );
  }

  if (error.fetch) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error loading event</Text>
        <Text style={styles.errorMessage}>{error.fetch}</Text>
        <Button mode="contained" onPress={() => dispatch(getEvent(eventId))}>
          Retry
        </Button>
      </View>
    );
  }

  const event = currentEvent; // EventDetailView already extends Event
  const participantCount = event.participantCount || 0;
  const capacity = event.capacity;
  const isFull = participantCount >= capacity;
  const depositAmount = event.depositAmount || 0;
  const isFree = depositAmount === 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCancelRSVP = async () => {
    Alert.alert(
      'Cancel RSVP',
      'Are you sure you want to cancel your RSVP? This cannot be undone.',
      [
        { text: 'No, Keep RSVP', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            setIsCancelling(true);
            try {
              await dispatch(cancelRSVP({ eventId })).unwrap();
              Alert.alert(
                'RSVP Cancelled',
                'Your RSVP has been cancelled successfully.',
              );
              // Refresh event details and RSVPs
              dispatch(getEvent(eventId));
              if (user?.id) {
                dispatch(getMyRSVPs(user.id));
              }
            } catch (err: any) {
              Alert.alert('Cancel Failed', err.message || 'Please try again');
            } finally {
              setIsCancelling(false);
            }
          },
        },
      ],
    );
  };

  const handleRSVP = async () => {
    if (isFull) {
      Alert.alert('Event Full', 'This event is at capacity.');
      return;
    }

    if (isFree) {
      // Show confirmation dialog for free events
      Alert.alert(
        'Confirm RSVP',
        `Are you sure you want to RSVP to "${event.title}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Confirm',
            onPress: async () => {
              setIsRSVPing(true);
              try {
                await dispatch(
                  createRSVP({
                    eventId: event.id,
                  }),
                ).unwrap();

                Alert.alert('Success!', "You're registered for this event!", [
                  {
                    text: 'View My RSVPs',
                    onPress: () => navigation.navigate('MyRSVPs'),
                  },
                  { text: 'OK' },
                ]);
                // Refresh RSVPs list
                if (user?.id) {
                  dispatch(getMyRSVPs(user.id));
                }
              } catch (err: any) {
                Alert.alert('RSVP Failed', err.message || 'Please try again');
              } finally {
                setIsRSVPing(false);
              }
            },
          },
        ],
      );
    } else {
      // Navigate to payment flow for deposit events
      navigation.navigate('RSVPPayment', {
        eventId: event.id,
        depositAmount,
        eventTitle: event.title,
      });
    }
  };

  const getRSVPButtonLabel = () => {
    if (isFull) return 'Event Full';
    if (isFree) return 'RSVP (Free)';
    return `RSVP ($${(depositAmount / 100).toFixed(0)})`;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Event Header */}
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          {event.title}
        </Text>

        <View style={styles.sportRow}>
          <Text variant="titleMedium">
            {event.sport?.icon} {event.sport?.name}
          </Text>
        </View>

        {isFull && (
          <Chip
            icon="alert-circle"
            style={[
              styles.fullChip,
              { backgroundColor: theme.colors.errorContainer },
            ]}
            textStyle={{ color: theme.colors.error }}
          >
            Event Full
          </Chip>
        )}
      </View>

      <Divider />

      {/* Date & Time */}
      <View style={styles.section}>
        <Text variant="titleSmall" style={styles.sectionTitle}>
          📅 Date & Time
        </Text>
        <Text variant="bodyLarge">{formatDate(event.dateTime)}</Text>
        <Text variant="bodyLarge">{formatTime(event.dateTime)}</Text>
      </View>

      <Divider />

      {/* Location */}
      <View style={styles.section}>
        <Text variant="titleSmall" style={styles.sectionTitle}>
          📍 Location
        </Text>
        {event.location.venueName && (
          <Text variant="bodyLarge">{event.location.venueName}</Text>
        )}
        <Text variant="bodyMedium" style={styles.locationDetails}>
          {event.location.address}
        </Text>
        <Text variant="bodyMedium" style={styles.locationDetails}>
          {event.location.city}, {event.location.state} {event.location.zipCode}
        </Text>
        {/* TODO: Add map view with react-native-maps */}
      </View>

      <Divider />

      {/* Description */}
      <View style={styles.section}>
        <Text variant="titleSmall" style={styles.sectionTitle}>
          📝 Description
        </Text>
        <Text variant="bodyMedium" numberOfLines={4}>
          {event.description}
        </Text>
      </View>

      <Divider />

      {/* Capacity */}
      <View style={styles.section}>
        <Text variant="titleSmall" style={styles.sectionTitle}>
          👥 Participants
        </Text>
        <Text variant="bodyLarge">
          {participantCount} / {capacity} spots filled
        </Text>
        {/* TODO: Show participant avatars when backend provides participant list */}
      </View>

      {/* Host Info */}
      {currentEvent.host && (
        <>
          <Divider />
          <View style={styles.section}>
            <Text variant="titleSmall" style={styles.sectionTitle}>
              🏠 Host
            </Text>
            <View style={styles.hostRow}>
              <Avatar.Text
                size={40}
                label={currentEvent.host.displayName
                  .substring(0, 2)
                  .toUpperCase()}
              />
              <View style={styles.hostInfo}>
                <Text variant="bodyLarge">{currentEvent.host.displayName}</Text>
                <Text variant="bodySmall" style={styles.hostEmail}>
                  {currentEvent.host.email}
                </Text>
              </View>
            </View>
          </View>
        </>
      )}

      <Divider />

      {/* Deposit Info */}
      {!isFree && (
        <View style={styles.section}>
          <Text variant="titleSmall" style={styles.sectionTitle}>
            💰 Deposit
          </Text>
          <Text variant="bodyMedium">
            ${(depositAmount / 100).toFixed(2)} deposit required
          </Text>
          <Text variant="bodySmall" style={styles.depositNote}>
            This is an authorization only. You'll only be charged if you don't
            check in.
          </Text>
        </View>
      )}

      {/* RSVP / Cancel RSVP Buttons */}
      <View style={styles.rsvpContainer}>
        {userHasRSVPd ? (
          <>
            <Chip
              icon="check-circle"
              style={styles.rsvpConfirmedChip}
              textStyle={styles.rsvpConfirmedText}
            >
              You're Registered
            </Chip>
            <Button
              mode="outlined"
              onPress={handleCancelRSVP}
              disabled={isCancelling}
              loading={isCancelling}
              style={styles.cancelButton}
              contentStyle={styles.rsvpButtonContent}
              textColor={theme.colors.error}
            >
              Cancel RSVP
            </Button>
          </>
        ) : (
          <Button
            mode="contained"
            onPress={handleRSVP}
            disabled={isFull || isRSVPing}
            loading={isRSVPing}
            style={styles.rsvpButton}
            contentStyle={styles.rsvpButtonContent}
          >
            {getRSVPButtonLabel()}
          </Button>
        )}
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#d32f2f',
  },
  errorMessage: {
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  header: {
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sportRow: {
    marginBottom: 8,
  },
  fullChip: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  locationDetails: {
    color: '#666',
    marginTop: 4,
  },
  hostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  hostInfo: {
    marginLeft: 12,
  },
  hostEmail: {
    color: '#666',
  },
  depositNote: {
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  rsvpContainer: {
    padding: 16,
    paddingTop: 24,
  },
  rsvpButton: {
    borderRadius: 8,
  },
  rsvpButtonContent: {
    paddingVertical: 8,
  },
  rsvpConfirmedChip: {
    alignSelf: 'center',
    backgroundColor: '#4caf5020',
    marginBottom: 16,
  },
  rsvpConfirmedText: {
    color: '#4caf50',
    fontWeight: 'bold',
  },
  cancelButton: {
    borderRadius: 8,
    borderColor: '#d32f2f',
  },
  bottomPadding: {
    height: 24,
  },
});
