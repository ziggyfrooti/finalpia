import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, PanResponder, Dimensions, Alert } from 'react-native';
import { FloatingCard } from '../components/FloatingCard';
import { SoundManager } from '../utils/SoundManager';
import { getRandomCards } from '../data/cardPools';

interface MomentCardsProps {
  category: string;
  onComplete: () => void;
  onDone: () => void;
  onChangeCategory?: () => void;
  onProgressUpdate: (progress: number) => void;
  onSwipe: (payload: {
    category: string;
    cardIndex: number;
    cardText: string;
    choice: 'yes' | 'no' | 'unsure';
  }) => void;
}

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = 100;
const SWIPE_UP_THRESHOLD = 80;

export default function MomentCards({ category, onComplete, onDone, onChangeCategory, onProgressUpdate, onSwipe }: MomentCardsProps) {
  // Get random 8 cards from the pool for this category
  // useState with initializer ensures cards regenerate each time user enters category
  const [cards] = useState(() => getRandomCards(category, 8));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPause, setShowPause] = useState(false);
  const position = new Animated.ValueXY();

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dy < -SWIPE_UP_THRESHOLD && Math.abs(gesture.dx) < SWIPE_THRESHOLD) {
        // Swipe up for "unsure"
        handleSwipe('unsure');
      } else if (gesture.dx > SWIPE_THRESHOLD) {
        handleSwipe('yes');
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        handleSwipe('no');
      } else {
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      }
    },
  });

  const handleSwipe = async (direction: 'yes' | 'no' | 'unsure') => {
    // Play sound immediately for instant feedback
    if (direction === 'yes') {
      SoundManager.play('swipeYes');
    } else if (direction === 'no') {
      SoundManager.play('swipeNo');
    }
    // No sound for 'unsure' - could add a third sound in future

    try {
      await onSwipe({
        category,
        cardIndex: currentIndex,
        cardText: cards[currentIndex]?.text ?? '',
        choice: direction,
      });
    } catch (e: any) {
      console.error('Firestore swipe write failed:', e);

      // Provide helpful error messages based on error type
      let errorMessage = 'Could not save your response. Please try again.';

      if (e?.code === 'permission-denied') {
        errorMessage = 'Permission denied. Please check your account settings.';
      } else if (e?.message?.includes('network') || e?.message?.includes('Failed to get document')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (e?.code === 'unavailable') {
        errorMessage = 'Service temporarily unavailable. Please try again in a moment.';
      }

      Alert.alert('Error Saving Response', errorMessage);
      return;
    }

    const animationTarget =
      direction === 'yes' ? { x: width, y: 0 } :
      direction === 'no' ? { x: -width, y: 0 } :
      { x: 0, y: -300 }; // Swipe up for unsure

    Animated.timing(position, {
      toValue: animationTarget,
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      if (currentIndex < cards.length - 1) {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        position.setValue({ x: 0, y: 0 });

        // Update progress after each swipe (debounced by App.tsx)
        const percentComplete = Math.round((nextIndex / cards.length) * 100);
        onProgressUpdate(percentComplete);
      } else {
        // Play category complete sound when finishing all cards
        SoundManager.play('categoryComplete');
        onComplete();
      }
    });
  };

  const goBackOne = () => {
    setShowPause(false);
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
    position.setValue({ x: 0, y: 0 });
  };

  // Handle empty card pools
  if (cards.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.categoryTitle}>{category}</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>😕</Text>
          <Text style={styles.emptyMessage}>
            No cards available for this category.
          </Text>
          <TouchableOpacity onPress={onDone} style={styles.emptyButton}>
            <Text style={styles.emptyButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (currentIndex >= cards.length) return null;

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-25deg', '0deg', '25deg'],
    extrapolate: 'clamp',
  });

  const noOpacity = position.x.interpolate({
    inputRange: [-200, -50, 0],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const yesOpacity = position.x.interpolate({
    inputRange: [0, 50, 200],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  const unsureOpacity = position.y.interpolate({
    inputRange: [-200, -50, 0],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.categoryTitle}>{category}</Text>
          <Text style={styles.progressText}>
            {currentIndex + 1} of {cards.length}
          </Text>
        </View>
        <TouchableOpacity onPress={() => setShowPause(!showPause)} style={styles.pauseButton}>
          <Text style={styles.pauseIcon}>⏸️</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <Animated.View style={[styles.progressBarFill, { width: `${progress}%` }]} />
      </View>

      {/* Pause Menu */}
      {showPause && (
        <View style={styles.pauseMenu}>
          <FloatingCard>
            <TouchableOpacity
              disabled={currentIndex === 0}
              onPress={goBackOne}
              style={[styles.pauseMenuItem, currentIndex === 0 && styles.pauseMenuItemDisabled]}
            >
              <Text style={[styles.pauseMenuText, currentIndex === 0 && styles.pauseMenuTextDisabled]}>
                Go Back One Card
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setShowPause(false);
                // Save current progress before changing category
                const currentProgress = ((currentIndex + 1) / cards.length) * 100;
                onProgressUpdate(currentProgress);
                if (onChangeCategory) {
                  onChangeCategory();
                } else {
                  onDone();
                }
              }}
              style={styles.pauseMenuItem}
            >
              <Text style={styles.pauseMenuText}>Change Category</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setShowPause(false);
                // Save current progress before ending
                const currentProgress = ((currentIndex + 1) / cards.length) * 100;
                onProgressUpdate(currentProgress);
                onDone();
              }}
              style={styles.pauseMenuItem}
            >
              <Text style={styles.pauseMenuText}>Done for Today</Text>
            </TouchableOpacity>
          </FloatingCard>
        </View>
      )}

      {/* Swipe Card */}
      <View style={styles.cardContainer}>
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.card,
            {
              transform: [{ translateX: position.x }, { rotate }],
            },
          ]}
        >
          <FloatingCard>
            <View style={styles.cardContent}>
              <Text style={styles.cardEmoji}>{currentCard.emoji}</Text>
              <Text style={styles.cardText}>{currentCard.text}</Text>
            </View>
          </FloatingCard>
        </Animated.View>

        {/* Swipe Indicators */}
        <Animated.View style={[styles.indicator, styles.indicatorLeft, { opacity: noOpacity }]}>
          <View style={styles.indicatorCircleNo}>
            <Text style={styles.indicatorIconNo}>✕</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.indicator, styles.indicatorRight, { opacity: yesOpacity }]}>
          <View style={styles.indicatorCircleYes}>
            <Text style={styles.indicatorIconYes}>✓</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.indicator, styles.indicatorTop, { opacity: unsureOpacity }]}>
          <View style={styles.indicatorCircleUnsure}>
            <Text style={styles.indicatorIconUnsure}>?</Text>
          </View>
        </Animated.View>
      </View>

      {/* Swipe Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={() => handleSwipe('no')} style={styles.buttonNo}>
          <Text style={styles.buttonNoIcon}>✕</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleSwipe('unsure')} style={styles.buttonUnsure}>
          <Text style={styles.buttonUnsureIcon}>?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleSwipe('yes')} style={styles.buttonYes}>
          <Text style={styles.buttonYesIcon}>✓</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.hint}>Swipe right (yes) • Swipe up (unsure) • Swipe left (no)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF9F4',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#64748B',
  },
  pauseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  pauseIcon: {
    fontSize: 20,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#7DD3C0',
  },
  pauseMenu: {
    marginBottom: 16,
  },
  pauseMenuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  pauseMenuItemDisabled: {
    opacity: 0.5,
  },
  pauseMenuText: {
    fontSize: 16,
    color: '#334155',
  },
  pauseMenuTextDisabled: {
    color: '#94A3B8',
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  card: {
    width: width - 48,
    maxWidth: 400,
  },
  cardContent: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  cardEmoji: {
    fontSize: 64,
    marginBottom: 24,
  },
  cardText: {
    fontSize: 20,
    color: '#1E293B',
    textAlign: 'center',
    lineHeight: 28,
  },
  indicator: {
    position: 'absolute',
    top: '50%',
    marginTop: -40,
  },
  indicatorLeft: {
    left: 32,
  },
  indicatorRight: {
    right: 32,
  },
  indicatorTop: {
    top: 100,
    left: '50%',
    marginLeft: -40,
  },
  indicatorCircleNo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFE5E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorIconNo: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FF9B8A',
  },
  indicatorCircleUnsure: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF4E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorIconUnsure: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FDB022',
  },
  indicatorCircleYes: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D4F4EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorIconYes: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#7DD3C0',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    marginTop: 32,
  },
  buttonNo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFE5E0',
    shadowColor: '#FF9B8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 4,
  },
  buttonNoIcon: {
    fontSize: 32,
    color: '#FF9B8A',
    fontWeight: 'bold',
  },
  buttonUnsure: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFF4E0',
    shadowColor: '#FDB022',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 4,
  },
  buttonUnsureIcon: {
    fontSize: 32,
    color: '#FDB022',
    fontWeight: 'bold',
  },
  buttonYes: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#7DD3C0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7DD3C0',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 8,
  },
  buttonYesIcon: {
    fontSize: 40,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  hint: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 24,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyMessage: {
    fontSize: 18,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 32,
  },
  emptyButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#7DD3C0',
    borderRadius: 20,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
