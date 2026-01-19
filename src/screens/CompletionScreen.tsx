import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PiaButton } from '../components/PiaButton';

interface CompletionScreenProps {
  onContinue: () => void;
  message?: string;
  emoji?: string;
}

export default function CompletionScreen({
  onContinue,
  message = 'Great job!',
  emoji = '🎉',
}: CompletionScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={styles.title}>{message}</Text>
        <Text style={styles.subtitle}>
          Your reflections have been saved
        </Text>
        <PiaButton onPress={onContinue} style={styles.button}>
          Done
        </PiaButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF9F4',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
    gap: 24,
    maxWidth: 320,
  },
  emoji: {
    fontSize: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  button: {
    marginTop: 16,
    minWidth: 200,
  },
});
