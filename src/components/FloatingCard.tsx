import React, { ReactNode, useRef, useEffect } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../constants/theme';

interface FloatingCardProps {
  children: ReactNode;
  style?: ViewStyle;
  animate?: boolean;
}

export const FloatingCard: React.FC<FloatingCardProps> = ({ 
  children, 
  style,
  animate = false 
}) => {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animate) return;

    const float = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -4,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    float.start();
    return () => float.stop();
  }, [animate, floatAnim]);

  return (
    <Animated.View 
      style={[
        styles.card, 
        style,
        animate && {
          transform: [{ translateY: floatAnim }]
        }
      ]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
});
