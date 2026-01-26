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
import TodaysStory from './src/screens/TodaysStory';
import YourBalance from './src/screens/YourBalance';
import YourDay from './src/screens/YourDay';
import AddChildScreen from './src/screens/AddChildScreen';
import ParentSetupScreen from './src/screens/ParentSetupScreen';
import { loginWithGoogle } from './src/lib/auth';
import { saveSwipe, getCurrentUser, listKids, createTodayCheckin, type Kid, getParentProfile } from './src/lib/db';

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
  TodaysStory: { dateLabel?: string };
  YourBalance: undefined;
  YourDay: undefined;
  AddChild: undefined;
  ParentSetup: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const { user, loading } = useAuth();
  const [loggingIn, setLoggingIn] = useState(false);
  const [kids, setKids] = useState<Kid[]>([]);
  const [selectedKid, setSelectedKid] = useState<Kid | null>(null);
  const [currentCheckinId, setCurrentCheckinId] = useState<string | null>(null);
  const [kidsLoading, setKidsLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoryProgress, setCategoryProgress] = useState<Record<string, number>>({});
  const [needsParentSetup, setNeedsParentSetup] = useState<boolean>(false);
  const [isNewUser, setIsNewUser] = useState<boolean>(false);

  // Load kids when user logs in
  React.useEffect(() => {
    if (!user?.uid) {
      setKids([]);
      setSelectedKid(null);
      setCurrentCheckinId(null);
      setNeedsParentSetup(false);
      return;
    }

    async function loadKids() {
      if (!user?.uid) return;
      
      setKidsLoading(true);
      try {
        // Check if parent profile exists
        const parentProfile = await getParentProfile(user.uid);
        if (!parentProfile || !parentProfile.name) {
          setNeedsParentSetup(true);
          setKidsLoading(false);
          return;
        }
        
        setNeedsParentSetup(false);
        const kidsList = await listKids(user.uid);
        setKids(kidsList);
        if (kidsList.length > 0 && !selectedKid) {
          setSelectedKid(kidsList[0]);
        }
      } catch (error) {
        console.error('Failed to load kids:', error);
      } finally {
        setKidsLoading(false);
      }
    }

    loadKids();
  }, [user?.uid]);

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
          ) : needsParentSetup ? (
            <>
              <Stack.Screen name="ParentSetup">
                {({ navigation }) => (
                  <ParentSetupScreen
                    onContinue={() => {
                      setNeedsParentSetup(false);
                      navigation.replace('AddChild');
                    }}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="AddChild">
                {({ navigation }) => (
                  <AddChildScreen
                    onComplete={async (kidId) => {
                      // Reload kids list
                      if (user?.uid) {
                        const kidsList = await listKids(user.uid);
                        setKids(kidsList);
                        const newKid = kidsList.find(k => k.id === kidId);
                        if (newKid) setSelectedKid(newKid);
                      }
                      navigation.replace('Splash');
                    }}
                    hideCancel={true}
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
                    selectedChild={selectedKid}
                    childrenList={kids}
                    onSelectChild={(child) => {
                      setSelectedKid(child);
                    }}
                    onAddChild={() => navigation.navigate('AddChild')}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="MyDayWelcome">
                {({ navigation }) => (
                  <MyDayWelcome
                    onStart={() => navigation.navigate('PartsOfMyDay')}
                    onSkip={() => navigation.navigate('ModeSelector')}
                    childName={selectedKid?.name || 'there'}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="PartsOfMyDay">
                {({ navigation }) => (
                  <PartsOfMyDay
                    onContinue={async (categories) => {
                      if (categories.length > 0 && user?.uid && selectedKid?.id) {
                        try {
                          const checkinId = await createTodayCheckin({
                            uid: user.uid,
                            kidId: selectedKid.id,
                            selectedCategories: categories,
                          });
                          setCurrentCheckinId(checkinId);
                          setSelectedCategories(categories);
                          // Initialize progress for all categories
                          const initialProgress: Record<string, number> = {};
                          categories.forEach(cat => {
                            initialProgress[cat] = 0;
                          });
                          setCategoryProgress(initialProgress);
                          navigation.navigate('CategoryHub');
                        } catch (error) {
                          console.error('Failed to create checkin:', error);
                          Alert.alert('Error', 'Could not start check-in. Please try again.');
                        }
                      }
                    }}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="MomentCards">
                {({ navigation, route }) => (
                  <MomentCards
                    category={route.params?.category || 'lunch'}
                    onComplete={() => {
                      // Mark category as complete
                      const category = route.params?.category || 'lunch';
                      setCategoryProgress(prev => ({ ...prev, [category]: 100 }));
                      // Navigate back to CategoryHub
                      navigation.navigate('CategoryHub');
                    }}
                    onDone={() => {
                      const category = route.params?.category || 'lunch';
                      setCategoryProgress(prev => ({ ...prev, [category]: 100 }));
                      navigation.navigate('CategoryHub');
                    }}
                    onSwipe={async (payload) => {
                      const user = getCurrentUser();
                      if (user && selectedKid?.id && currentCheckinId) {
                        try {
                          await saveSwipe({
                            uid: user.uid,
                            kidId: selectedKid.id,
                            checkinId: currentCheckinId,
                            category: payload.category,
                            cardIndex: payload.cardIndex,
                            cardText: payload.cardText,
                            choice: payload.choice,
                          });
                        } catch (error) {
                          console.error('Failed to save swipe:', error);
                          throw error;
                        }
                      }
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
                      switch (screen) {
                        case 'kid-checkin':
                          navigation.navigate('MyDayWelcome');
                          break;
                        case 'todays-story':
                          if (selectedKid) {
                            navigation.navigate('TodaysStory');
                          } else {
                            Alert.alert('No Child Selected', 'Please select a child first!');
                          }
                          break;
                        case 'your-day':
                          navigation.navigate('YourDay');
                          break;
                        case 'your-balance':
                          navigation.navigate('YourBalance');
                          break;
                        default:
                          Alert.alert('Coming Soon', `${screen} feature coming soon!`);
                      }
                    }}
                    onBack={() => navigation.navigate('ModeSelector')}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="TodaysStory">
                {({ navigation, route }) => (
                  <TodaysStory
                    onBack={() => navigation.goBack()}
                    kids={kids}
                    selectedKid={selectedKid}
                    onSelectKid={(kid) => {
                      setSelectedKid(kid);
                    }}
                    checkinId={currentCheckinId ?? undefined}
                    dateLabel={route.params?.dateLabel}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="YourBalance">
                {({ navigation }) => (
                  <YourBalance onBack={() => navigation.goBack()} />
                )}
              </Stack.Screen>
              <Stack.Screen name="YourDay">
                {({ navigation }) => (
                  <YourDay onBack={() => navigation.goBack()} />
                )}
              </Stack.Screen>
              <Stack.Screen name="AddChild">
                {({ navigation }) => (
                  <AddChildScreen
                    onComplete={async (kidId) => {
                      // Reload kids list
                      if (user?.uid) {
                        const kidsList = await listKids(user.uid);
                        setKids(kidsList);
                        const newKid = kidsList.find(k => k.id === kidId);
                        if (newKid) setSelectedKid(newKid);
                      }
                      navigation.goBack();
                    }}
                    onCancel={() => navigation.goBack()}
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
                    categories={selectedCategories}
                    progress={categoryProgress}
                    onSelectCategory={(category) => {
                      navigation.navigate('MomentCards', { category });
                    }}
                    onComplete={() => {
                      navigation.navigate('CompletionScreen');
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
