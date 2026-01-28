import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PiaButton } from '../components/PiaButton';
import { Mascot } from '../components/Mascot';
import { ScreenWrapper } from '../components/ScreenWrapper';

interface MyDayWelcomeProps {
  onStart: () => void;
  onSkip: () => void;
  childName: string;
}

export default function MyDayWelcome({ onStart, onSkip, childName }: MyDayWelcomeProps) {
  const greeting = new Date().getHours() < 12
    ? 'Good morning'
    : new Date().getHours() < 17
    ? 'Hi there'
    : 'Good evening';

  return (
    <ScreenWrapper>
      <View style={styles.container}>
      <View style={styles.content}>
        {/* Mascot */}
        <Mascot size="lg" />

        {/* Greeting */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>
            {greeting}, {childName}!
          </Text>
          <Text style={styles.message}>
            Ready to share what happened today?
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          <PiaButton onPress={onStart} style={styles.button}>
            Start My Day
          </PiaButton>
          <PiaButton onPress={onSkip} variant="secondary" style={styles.button}>
            Not right now
          </PiaButton>
        </View>

        {/* Encouragement */}
        <Text style={styles.encouragement}>
          There's no right or wrong answers. Just swipe what happened and what didn't!
        </Text>
      </View>
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
    paddingVertical: 48,
  },
  content: {
    alignItems: 'center',
    gap: 32,
    maxWidth: 400,
  },
  greetingContainer: {
    alignItems: 'center',
  },
  greeting: {
    fontSize: 32,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 18,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: 320,
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 320,
    gap: 12,
    marginTop: 16,
  },
  button: {
    width: '100%',
  },
  encouragement: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    maxWidth: 280,
    marginTop: 16,
  },
});
