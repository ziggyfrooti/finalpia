import React, { ReactNode } from 'react';
import { SafeAreaView, View, StyleSheet, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/theme';

interface ScreenWrapperProps {
  children: ReactNode;
  statusBarStyle?: 'auto' | 'light' | 'dark' | 'inverted';
  backgroundColor?: string;
  useGradient?: boolean;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  statusBarStyle = 'dark',
  backgroundColor = Colors.background,
  useGradient = false,
}) => {
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <StatusBar style={statusBarStyle} />
      {useGradient ? (
        <LinearGradient
          colors={[Colors.background, '#FFFAF5', Colors.backgroundAlt]}
          style={styles.container}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {children}
        </LinearGradient>
      ) : (
        <View style={[styles.container, { backgroundColor }]}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
});
