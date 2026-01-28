import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { PiaButton } from '../components/PiaButton';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { SoundManager } from '../utils/SoundManager';
import ConfettiCannon from 'react-native-confetti-cannon';

interface CompletionScreenProps {
  onContinue: () => void;
  onSendToParent?: () => void; // NEW: Send to parent and lock check-in
  isSent?: boolean; // NEW: Whether check-in is already sent/locked
  message?: string;
  emoji?: string;
}

const { width } = Dimensions.get('window');

export default function CompletionScreen({
  onContinue,
  onSendToParent,
  isSent = false,
  message = 'Great job!',
  emoji = '🎉',
}: CompletionScreenProps) {
  const confettiRef = useRef<any>(null);

  useEffect(() => {
    // Play celebration sound
    SoundManager.play('allComplete');

    // Trigger confetti after a short delay
    const timer = setTimeout(() => {
      confettiRef.current?.start();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.emoji}>{emoji}</Text>
          <Text style={styles.title}>{message}</Text>
          <Text style={styles.subtitle}>
            Your reflections have been saved
          </Text>

          {onSendToParent && !isSent ? (
            // Show "Send to Parent" option (only if not already sent)
            <>
              <PiaButton onPress={onSendToParent} style={styles.button}>
                Send to Parent ✉️
              </PiaButton>
              <TouchableOpacity onPress={onContinue} style={styles.laterButton}>
                <Text style={styles.laterText}>I'll send it later</Text>
              </TouchableOpacity>
            </>
          ) : (
            // Already sent or no send to parent option - just show Done button
            <PiaButton onPress={onContinue} style={styles.button}>
              Done
            </PiaButton>
          )}
        </View>

        {/* Confetti Animation */}
        <ConfettiCannon
          ref={confettiRef}
          count={50}
          origin={{ x: width / 2, y: 0 }}
          colors={['#7DD3C0', '#FFB8D1', '#FF9B8A', '#B4EFC4', '#FFD93D']}
          explosionSpeed={350}
          fallSpeed={3000}
          fadeOut={true}
          autoStart={false}
        />
      </View>
    </ScreenWrapper>
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
  laterButton: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  laterText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
});
