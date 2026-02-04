/**
 * Bobo Showcase Screen
 * 
 * This is a test/demo screen to view all of Bobo's emotional states.
 * Use this to verify the mascot renders correctly and to show off Bobo's personality!
 * 
 * To use: Import and navigate to this screen in your app.
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Mascot } from '../components/Mascot';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Colors } from '../constants/theme';

export const BoboShowcase = () => {
  const states: Array<{
    type: 'idle' | 'happy' | 'curious' | 'thinking' | 'excited' | 'sleepy' | 'calm' | 'shy';
    label: string;
    description: string;
  }> = [
    {
      type: 'idle',
      label: 'Idle',
      description: 'Relaxed, welcoming, default state',
    },
    {
      type: 'happy',
      label: 'Happy',
      description: 'Activity saved, positive feedback',
    },
    {
      type: 'curious',
      label: 'Curious',
      description: 'Asking questions, exploration',
    },
    {
      type: 'thinking',
      label: 'Thinking',
      description: 'Loading, processing data',
    },
    {
      type: 'excited',
      label: 'Excited',
      description: 'Achievements, celebrations',
    },
    {
      type: 'sleepy',
      label: 'Sleepy',
      description: 'End of day, bedtime',
    },
    {
      type: 'calm',
      label: 'Calm',
      description: 'Parent space, informational',
    },
    {
      type: 'shy',
      label: 'Shy',
      description: 'First-time user, onboarding',
    },
  ];

  return (
    <ScreenWrapper>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Meet Bobo! 🌿</Text>
        <Text style={styles.subtitle}>
          Bobo is your friendly companion with many emotions
        </Text>

        <View style={styles.grid}>
          {states.map((state) => (
            <View key={state.type} style={styles.card}>
              <View style={styles.mascotContainer}>
                <Mascot type={state.type} size="lg" animate={true} />
              </View>
              <Text style={styles.label}>{state.label}</Text>
              <Text style={styles.description}>{state.description}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sizeDemo}>
          <Text style={styles.sectionTitle}>Size Comparison</Text>
          <View style={styles.sizeRow}>
            <View style={styles.sizeItem}>
              <Mascot type="happy" size="sm" animate={true} />
              <Text style={styles.sizeLabel}>Small</Text>
            </View>
            <View style={styles.sizeItem}>
              <Mascot type="happy" size="md" animate={true} />
              <Text style={styles.sizeLabel}>Medium</Text>
            </View>
            <View style={styles.sizeItem}>
              <Mascot type="happy" size="lg" animate={true} />
              <Text style={styles.sizeLabel}>Large</Text>
            </View>
          </View>
        </View>

        <View style={styles.animationDemo}>
          <Text style={styles.sectionTitle}>Animation On/Off</Text>
          <View style={styles.sizeRow}>
            <View style={styles.sizeItem}>
              <Mascot type="excited" size="lg" animate={true} />
              <Text style={styles.sizeLabel}>Animated</Text>
            </View>
            <View style={styles.sizeItem}>
              <Mascot type="excited" size="lg" animate={false} />
              <Text style={styles.sizeLabel}>Static</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Bobo is a mint green jelly blob designed to be your calm and comforting companion
            throughout your PIA journey! 💚
          </Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  grid: {
    gap: 16,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  mascotContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  sizeDemo: {
    marginTop: 30,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
  },
  animationDemo: {
    marginTop: 20,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  sizeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  sizeItem: {
    alignItems: 'center',
    gap: 8,
  },
  sizeLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  footer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: Colors.primaryLight,
    borderRadius: 16,
  },
  footerText: {
    fontSize: 14,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 20,
  },
});
