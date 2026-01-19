import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Mascot } from '../components/Mascot';

interface SplashScreenProps {
  onContinue: () => void;
}

export default function SplashScreen({ onContinue }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onContinue();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Mascot size="lg" />
        <Text style={styles.title}>PIA</Text>
        <Text style={styles.subtitle}>
          Small moments. Big conversations.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#FBF9F4',
  },
  content: {
    alignItems: 'center',
    gap: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '600',
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: 280,
  },
});
