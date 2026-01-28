import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { FloatingCard } from '../components/FloatingCard';
import { PiaButton } from '../components/PiaButton';
import { getCurrentUser } from '../lib/db';
import { ScreenWrapper } from '../components/ScreenWrapper';

interface ParentSetupScreenProps {
  onContinue: () => void;
}

export default function ParentSetupScreen({ onContinue }: ParentSetupScreenProps) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [role, setRole] = useState('Parent');
  const [notifications, setNotifications] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleContinue = async () => {
    const user = getCurrentUser();
    if (!user) {
      Alert.alert('Error', 'You are not logged in. Please go back and log in again.');
      return;
    }

    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (!location.trim()) {
      Alert.alert('Error', 'Please enter your location');
      return;
    }

    setSaving(true);
    try {
      // Store parent profile in Firestore
      const { getFirestore, doc, setDoc } = await import('firebase/firestore');
      const db = getFirestore();
      
      await setDoc(
        doc(db, 'parents', user.uid),
        {
          name: name.trim(),
          location: location.trim(),
          role,
          notificationsEnabled: notifications,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      onContinue();
    } catch (error: any) {
      Alert.alert('Error', error?.message ?? 'Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Let's set up your profile</Text>
        <Text style={styles.subtitle}>Tell us a bit about yourself</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <FloatingCard style={styles.card}>
          <Text style={styles.label}>Your Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="#94A3B8"
          />
        </FloatingCard>

        <FloatingCard style={styles.card}>
          <Text style={styles.label}>Your Location</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="City, State or Country"
            placeholderTextColor="#94A3B8"
          />
        </FloatingCard>

        <FloatingCard style={styles.card}>
          <Text style={styles.label}>I am a...</Text>
          <View style={styles.roleGrid}>
            {['Parent', 'Guardian', 'Caregiver', 'Other'].map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => setRole(option)}
                style={[
                  styles.roleButton,
                  role === option && styles.roleButtonSelected,
                ]}
              >
                <Text
                  style={[
                    styles.roleButtonText,
                    role === option && styles.roleButtonTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </FloatingCard>

        <FloatingCard style={styles.card}>
          <View style={styles.notificationRow}>
            <View style={styles.notificationInfo}>
              <Text style={styles.notificationTitle}>Daily Notifications</Text>
              <Text style={styles.notificationSubtitle}>Gentle reminders for check-ins</Text>
            </View>

            <TouchableOpacity
              onPress={() => setNotifications(!notifications)}
              style={[
                styles.toggle,
                notifications && styles.toggleActive,
              ]}
            >
              <View
                style={[
                  styles.toggleCircle,
                  notifications && styles.toggleCircleActive,
                ]}
              >
                <Text style={styles.toggleIcon}>
                  {notifications ? '🔔' : '🔕'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </FloatingCard>
      </View>

      {/* Continue Button */}
      <View style={styles.footer}>
        <PiaButton
          onPress={handleContinue}
          style={styles.continueButton}
          disabled={!name.trim() || !location.trim() || saving}
        >
          {saving ? 'Saving...' : 'Continue'}
        </PiaButton>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FBF9F4',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  form: {
    flex: 1,
    gap: 24,
  },
  card: {
    marginBottom: 0,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 12,
  },
  input: {
    fontSize: 16,
    color: '#1E293B',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
  },
  roleButtonSelected: {
    backgroundColor: '#7DD3C0',
    shadowColor: '#7DD3C0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  roleButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#64748B',
  },
  roleButtonTextSelected: {
    color: '#FFFFFF',
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 4,
  },
  notificationSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  toggle: {
    width: 56,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  toggleActive: {
    backgroundColor: '#7DD3C0',
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  toggleCircleActive: {
    alignSelf: 'flex-end',
  },
  toggleIcon: {
    fontSize: 12,
  },
  footer: {
    marginTop: 32,
  },
  continueButton: {
    width: '100%',
  },
});
