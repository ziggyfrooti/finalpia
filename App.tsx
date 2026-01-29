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
import { saveSwipe, getCurrentUser, listKids, createTodayCheckin, type Kid, getParentProfile, lockCheckin, updateCategoryProgress, getCheckinByDate, updateSelectedCategories } from './src/lib/db';
import { SoundManager } from './src/utils/SoundManager';
import { isWeekend as checkIsWeekend, DEFAULT_TIMEZONE, getTodayDateString } from './src/lib/dateUtils';

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
  const [kids, setKids] = useState<Kid[]>([]);
  const [selectedKid, setSelectedKid] = useState<Kid | null>(null);
  const [currentCheckinId, setCurrentCheckinId] = useState<string | null>(null);
  const [kidsLoading, setKidsLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoryProgress, setCategoryProgress] = useState<Record<string, number>>({});
  const [needsParentSetup, setNeedsParentSetup] = useState<boolean>(false);
  const [isNewUser, setIsNewUser] = useState<boolean>(false);
  const [parentTimezone, setParentTimezone] = useState<string>(DEFAULT_TIMEZONE);
  const [checkInSent, setCheckInSent] = useState<boolean>(false);

  // Initialize SoundManager on app start
  React.useEffect(() => {
    SoundManager.init();
  }, []);

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

        // Load parent's timezone
        if (parentProfile.timezone) {
          setParentTimezone(parentProfile.timezone);
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

  // Load existing check-in and progress when kid is selected
  React.useEffect(() => {
    async function loadExistingCheckin() {
      if (!user?.uid || !selectedKid?.id) {
        setCurrentCheckinId(null);
        setSelectedCategories([]);
        setCategoryProgress({});
        return;
      }

      try {
        const todayDate = getTodayDateString(parentTimezone);
        const existingCheckin = await getCheckinByDate({
          uid: user.uid,
          kidId: selectedKid.id,
          date: todayDate,
        });

        if (existingCheckin && !existingCheckin.isLocked) {
          // Resume existing check-in
          setCurrentCheckinId(existingCheckin.id);
          setSelectedCategories(existingCheckin.selectedCategories || []);
          setCategoryProgress(existingCheckin.categoryProgress || {});
        } else {
          // No resumable check-in
          setCurrentCheckinId(null);
          setSelectedCategories([]);
          setCategoryProgress({});
        }
      } catch (error) {
        console.error('Failed to load existing check-in:', error);
      }
    }

    loadExistingCheckin();
  }, [user?.uid, selectedKid?.id, parentTimezone]);

  // Save progress to Firestore with debouncing to reduce writes
  React.useEffect(() => {
    if (!user?.uid || !selectedKid?.id || !currentCheckinId) return;

    // Don't save if progress is empty
    if (Object.keys(categoryProgress).length === 0) return;

    // Debounce: only save 2 seconds after last change
    const timeoutId = setTimeout(async () => {
      try {
        await updateCategoryProgress({
          uid: user.uid,
          kidId: selectedKid.id,
          checkinId: currentCheckinId,
          categoryProgress,
        });
      } catch (error) {
        console.error('Failed to save progress:', error);
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [categoryProgress, user?.uid, selectedKid?.id, currentCheckinId]);

  // Google login removed - signInWithPopup() doesn't work in React Native
  // For future Google auth support, use @react-native-firebase/auth or Expo AuthSession

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading...</Text>
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
                      // Don't change needsParentSetup here - let AddChild handle it
                      navigation.replace('AddChild');
                    }}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="AddChild">
                {({ navigation }) => (
                  <AddChildScreen
                    onComplete={async (kidId) => {
                      console.log('AddChild onComplete called with kidId:', kidId);
                      // Reload kids list
                      if (user?.uid) {
                        const kidsList = await listKids(user.uid);
                        console.log('Kids list reloaded:', kidsList.length);
                        setKids(kidsList);
                        const newKid = kidsList.find(k => k.id === kidId);
                        if (newKid) setSelectedKid(newKid);
                      }
                      // Exit parent setup mode before navigating
                      console.log('Setting needsParentSetup to false');
                      setNeedsParentSetup(false);
                      // Use setTimeout to ensure state update completes before navigation
                      setTimeout(() => {
                        console.log('Navigating to ModeSelector');
                        navigation.replace('ModeSelector');
                      }, 300);
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
                    userEmail={user?.email}
                    onLogout={() => {
                      // Auth listener will handle navigation to login screen
                    }}
                    lastActivityDate={undefined}
                    hasNewUpdates={false}
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
                    timezone={parentTimezone}
                    isWeekend={checkIsWeekend(parentTimezone)}
                    initialSelections={selectedCategories.length > 0 ? selectedCategories : undefined}
                    onBack={() => {
                      // Clear state and go back
                      setSelectedCategories([]);
                      setCategoryProgress({});
                      setCurrentCheckinId(null);
                      navigation.navigate('ModeSelector');
                    }}
                    onContinue={async (categories) => {
                      // Validation
                      if (categories.length === 0) {
                        Alert.alert('No Categories Selected', 'Please select at least one category to continue.');
                        return;
                      }

                      if (!user?.uid) {
                        Alert.alert('Not Logged In', 'Please log in to continue.');
                        return;
                      }

                      if (!selectedKid?.id) {
                        Alert.alert('No Child Selected', 'Please select a child first.');
                        return;
                      }

                      try {
                        // Check if today's check-in exists
                        const todayDate = getTodayDateString(parentTimezone);
                        console.log('🗓️ Checking for check-in on date:', todayDate);
                        const existingCheckin = await getCheckinByDate({
                          uid: user.uid,
                          kidId: selectedKid.id,
                          date: todayDate,
                        });

                        if (existingCheckin) {
                          console.log('📋 Found check-in:', {
                            id: existingCheckin.id,
                            date: existingCheckin.date,
                            isLocked: existingCheckin.isLocked,
                            selectedCategories: existingCheckin.selectedCategories,
                            categoryProgress: existingCheckin.categoryProgress,
                          });
                        } else {
                          console.log('❌ No check-in found for today');
                        }

                        // If check-in exists and is locked (already sent to parent)
                        if (existingCheckin?.isLocked) {
                          // Set the state with the completed check-in data
                          setCurrentCheckinId(existingCheckin.id);
                          setSelectedCategories(existingCheckin.selectedCategories || []);
                          setCategoryProgress(existingCheckin.categoryProgress || {});
                          setCheckInSent(true); // Mark as already sent
                          // Navigate to CompletionScreen showing "already sent" state
                          navigation.navigate('CompletionScreen');
                          return;
                        }

                        // If check-in exists but NOT locked → check if categories changed
                        if (existingCheckin) {
                          // Check if user changed category selection
                          const existingCats = existingCheckin.selectedCategories || [];
                          const newCats = categories.sort();
                          const oldCats = existingCats.sort();
                          const categoriesChanged = JSON.stringify(newCats) !== JSON.stringify(oldCats);

                          if (categoriesChanged) {
                            // Update check-in with new categories
                            await updateSelectedCategories({
                              uid: user.uid,
                              kidId: selectedKid.id,
                              checkinId: existingCheckin.id,
                              selectedCategories: categories,
                            });

                            // Reset progress for new categories
                            const newProgress: Record<string, number> = {};
                            categories.forEach(cat => {
                              newProgress[cat] = 0;
                            });
                            await updateCategoryProgress({
                              uid: user.uid,
                              kidId: selectedKid.id,
                              checkinId: existingCheckin.id,
                              categoryProgress: newProgress,
                            });

                            setCurrentCheckinId(existingCheckin.id);
                            setSelectedCategories(categories);
                            setCategoryProgress(newProgress);
                            navigation.navigate('CategoryHub');
                            return;
                          }

                          const allComplete = existingCheckin.selectedCategories?.every(
                            cat => (existingCheckin.categoryProgress?.[cat] ?? 0) === 100
                          );
                          console.log('✅ All categories complete?', allComplete);

                          if (allComplete) {
                            console.log('🎯 Navigating to CompletionScreen - check-in complete but not sent');
                            // Check-in complete but not sent yet → go to completion screen
                            setCurrentCheckinId(existingCheckin.id);
                            setSelectedCategories(existingCheckin.selectedCategories || []);
                            setCategoryProgress(existingCheckin.categoryProgress || {});
                            navigation.navigate('CompletionScreen');
                            return;
                          }

                          console.log('⏸️ Navigating to CategoryHub - check-in incomplete, resuming');
                          // Not all complete → resume existing check-in
                          setCurrentCheckinId(existingCheckin.id);
                          setSelectedCategories(existingCheckin.selectedCategories || []);
                          setCategoryProgress(existingCheckin.categoryProgress || {});
                          navigation.navigate('CategoryHub');
                          return;
                        }

                        console.log('🆕 No check-in found for today, creating new one');
                        // No existing check-in → create new one
                        const checkinId = await createTodayCheckin({
                          uid: user.uid,
                          kidId: selectedKid.id,
                          selectedCategories: categories,
                          timezone: parentTimezone,
                        });
                        console.log('✅ Created new check-in:', checkinId);
                        setCurrentCheckinId(checkinId);
                        setSelectedCategories(categories);
                        // Initialize progress for all categories
                        setCategoryProgress(prev => {
                          const newProgress: Record<string, number> = { ...prev };
                          categories.forEach(cat => {
                            if (newProgress[cat] === undefined) {
                              newProgress[cat] = 0;
                            }
                          });
                          return newProgress;
                        });
                        console.log('🚀 Navigating to CategoryHub with new check-in');
                        navigation.navigate('CategoryHub');
                      } catch (error) {
                        console.error('Failed to handle check-in:', error);
                        Alert.alert('Error', 'Could not start check-in. Please try again.');
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
                      // Mark category as complete (finished all cards)
                      const category = route.params?.category || 'lunch';
                      setCategoryProgress(prev => ({ ...prev, [category]: 100 }));
                      // Navigate back to CategoryHub
                      navigation.navigate('CategoryHub');
                    }}
                    onDone={() => {
                      // User clicked "Done for Today" - go to CategoryHub
                      navigation.navigate('CategoryHub');
                    }}
                    onChangeCategory={() => {
                      // User clicked "Change Category" - go back to category selection
                      navigation.navigate('PartsOfMyDay');
                    }}
                    onProgressUpdate={(progress: number) => {
                      // Update progress when user pauses/changes category mid-way
                      const category = route.params?.category || 'lunch';
                      setCategoryProgress(prev => ({ ...prev, [category]: Math.round(progress) }));
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
                    isSent={checkInSent}
                    onContinue={() => {
                      // Clear state and go back to mode selector
                      setCheckInSent(false);
                      setCurrentCheckinId(null);
                      setSelectedCategories([]);
                      setCategoryProgress({});
                      navigation.navigate('ModeSelector');
                    }}
                    onSendToParent={async () => {
                      // Define the send function first (used in Alert callback and direct send)
                      const performSendToParent = async () => {
                        if (user?.uid && selectedKid?.id && currentCheckinId) {
                          try {
                            await lockCheckin({
                              uid: user.uid,
                              kidId: selectedKid.id,
                              checkinId: currentCheckinId,
                            });

                            // Mark as sent so UI updates
                            setCheckInSent(true);

                            // Show success message
                            Alert.alert(
                              'Sent to Parent! 🎉',
                              "Great job! Your parent can now see your reflections from today.",
                              [
                                {
                                  text: 'Done',
                                  onPress: () => {
                                    // Clear current check-in state
                                    setCheckInSent(false);
                                    setCurrentCheckinId(null);
                                    setSelectedCategories([]);
                                    setCategoryProgress({});
                                    navigation.navigate('ModeSelector');
                                  },
                                },
                              ]
                            );
                          } catch (error) {
                            console.error('Failed to lock check-in:', error);
                            Alert.alert('Error', 'Could not send to parent. Please try again.');
                          }
                        }
                      };

                      // Check if all categories are complete
                      const allComplete = selectedCategories.every(
                        cat => (categoryProgress[cat] ?? 0) === 100
                      );

                      const completedCount = selectedCategories.filter(
                        cat => (categoryProgress[cat] ?? 0) === 100
                      ).length;

                      // If not all complete, show confirmation
                      if (!allComplete) {
                        Alert.alert(
                          'Send Incomplete Reflection?',
                          `You've only completed ${completedCount} out of ${selectedCategories.length} categories. If you send now, you won't be able to add more reflections today.\n\nAre you sure you want to send?`,
                          [
                            {
                              text: 'Cancel',
                              style: 'cancel',
                            },
                            {
                              text: 'Send Anyway',
                              style: 'destructive',
                              onPress: async () => {
                                // Proceed with sending
                                await performSendToParent();
                              },
                            },
                          ]
                        );
                        return;
                      }

                      // All complete, send directly
                      await performSendToParent();
                    }}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="ParentSpaceHome">
                {({ navigation }) => (
                  <ParentSpaceHome
                    onNavigate={(screen) => {
                      switch (screen) {
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
                    userEmail={user?.email}
                    onLogout={() => {
                      // Auth listener will handle navigation to login screen
                    }}
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
