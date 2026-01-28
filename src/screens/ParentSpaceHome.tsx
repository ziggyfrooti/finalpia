import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { FloatingCard } from '../components/FloatingCard';
import { logout } from '../lib/auth';
import { ScreenWrapper } from '../components/ScreenWrapper';

type ScreenKey = 'todays-story' | 'your-day' | 'your-balance';

interface ParentSpaceHomeProps {
  onNavigate: (screen: ScreenKey) => void;
  onBack: () => void;
  userEmail?: string | null;
  onLogout?: () => void;
}

export default function ParentSpaceHome({ onNavigate, onBack, userEmail, onLogout }: ParentSpaceHomeProps) {
  const handleLogout = async () => {
    await logout();
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Top Bar with User Info and Logout */}
      {userEmail && (
        <View style={styles.topBar}>
          <Text style={styles.userEmail}>
            Logged in as <Text style={styles.userEmailBold}>{userEmail}</Text>
          </Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Sign out</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back to spaces</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Parent Space</Text>
        <Text style={styles.subtitle}>Reflection and insights for you</Text>
      </View>

      {/* Cards */}
      <View style={styles.cardsContainer}>
        {/* Today's Story */}
        <FloatingCard>
          <TouchableOpacity onPress={() => onNavigate('todays-story')} style={styles.card}>
            <View style={[styles.iconContainer, styles.iconTeal]}>
              <Text style={styles.icon}>📖</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Today's Story</Text>
              <Text style={styles.cardSubtitle}>What your child noticed today</Text>
            </View>
            <View style={styles.badge} />
          </TouchableOpacity>
        </FloatingCard>

        {/* Your Day */}
        <FloatingCard>
          <TouchableOpacity onPress={() => onNavigate('your-day')} style={styles.card}>
            <View style={[styles.iconContainer, styles.iconPeach]}>
              <Text style={styles.icon}>✨</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Your Day</Text>
              <Text style={styles.cardSubtitle}>Swipe through moments from your day</Text>
            </View>
          </TouchableOpacity>
        </FloatingCard>

        {/* Your Balance */}
        <FloatingCard>
          <TouchableOpacity onPress={() => onNavigate('your-balance')} style={styles.card}>
            <View style={[styles.iconContainer, styles.iconGreen]}>
              <Text style={styles.icon}>📊</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Your Balance</Text>
              <Text style={styles.cardSubtitle}>A gentle view of what's been filling your life</Text>
            </View>
          </TouchableOpacity>
        </FloatingCard>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            This space is designed to help you reflect on both your child's experiences and your own,
            fostering deeper connections and meaningful conversations.
          </Text>
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
    paddingVertical: 32,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.15)',
  },
  userEmail: {
    fontSize: 12,
    color: '#64748B',
  },
  userEmailBold: {
    fontWeight: '600',
    color: '#0F172A',
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  logoutText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  header: {
    marginBottom: 32,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#64748B',
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
  cardsContainer: {
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 4,
  },
  iconDark: {
    backgroundColor: '#1E293B',
  },
  iconTeal: {
    backgroundColor: '#7DD3C0',
  },
  iconPeach: {
    backgroundColor: '#FFB4A2',
  },
  iconGreen: {
    backgroundColor: '#B4EFE3',
  },
  icon: {
    fontSize: 28,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  cardAction: {
    fontSize: 12,
    fontWeight: '500',
    color: '#7DD3C0',
  },
  badge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF9B8A',
  },
  infoCard: {
    backgroundColor: 'rgba(255, 218, 212, 0.2)',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 22,
  },
});
