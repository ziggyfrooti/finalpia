import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { FloatingCard } from '../components/FloatingCard';
import { PiaButton } from '../components/PiaButton';
import { loginWithEmail, signupWithEmail } from '../lib/auth';

interface EmailLoginScreenProps {
  onSuccess: () => void;
  onBack: () => void;
}

export default function EmailLoginScreen({ onSuccess, onBack }: EmailLoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      if (isSignup) {
        await signupWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
      onSuccess();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{isSignup ? 'Create Account' : 'Sign In'}</Text>
        <Text style={styles.subtitle}>
          {isSignup ? 'Join PIA to get started' : 'Welcome back to PIA'}
        </Text>

        <View style={styles.form}>
          <FloatingCard style={styles.inputCard}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </FloatingCard>

          <FloatingCard style={styles.inputCard}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              autoCapitalize="none"
            />
          </FloatingCard>

          <PiaButton onPress={handleSubmit} style={styles.submitButton}>
            {loading ? 'Loading...' : isSignup ? 'Sign Up' : 'Sign In'}
          </PiaButton>

          <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
            <Text style={styles.toggleText}>
              {isSignup 
                ? 'Already have an account? Sign In' 
                : "Don't have an account? Sign Up"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FBF9F4',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  content: {
    flex: 1,
  },
  backButton: {
    marginBottom: 24,
  },
  backButtonText: {
    fontSize: 16,
    color: '#6366F1',
    fontWeight: '500',
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
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  inputCard: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    color: '#1E293B',
    paddingVertical: 8,
  },
  submitButton: {
    marginTop: 8,
  },
  toggleText: {
    textAlign: 'center',
    color: '#6366F1',
    fontSize: 14,
    marginTop: 8,
  },
});
