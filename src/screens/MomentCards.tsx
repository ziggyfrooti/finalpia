import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, PanResponder, Dimensions, Alert } from 'react-native';
import { FloatingCard } from '../components/FloatingCard';
import { saveSwipe, getCurrentUser } from '../lib/db';
import { ScreenWrapper } from '../components/ScreenWrapper';
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
    choice: 'yes' | 'no';
  }) => void;
}

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = 100;

export default function MomentCards({ category, onComplete, onDone, onChangeCategory, onProgressUpdate, onSwipe }: MomentCardsProps) {
  // Get random 8 cards from the pool for this category
  // useMemo ensures we get the same cards for this session
  const cards = useMemo(() => getRandomCards(category, 8), [category]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPause, setShowPause] = useState(false);
  const position = new Animated.ValueXY();

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      position.setValue({ x: gesture.dx, y: 0 });
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
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

  const handleSwipe = async (direction: 'yes' | 'no') => {
    // Play sound immediately for instant feedback
    SoundManager.play(direction === 'yes' ? 'swipeYes' : 'swipeNo');

    try {
      await onSwipe({
        category,
        cardIndex: currentIndex,
        cardText: cards[currentIndex]?.text ?? '',
        choice: direction,
      });
    } catch (e) {
      console.error('Firestore swipe write failed:', e);
      Alert.alert('Error', 'Could not save swipe. Please try again.');
      return;
    }

    Animated.timing(position, {
      toValue: { x: direction === 'yes' ? width : -width, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        position.setValue({ x: 0, y: 0 });
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
      </View>

      {/* Swipe Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={() => handleSwipe('no')} style={styles.buttonNo}>
          <Text style={styles.buttonNoIcon}>✕</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleSwipe('yes')} style={styles.buttonYes}>
          <Text style={styles.buttonYesIcon}>✓</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.hint}>Swipe right if it happened • Swipe left if it didn't</Text>
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
});
