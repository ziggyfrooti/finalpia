import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Animated } from 'react-native';
import { Colors } from '../constants/theme';

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
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (selected) {
      const glow = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: false,
          }),
        ])
      );
      glow.start();
      return () => glow.stop();
    }
  }, [selected, glowAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.container,
          selected && styles.containerSelected,
        ]}
        activeOpacity={0.9}
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.border,
    padding: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  containerSelected: {
    borderColor: Colors.primary,
    borderWidth: 3,
    backgroundColor: '#FFFFFF',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    flex: 1,
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeSelected: {
    backgroundColor: Colors.accent1,
    borderColor: Colors.accent1,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  badgeTextSelected: {
    color: '#FFFFFF',
  },
});
