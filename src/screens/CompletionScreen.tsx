import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { PiaButton } from '../components/PiaButton';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Mascot } from '../components/Mascot';
import { FloatingSparkles } from '../components/FloatingSparkles';
import { SoundManager } from '../utils/SoundManager';
import { Colors } from '../constants/theme';
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
      <FloatingSparkles count={12} />
      <View style={styles.container}>
        <View style={styles.content}>
          <Mascot size="lg" type="celebrating" animate={true} />
          <Text style={styles.emoji}>{emoji}</Text>
          <Text style={styles.title}>{message}</Text>

          {isSent ? (
            // Already sent - show special message
            <>
              <Text style={styles.subtitle}>
                You already sent today's reflections to your parent!
              </Text>
              <Text style={[styles.subtitle, { marginTop: 8 }]}>
                Come back tomorrow to share more about your day.
              </Text>
            </>
          ) : (
            <Text style={styles.subtitle}>
              Your reflections have been saved
            </Text>
          )}

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
          count={80}
          origin={{ x: width / 2, y: 0 }}
          colors={[Colors.primary, Colors.secondary, Colors.accent1, Colors.accent2, Colors.accent4, Colors.accent5]}
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
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
    gap: 20,
    maxWidth: 320,
  },
  emoji: {
    fontSize: 96,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  button: {
    marginTop: 16,
    minWidth: 220,
  },
  laterButton: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  laterText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: '600',
  },
});
