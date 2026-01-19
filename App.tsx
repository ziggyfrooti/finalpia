import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from './src/lib/useAuth';
import LoginScreen from './src/screens/LoginScreen';
import EmailLoginScreen from './src/screens/EmailLoginScreen';
import ParentHomeScreen from './src/screens/ParentHomeScreen';
import ModeSelector from './src/screens/ModeSelector';
import SplashScreen from './src/screens/SplashScreen';
import ParentGate from './src/screens/ParentGate';
import CategoryHub from './src/screens/CategoryHub';
import ParentSpaceHome from './src/screens/ParentSpaceHome';
import MyDayWelcome from './src/screens/MyDayWelcome';
import PartsOfMyDay from './src/screens/PartsOfMyDay';
import MomentCards from './src/screens/MomentCards';
import CompletionScreen from './src/screens/CompletionScreen';
import { loginWithGoogle } from './src/lib/auth';

export type RootStackParamList = {
  Login: undefined;
  EmailLogin: undefined;
  Splash: undefined;
  ModeSelector: undefined;
  ParentGate: undefined;
  ParentHome: undefined;
  CategoryHub: undefined;
  ParentSpaceHome: undefined;
  MyDayWelcome: undefined;
  PartsOfMyDay: undefined;
  MomentCards: { category: string };
  CompletionScreen: undefined;
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
            <>
              <Stack.Screen name="Splash">
                {({ navigation }) => (
                  <SplashScreen
                    onContinue={() => navigation.replace('ModeSelector')}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="ModeSelector">
                {({ navigation }) => (
                  <ModeSelector
                    onSelectKidSpace={() => navigation.navigate('MyDayWelcome')}
                    onSelectParentSpace={() => navigation.navigate('ParentSpaceHome')}
                    selectedChild={null}
                    childrenList={[]}
                    onSelectChild={(child) => {
                      // Handle child selection
                    }}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="MyDayWelcome">
                {({ navigation }) => (
                  <MyDayWelcome
                    onStart={() => navigation.navigate('PartsOfMyDay')}
                    onSkip={() => navigation.navigate('ModeSelector')}
                    childName="Alex"
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="PartsOfMyDay">
                {({ navigation }) => (
                  <PartsOfMyDay
                    onContinue={(categories) => {
                      if (categories.length > 0) {
                        navigation.navigate('MomentCards', { category: categories[0] });
                      }
                    }}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="MomentCards">
                {({ navigation, route }) => (
                  <MomentCards
                    category={route.params?.category || 'lunch'}
                    onComplete={() => navigation.navigate('CompletionScreen')}
                    onDone={() => navigation.navigate('CompletionScreen')}
                    onSwipe={async (payload) => {
                      console.log('Swipe:', payload);
                      // Save to Firestore here in future
                    }}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="CompletionScreen">
                {({ navigation }) => (
                  <CompletionScreen
                    onContinue={() => navigation.navigate('ModeSelector')}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="ParentSpaceHome">
                {({ navigation }) => (
                  <ParentSpaceHome
                    onNavigate={(screen) => {
                      Alert.alert('Navigate', `Navigate to: ${screen}`);
                    }}
                    onBack={() => navigation.navigate('ModeSelector')}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="ParentGate">
                {({ navigation }) => (
                  <ParentGate
                    onVerified={() => navigation.navigate('CategoryHub')}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="CategoryHub">
                {({ navigation }) => (
                  <CategoryHub
                    categories={['lunch', 'recess', 'classroom', 'specials', 'bus']}
                    progress={{}}
                    onSelectCategory={(category) => {
                      // Navigate to category detail
                      Alert.alert('Category Selected', `Selected: ${category}`);
                    }}
                    onComplete={() => {
                      Alert.alert('Complete', 'Day completed!');
                      navigation.navigate('ModeSelector');
                    }}
                  />
                )}
              </Stack.Screen>
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
            </>
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
