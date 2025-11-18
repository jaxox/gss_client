import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Avatar, Button } from 'react-native-paper';
import { FABButton } from '../buttons';

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
  // Convenience prop for Add button (simplified API)
  onAdd?: () => void;
  addIcon?: string;
  backgroundColor?: string;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: any;
}

export default function CoHostCard({
  user,
  onPress,
  actionButton,
  onRemove,
  onAdd,
  addIcon = 'plus',
  backgroundColor = 'rgba(255, 255, 255, 0.05)',
  disabled = false,
  accessibilityLabel,
  style,
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

  return (
    <Pressable
      style={[styles.card, { backgroundColor }, style]}
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

      {onRemove ? (
        <View
          onStartShouldSetResponder={() => true}
          onTouchEnd={e => e.stopPropagation()}
        >
          <FABButton
            onPress={onRemove}
            size="small"
            variant="remove"
            icon="close"
          />
        </View>
      ) : onAdd ? (
        <View
          onStartShouldSetResponder={() => true}
          onTouchEnd={e => e.stopPropagation()}
        >
          <FABButton
            onPress={onAdd}
            size="small"
            variant="add"
            icon={addIcon}
            disabled={disabled}
          />
        </View>
      ) : actionButton ? (
        <Button
          mode={actionButton.mode}
          compact
          onPress={actionButton.onPress}
          disabled={actionButton.disabled}
          style={actionButton.style}
          textColor={actionButton.textColor}
          labelStyle={styles.buttonLabel}
        >
          {actionButton.label}
        </Button>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    minHeight: 60,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  avatar: {
    backgroundColor: '#ff6b35',
  },
  avatarLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  userName: {
    fontWeight: '600',
    fontSize: 15,
    color: '#ffffff',
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  levelBadge: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  levelText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 10,
  },
  xpText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    fontWeight: '500',
  },
  reliabilityText: {
    fontSize: 11,
    fontWeight: '600',
  },
  buttonLabel: {
    fontSize: 12,
    lineHeight: 14,
  },
});
