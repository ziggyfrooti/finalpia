import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, PanResponder, Dimensions, Alert } from 'react-native';
import { FloatingCard } from '../components/FloatingCard';
import { PiaButton } from '../components/PiaButton';
import { CategoryTile } from '../components/CategoryTile';
import { saveParentSwipe, getCurrentUser } from '../lib/db';
import { ScreenWrapper } from '../components/ScreenWrapper';

interface YourDayProps {
  onBack: () => void;
}

const adultCategories = [
  { id: 'family', label: 'Family', icon: <Text>🏠</Text> },
  { id: 'children', label: 'Children', icon: <Text>❤️</Text> },
  { id: 'work', label: 'Work', icon: <Text>💼</Text> },
  { id: 'colleagues', label: 'Colleagues', icon: <Text>👥</Text> },
  { id: 'friends', label: 'Friends', icon: <Text>☕</Text> },
  { id: 'self', label: 'Self', icon: <Text>🧘</Text> },
];

const adultMoments: Record<string, { text: string; emoji: string }[]> = {
  family: [
    { text: 'Had a meaningful conversation', emoji: '💬' },
    { text: 'Shared a meal together', emoji: '🍽️' },
    { text: 'Laughed together', emoji: '😄' },
    { text: 'Helped with something', emoji: '🤝' },
  ],
  children: [
    { text: 'Had quality one-on-one time', emoji: '💝' },
    { text: 'Played or did an activity together', emoji: '🎨' },
    { text: 'Had a bedtime conversation', emoji: '🌙' },
    { text: 'Solved a problem together', emoji: '🧩' },
  ],
  work: [
    { text: "Completed something I'm proud of", emoji: '⭐' },
    { text: 'Had a productive meeting', emoji: '📊' },
    { text: 'Learned something new', emoji: '💡' },
    { text: 'Felt overwhelmed', emoji: '😰' },
  ],
  colleagues: [
    { text: 'Had a good collaboration', emoji: '🤝' },
    { text: 'Received helpful feedback', emoji: '📝' },
    { text: 'Helped someone else', emoji: '🌟' },
  ],
  friends: [
    { text: 'Had a meaningful chat', emoji: '💬' },
    { text: 'Shared something funny', emoji: '😂' },
    { text: 'Made plans together', emoji: '📅' },
  ],
  self: [
    { text: 'Had time to relax', emoji: '🛀' },
    { text: 'Did something I enjoy', emoji: '🎵' },
    { text: 'Felt energized', emoji: '✨' },
    { text: 'Felt drained', emoji: '😓' },
  ],
};

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = 100;

export default function YourDay({ onBack }: YourDayProps) {
  const [step, setStep] = useState<'select' | 'swipe'>('select');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const position = new Animated.ValueXY();

  const currentCategory = selectedCategories[currentCategoryIndex];
  const moments = currentCategory ? adultMoments[currentCategory] || [] : [];
  const currentMoment = moments[currentCardIndex];

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
    // Save to Firestore
    const user = getCurrentUser();
    if (user && currentMoment) {
      try {
        await saveParentSwipe({
          uid: user.uid,
          category: currentCategory,
          cardIndex: currentCardIndex,
          cardText: currentMoment.text,
          choice: direction,
        });
      } catch (error) {
        console.error('Failed to save parent swipe:', error);
        Alert.alert('Error', 'Could not save. Please try again.');
        return;
      }
    }

    Animated.timing(position, {
      toValue: { x: direction === 'yes' ? width : -width, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      if (currentCardIndex < moments.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
        position.setValue({ x: 0, y: 0 });
      } else {
        // Move to next category or finish
        if (currentCategoryIndex < selectedCategories.length - 1) {
          setCurrentCategoryIndex(currentCategoryIndex + 1);
          setCurrentCardIndex(0);
          position.setValue({ x: 0, y: 0 });
        } else {
          onBack();
        }
      }
    });
  };

  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-20deg', '0deg', '20deg'],
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

  if (step === 'select') {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Your Day</Text>
          <Text style={styles.subtitle}>Choose areas to reflect on</Text>
        </View>

        {/* Categories */}
        <View style={styles.categoriesGrid}>
          {adultCategories.map((cat) => (
            <View key={cat.id} style={styles.categoryItem}>
              <CategoryTile
                icon={cat.icon}
                label={cat.label}
                selected={selectedCategories.includes(cat.id)}
                onClick={() => {
                  setSelectedCategories((prev) =>
                    prev.includes(cat.id) ? prev.filter((c) => c !== cat.id) : [...prev, cat.id]
                  );
                }}
              />
            </View>
          ))}
        </View>

        {/* Continue Button */}
        <View style={styles.footer}>
          <PiaButton
            onPress={() => {
              if (selectedCategories.length > 0) {
                setStep('swipe');
              }
            }}
            disabled={selectedCategories.length === 0}
          >
            Start Reflecting
          </PiaButton>
        </View>
      </ScrollView>
    );
  }

  // Swipe view
  if (!currentMoment) {
    return null;
  }

  const progress = ((currentCardIndex + 1) / moments.length) * 100;

  return (
    <View style={styles.swipeContainer}>
      {/* Header */}
      <View style={styles.swipeHeader}>
        <View style={styles.swipeHeaderLeft}>
          <Text style={styles.swipeCategory}>{currentCategory}</Text>
          <Text style={styles.swipeProgress}>
            {currentCardIndex + 1} of {moments.length}
          </Text>
        </View>
        <TouchableOpacity onPress={onBack} style={styles.closeButton}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <Animated.View style={[styles.progressBarFill, { width: `${progress}%` }]} />
      </View>

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
              <Text style={styles.cardEmoji}>{currentMoment.emoji}</Text>
              <Text style={styles.cardText}>{currentMoment.text}</Text>
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

      <Text style={styles.hint}>Swipe right if this happened • Swipe left if it didn't</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FBF9F4',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    marginBottom: 32,
  },
  backButton: {
    marginBottom: 12,
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
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 32,
  },
  categoryItem: {
    width: '47%',
  },
  footer: {
    marginTop: 32,
  },
  swipeContainer: {
    flex: 1,
    backgroundColor: '#FBF9F4',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  swipeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  swipeHeaderLeft: {
    flex: 1,
  },
  swipeCategory: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  swipeProgress: {
    fontSize: 14,
    color: '#64748B',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 20,
    color: '#64748B',
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
    backgroundColor: '#FFB4A2',
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
    backgroundColor: '#FFB4A2',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFB4A2',
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
