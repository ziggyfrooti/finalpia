import React from 'react';
import { View, StyleSheet } from 'react-native';

interface MascotProps {
  size?: 'sm' | 'md' | 'lg';
}

export const Mascot: React.FC<MascotProps> = ({ size = 'md' }) => {
  const sizeMap = {
    sm: 60,
    md: 80,
    lg: 120,
  };

  const dimension = sizeMap[size];

  return (
    <View style={[styles.mascot, { width: dimension, height: dimension }]}>
      {/* Placeholder for mascot - you can add an image or custom SVG here */}
      <View style={styles.mascotCircle} />
    </View>
  );
};

const styles = StyleSheet.create({
  mascot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 1000,
    backgroundColor: '#E0E7FF',
  },
});
