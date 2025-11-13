import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Avatar, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export interface CoHostUser {
  id: string;
  name: string;
  level: number;
  xp: number;
  reliability: number;
  eventsHosted?: number;
  sports?: string[];
  type?: 'friend';
}

interface CoHostCardProps {
  user: CoHostUser;
  onPress?: () => void;
  actionButton?: {
    label: React.ReactNode;
    mode: 'contained' | 'outlined';
    onPress: () => void;
    disabled?: boolean;
    textColor?: string;
    style?: any;
  };
  // Convenience prop for Remove button (simplified API)
  onRemove?: () => void;
  backgroundColor?: string;
  disabled?: boolean;
  accessibilityLabel?: string;
}

export default function CoHostCard({
  user,
  onPress,
  actionButton,
  onRemove,
  backgroundColor = 'white',
  disabled = false,
  accessibilityLabel,
}: CoHostCardProps) {
  const getReliabilityColor = (rate: number) => {
    if (rate >= 85) return '#10B981'; // Green - Reliable
    if (rate >= 70) return '#F59E0B'; // Yellow - Decent
    return '#EF4444'; // Red - Unreliable
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const defaultAccessibilityLabel = `${user.name}, Level ${user.level}, ${user.xp} XP, ${user.reliability} percent reliability`;

  // If onRemove is provided, create a standard Remove button
  const finalActionButton = onRemove
    ? {
        label: <Icon name="account-minus" size={16} color="#EF4444" />,
        mode: 'outlined' as const,
        onPress: onRemove,
        disabled: false,
        textColor: '#EF4444',
        style: styles.removeButton,
      }
    : actionButton;

  return (
    <Pressable
      style={[styles.card, { backgroundColor }]}
      onPress={onPress}
      disabled={disabled || !onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || defaultAccessibilityLabel}
    >
      <Avatar.Text
        size={40}
        label={getInitials(user.name)}
        style={styles.avatar}
        labelStyle={styles.avatarLabel}
      />

      <View style={styles.userInfo}>
        {/* Name on first line */}
        <Text variant="bodyMedium" style={styles.userName}>
          {user.name}
        </Text>

        {/* Level, XP & Reliability on second line */}
        <View style={styles.statsRow}>
          <View style={styles.levelBadge}>
            <Text variant="labelSmall" style={styles.levelText}>
              Lvl.{user.level}
            </Text>
          </View>
          <Text variant="bodySmall" style={styles.xpText}>
            {user.xp.toLocaleString()} XP
          </Text>
          <Text variant="bodySmall" style={styles.xpText}>
            •
          </Text>
          <Text
            variant="bodySmall"
            style={[
              styles.reliabilityText,
              { color: getReliabilityColor(user.reliability) },
            ]}
          >
            {user.reliability}% Reliability
          </Text>
        </View>
      </View>

      {finalActionButton && (
        <Button
          mode={finalActionButton.mode}
          compact
          onPress={finalActionButton.onPress}
          disabled={finalActionButton.disabled}
          style={finalActionButton.style}
          textColor={finalActionButton.textColor}
          labelStyle={styles.buttonLabel}
        >
          {finalActionButton.label}
        </Button>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginBottom: 6,
    minHeight: 56,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
  },
  avatar: {
    backgroundColor: '#3B82F6',
  },
  avatarLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  userName: {
    fontWeight: '600',
    fontSize: 15,
    color: '#111827',
    marginBottom: 3,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  levelBadge: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
  },
  levelText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 9,
  },
  xpText: {
    color: '#6B7280',
    fontSize: 9,
    fontWeight: '500',
  },
  reliabilityText: {
    fontSize: 9,
    fontWeight: '600',
  },
  buttonLabel: {
    fontSize: 12,
    lineHeight: 14,
  },
  removeButton: {
    minWidth: 48,
    width: 48,
    height: 36,
    borderColor: '#EF4444',
  },
});
