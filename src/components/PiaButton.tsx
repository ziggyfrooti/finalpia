import React, { ReactNode } from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface PiaButtonProps {
  onPress: () => void;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const PiaButton: React.FC<PiaButtonProps> = ({ 
  onPress, 
  children, 
  variant = 'primary',
  style,
  textStyle
}) => {
  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        variant === 'secondary' && styles.buttonSecondary,
        style
      ]} 
      onPress={onPress}
    >
      <Text style={[
        styles.buttonText, 
        variant === 'secondary' && styles.buttonTextSecondary,
        textStyle
      ]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#6366F1',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: '#334155',
  },
});
