/**
 * EventCard Component
 * Reusable event card for displaying event summary in lists
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Chip, useTheme } from 'react-native-paper';
import type { Event } from '@shared/types/event.types';

interface EventCardProps {
  event: Event;
  onPress: (eventId: string) => void;
  showDistance?: boolean;
  distance?: number | null; // in kilometers
}

export default function EventCard({
  event,
  onPress,
  showDistance = false,
  distance,
}: EventCardProps) {
  const theme = useTheme();

  const participantCount = event.participantCount || 0;
  const capacity = event.capacity;
  const isFull = participantCount >= capacity;

  const formatDistance = (dist: number | null): string => {
    if (!dist) return '';
    if (dist < 1) return `${(dist * 1000).toFixed(0)}m away`;
    return `${dist.toFixed(1)}km away`;
  };

  return (
    <Card style={styles.card} onPress={() => onPress(event.id)}>
      <Card.Content>
        <View style={styles.header}>
          <Text variant="titleMedium" style={styles.title} numberOfLines={2}>
            {event.title}
          </Text>
          {isFull && (
            <Chip
              textStyle={{ color: theme.colors.error }}
              style={[styles.fullChip, { borderColor: theme.colors.error }]}
              mode="outlined"
              compact
            >
              Full
            </Chip>
          )}
        </View>

        <Text variant="bodyMedium" style={styles.sport}>
          {event.sport?.icon} {event.sport?.name}
        </Text>

        <Text variant="bodySmall" style={styles.date}>
          📅 {new Date(event.dateTime).toLocaleDateString()} at{' '}
          {new Date(event.dateTime).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>

        <View style={styles.locationRow}>
          <Text variant="bodySmall" style={styles.location}>
            📍 {event.location.city}, {event.location.state}
          </Text>
          {showDistance && distance !== null && distance !== undefined && (
            <Text variant="bodySmall" style={styles.distance}>
              {formatDistance(distance)}
            </Text>
          )}
        </View>

        <View style={styles.statsRow}>
          <Chip icon="account-group" compact style={styles.chip}>
            {participantCount}/{capacity}
          </Chip>
          {event.depositAmount > 0 && (
            <Chip icon="cash" compact style={styles.chip}>
              ${(event.depositAmount / 100).toFixed(0)}
            </Chip>
          )}
          {event.depositAmount === 0 && (
            <Chip icon="check-circle" compact style={styles.chip}>
              Free
            </Chip>
          )}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontWeight: 'bold',
    marginRight: 8,
  },
  fullChip: {
    height: 24,
  },
  sport: {
    marginBottom: 4,
    color: '#555',
  },
  date: {
    marginBottom: 4,
    color: '#666',
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    flex: 1,
    color: '#666',
  },
  distance: {
    color: '#888',
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  chip: {
    marginRight: 4,
  },
});
