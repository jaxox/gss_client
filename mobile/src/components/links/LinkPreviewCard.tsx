/**
 * LinkPreviewCard - Reusable Link Display Component
 * Shared between AddLinkModal preview and Step2Social link list
 */
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface LinkPreviewCardProps {
  iconName: string;
  title: string;
  url: string;
}

export default function LinkPreviewCard({
  iconName,
  title,
  url,
}: LinkPreviewCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Icon name={iconName} size={20} color="#ff6b35" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.url} numberOfLines={1} ellipsizeMode="tail">
          {url}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 107, 53, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  url: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
});
