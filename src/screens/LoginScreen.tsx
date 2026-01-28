import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { FloatingCard } from '../components/FloatingCard';
import { Mascot } from '../components/Mascot';
import { ScreenWrapper } from '../components/ScreenWrapper';

interface LoginScreenProps {
  onGoogle: () => void;
  onEmail: () => void;
}

export default function LoginScreen({ onGoogle, onEmail }: LoginScreenProps) {
  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Mascot size="md" />
          <Text style={styles.title}>Welcome to PIA</Text>
          <Text style={styles.subtitle}>
            A calm space for kids to share their day and parents to connect meaningfully
          </Text>
        </View>

        {/* Login Options */}
        <View style={styles.loginOptions}>
          <FloatingCard>
            <TouchableOpacity 
              onPress={onGoogle}
              style={styles.loginButton}
            >
              <View style={styles.googleIconContainer}>
                <Text style={styles.googleIcon}>G</Text>
              </View>
              <Text style={styles.loginButtonText}>Continue with Google</Text>
            </TouchableOpacity>
          </FloatingCard>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <FloatingCard>
            <TouchableOpacity 
              onPress={onEmail}
              style={styles.loginButton}
            >
              <Text style={styles.emailIcon}>✉️</Text>
              <Text style={styles.loginButtonText}>Continue with Email</Text>
            </TouchableOpacity>
          </FloatingCard>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </ScrollView>
    </ScreenWrapper>
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
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    gap: 16,
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1E293B',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: 320,
  },
  loginOptions: {
    gap: 16,
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  googleIconContainer: {
    width: 24,
    height: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  googleIcon: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4285F4',
  },
  emailIcon: {
    fontSize: 20,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#334155',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    paddingHorizontal: 16,
    color: '#64748B',
    fontSize: 14,
  },
  footer: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 32,
    maxWidth: 320,
    alignSelf: 'center',
  },
});
