import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { FloatingCard } from '../components/FloatingCard';
import { ScreenWrapper } from '../components/ScreenWrapper';

interface ParentGateProps {
  onVerified: () => void;
}

export default function ParentGate({ onVerified }: ParentGateProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [pressProgress, setPressProgress] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handlePressStart = () => {
    setIsPressed(true);
    let progress = 0;

    progressIntervalRef.current = setInterval(() => {
      progress += 2;
      setPressProgress(progress);

      if (progress >= 100) {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
        setIsVerified(true);
        setTimeout(() => {
          onVerified();
        }, 500);
      }
    }, 30);
  };

  const handlePressEnd = () => {
    setIsPressed(false);
    setPressProgress(0);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  };

  return (
    <View style={styles.container}>
      <FloatingCard style={styles.card}>
        <View style={styles.content}>
          {/* Icon */}
          <View style={[
            styles.iconContainer,
            isVerified ? styles.iconContainerVerified : styles.iconContainerDefault
          ]}>
            <Text style={styles.icon}>{isVerified ? '✓' : '🛡️'}</Text>
          </View>

          {/* Text */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>
              {isVerified ? 'All set!' : 'Grown-up check'}
            </Text>
            <Text style={styles.subtitle}>
              {isVerified
                ? 'Taking you to Kid Space...'
                : 'Press and hold the button below to continue'}
            </Text>
          </View>

          {/* Press and Hold Button */}
          {!isVerified && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPressIn={handlePressStart}
                onPressOut={handlePressEnd}
                activeOpacity={0.9}
                style={[
                  styles.button,
                  isPressed && styles.buttonPressed
                ]}
              >
                {/* Progress Background */}
                <View
                  style={[
                    styles.progressBackground,
                    { width: `${pressProgress}%` }
                  ]}
                />

                <Text style={styles.buttonText}>
                  {isPressed ? 'Keep holding...' : 'Press and Hold'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </FloatingCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
    backgroundColor: '#FBF9F4',
  },
  card: {
    width: '100%',
    maxWidth: 400,
  },
  content: {
    alignItems: 'center',
    gap: 24,
    paddingVertical: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7DD3C0',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },
  iconContainerDefault: {
    backgroundColor: '#FF9B8A',
  },
  iconContainerVerified: {
    backgroundColor: '#7DD3C0',
  },
  icon: {
    fontSize: 40,
    color: '#FFFFFF',
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    width: '100%',
    paddingVertical: 24,
    borderRadius: 16,
    backgroundColor: '#7DD3C0',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#7DD3C0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 4,
  },
  buttonPressed: {
    backgroundColor: '#6BC9B4',
    transform: [{ scale: 0.95 }],
  },
  progressBackground: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    zIndex: 1,
  },
});
