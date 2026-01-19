import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

interface CategoryTileProps {
  label: string;
  icon?: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  onToggle?: () => void;
}

export function CategoryTile({
  label,
  icon,
  selected = false,
  onClick,
  onToggle,
}: CategoryTileProps) {
  const handlePress = onClick ?? onToggle;

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.container,
        selected && styles.containerSelected,
      ]}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {icon && (
          <View style={styles.iconContainer}>
            {icon}
          </View>
        )}

        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
        </View>

        <View style={[
          styles.badge,
          selected && styles.badgeSelected,
        ]}>
          <Text style={[
            styles.badgeText,
            selected && styles.badgeTextSelected,
          ]}>
            {selected ? '✓' : '+'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  containerSelected: {
    borderColor: 'rgba(125, 211, 192, 0.5)',
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
    shadowColor: '#7DD3C0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(125, 211, 192, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  badge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeSelected: {
    backgroundColor: '#7DD3C0',
    borderColor: '#7DD3C0',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748B',
  },
  badgeTextSelected: {
    color: '#FFFFFF',
  },
});
