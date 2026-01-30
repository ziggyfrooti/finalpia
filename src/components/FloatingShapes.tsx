import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { Colors } from '../constants/theme';

const { width, height } = Dimensions.get('window');

interface FloatingShapesProps {
  count?: number;
}

export const FloatingShapes: React.FC<FloatingShapesProps> = ({ count = 5 }) => {
  const shapes = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * width,
    y: Math.random() * height,
    size: 30 + Math.random() * 60,
    type: ['star', 'heart', 'cloud'][Math.floor(Math.random() * 3)],
    delay: Math.random() * 3000,
    translateY: useRef(new Animated.Value(0)).current,
    translateX: useRef(new Animated.Value(0)).current,
    rotate: useRef(new Animated.Value(0)).current,
  }));

  useEffect(() => {
    const animations = shapes.map((shape) => {
      return Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.delay(shape.delay),
            Animated.timing(shape.translateY, {
              toValue: -20,
              duration: 3000,
              useNativeDriver: true,
            }),
            Animated.timing(shape.translateY, {
              toValue: 0,
              duration: 3000,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.delay(shape.delay),
            Animated.timing(shape.translateX, {
              toValue: 10,
              duration: 2500,
              useNativeDriver: true,
            }),
            Animated.timing(shape.translateX, {
              toValue: 0,
              duration: 2500,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.delay(shape.delay),
            Animated.timing(shape.rotate, {
              toValue: 1,
              duration: 6000,
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
    Colors.primaryLight,
    Colors.secondaryLight,
    Colors.accent4,
    Colors.accent5,
  ];

  const renderShape = (shape: any, index: number) => {
    const color = colors[index % colors.length];
    const size = shape.size;

    if (shape.type === 'star') {
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={color}
            opacity={0.3}
          />
        </Svg>
      );
    } else if (shape.type === 'heart') {
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill={color}
            opacity={0.3}
          />
        </Svg>
      );
    } else {
      return (
        <Svg width={size} height={size} viewBox="0 0 60 40">
          <Path
            d="M10,30 Q10,10 20,10 Q25,5 30,10 Q35,5 40,10 Q50,10 50,30 Z"
            fill={color}
            opacity={0.3}
          />
        </Svg>
      );
    }
  };

  return (
    <View style={styles.container} pointerEvents="none">
      {shapes.map((shape, index) => (
        <Animated.View
          key={shape.id}
          style={[
            styles.shape,
            {
              left: shape.x,
              top: shape.y,
              transform: [
                { translateY: shape.translateY },
                { translateX: shape.translateX },
                {
                  rotate: shape.rotate.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            },
          ]}
        >
          {renderShape(shape, index)}
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  shape: {
    position: 'absolute',
  },
});
