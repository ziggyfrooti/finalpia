import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from './src/lib/useAuth';
import LoginScreen from './src/screens/LoginScreen';
import EmailLoginScreen from './src/screens/EmailLoginScreen';
import ParentHomeScreen from './src/screens/ParentHomeScreen';
import { loginWithGoogle } from './src/lib/auth';

export type RootStackParamList = {
  Login: undefined;
  EmailLogin: undefined;
  ParentHome: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const { user, loading } = useAuth();
  const [loggingIn, setLoggingIn] = useState(false);

  const handleGoogleLogin = async () => {
    setLoggingIn(true);
    try {
      await loginWithGoogle();
      // Auth listener will handle navigation
    } catch (error: any) {
      console.error('Google login error:', error);
      Alert.alert(
        'Login Failed', 
        error.message || 'Could not sign in with Google. Please try email login instead.'
      );
    } finally {
      setLoggingIn(false);
    }
  };

  if (loading || loggingIn) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>
          {loggingIn ? 'Signing in...' : 'Loading...'}
        </Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          {!user ? (
            <>
              <Stack.Screen name="Login">
                {({ navigation }) => (
                  <LoginScreen
                    onGoogle={handleGoogleLogin}
                    onEmail={() => navigation.navigate('EmailLogin')}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="EmailLogin">
                {({ navigation }) => (
                  <EmailLoginScreen
                    onSuccess={() => {
                      // Auth listener will handle navigation
                    }}
                    onBack={() => navigation.goBack()}
                  />
                )}
              </Stack.Screen>
            </>
          ) : (
            <Stack.Screen name="ParentHome">
              {({ navigation }) => (
                <ParentHomeScreen
                  onLogout={() => {
                    // Auth listener will handle navigation
                  }}
                  userEmail={user.email}
                />
              )}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FBF9F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
  },
});
