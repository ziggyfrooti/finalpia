import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { PiaButton } from '../components/PiaButton';
import { logout } from '../lib/auth';

interface ParentHomeScreenProps {
  onLogout: () => void;
  userEmail?: string | null;
}

export default function ParentHomeScreen({ onLogout, userEmail }: ParentHomeScreenProps) {
  const handleLogout = async () => {
    await logout();
    onLogout();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to PIA Parent Space</Text>
        <Text style={styles.subtitle}>Logged in as: {userEmail}</Text>
        
        <View style={styles.info}>
          <Text style={styles.infoText}>
            ✅ Firebase connection is working!
          </Text>
          <Text style={styles.infoText}>
            ✅ Authentication is successful!
          </Text>
        </View>

        <PiaButton onPress={handleLogout} style={styles.logoutButton}>
          Logout
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
    paddingVertical: 48,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 32,
    textAlign: 'center',
  },
  info: {
    gap: 12,
    marginBottom: 32,
  },
  infoText: {
    fontSize: 16,
    color: '#22C55E',
    textAlign: 'center',
  },
  logoutButton: {
    marginTop: 16,
    minWidth: 200,
  },
});
