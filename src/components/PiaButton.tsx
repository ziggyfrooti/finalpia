import React, { ReactNode, useRef, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, Animated } from 'react-native';
import { Colors } from '../constants/theme';

interface PiaButtonProps {
  onPress: () => void;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  animate?: boolean;
}

export const PiaButton: React.FC<PiaButtonProps> = ({ 
  onPress, 
  children, 
  variant = 'primary',
  style,
  textStyle,
  disabled = false,
  animate = true,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!animate || disabled) return;

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    pulse.start();
    return () => pulse.stop();
  }, [animate, disabled, pulseAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={{
        transform: [
          { scale: animate ? Animated.multiply(scaleAnim, pulseAnim) : scaleAnim }
        ],
      }}
    >
      <TouchableOpacity 
        style={[
          styles.button, 
          variant === 'secondary' && styles.buttonSecondary,
          disabled && styles.buttonDisabled,
          style
        ]} 
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Text style={[
          styles.buttonText, 
          variant === 'secondary' && styles.buttonTextSecondary,
          disabled && styles.buttonTextDisabled,
          textStyle
        ]}>
          {children}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: Colors.primary,
    shadowColor: '#000',
    shadowOpacity: 0.1,
  },
  buttonDisabled: {
    backgroundColor: '#E2E8F0',
    opacity: 0.6,
    shadowOpacity: 0,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  buttonTextSecondary: {
    color: Colors.primary,
  },
  buttonTextDisabled: {
    color: '#94A3B8',
  },
});
