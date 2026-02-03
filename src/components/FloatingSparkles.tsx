import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Colors } from '../constants/theme';

interface FloatingSparksProps {
  count?: number;
}

export const FloatingSparkles: React.FC<FloatingSparksProps> = ({ count = 5 }) => {
  const sparkles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 300,
    y: Math.random() * 600,
    delay: Math.random() * 2000,
    duration: 2000 + Math.random() * 2000,
    scale: useRef(new Animated.Value(0)).current,
    opacity: useRef(new Animated.Value(0)).current,
  }));

  useEffect(() => {
    const animations = sparkles.map((sparkle) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(sparkle.delay),
          Animated.parallel([
            Animated.timing(sparkle.scale, {
              toValue: 1,
              duration: sparkle.duration / 2,
              useNativeDriver: true,
            }),
            Animated.timing(sparkle.opacity, {
              toValue: 1,
              duration: sparkle.duration / 2,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(sparkle.scale, {
              toValue: 0,
              duration: sparkle.duration / 2,
              useNativeDriver: true,
            }),
            Animated.timing(sparkle.opacity, {
              toValue: 0,
              duration: sparkle.duration / 2,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
    });

    animations.forEach((anim) => anim.start());

    return () => {
      animations.forEach((anim) => anim.stop());
    };
  }, []);

  const colors = [
    Colors.secondary,
    Colors.accent4,
    Colors.accent2,
    Colors.accent5,
    Colors.primaryLight,
  ];

  return (
    <View style={styles.container} pointerEvents="none">
      {sparkles.map((sparkle, index) => (
        <Animated.View
          key={sparkle.id}
          style={[
            styles.sparkle,
            {
              left: sparkle.x,
              top: sparkle.y,
              backgroundColor: colors[index % colors.length],
              transform: [{ scale: sparkle.scale }],
              opacity: sparkle.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  sparkle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
