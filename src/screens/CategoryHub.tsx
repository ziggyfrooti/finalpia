import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { FloatingCard } from '../components/FloatingCard';
import { PiaButton } from '../components/PiaButton';
import { ProgressRing } from '../components/ProgressRing';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Mascot } from '../components/Mascot';
import { FloatingSparkles } from '../components/FloatingSparkles';
import { getCategoryLabel, getCategoryEmoji } from '../data/categories';
import { Colors } from '../constants/theme';

interface CategoryHubProps {
  categories: string[];
  progress: Record<string, number>;
  onSelectCategory: (category: string) => void;
  onComplete: () => void;
}

export default function CategoryHub({
  categories,
  progress,
  onSelectCategory,
  onComplete,
}: CategoryHubProps) {
  const handleContinue = () => {
    const nextIncomplete = categories.find((c) => (progress?.[c] ?? 0) < 100);
    if (nextIncomplete) onSelectCategory(nextIncomplete);
  };

  // Check if all categories are complete
  const allCategoriesComplete = useMemo(() => {
    return categories.every(c => (progress?.[c] ?? 0) === 100);
  }, [categories, progress]);

  return (
    <ScreenWrapper>
      <FloatingSparkles count={8} />
      <ScrollView contentContainerStyle={styles.container}>
      {/* Header with Mascot */}
      <View style={styles.header}>
        <View style={styles.mascotContainer}>
          <Mascot 
            size="lg" 
            type={allCategoriesComplete ? 'celebrating' : 'happy'} 
            animate={true}
          />
        </View>
        <Text style={styles.title}>My Day Progress</Text>
        <Text style={styles.subtitle}>Tap a category to continue ✨</Text>
      </View>

      {/* Reminder banner when all complete */}
      {allCategoriesComplete && (
        <View style={styles.reminderBanner}>
          <Text style={styles.reminderIcon}>✉️</Text>
          <Text style={styles.reminderText}>
            Ready to send to parent! Tap "Done for Today" below to share your reflections.
          </Text>
        </View>
      )}

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        {categories.map((categoryId, index) => {
          const label = getCategoryLabel(categoryId);
          const icon = getCategoryEmoji(categoryId);
          const categoryProgress = progress?.[categoryId] ?? 0;
          const isComplete = categoryProgress === 100;

          return (
            <TouchableOpacity
              key={categoryId}
              onPress={() => !isComplete && onSelectCategory(categoryId)}
              disabled={isComplete}
              activeOpacity={0.7}
            >
              <FloatingCard style={isComplete ? styles.completedCard : undefined}>
                <View style={styles.categoryCard}>
                  <ProgressRing
                    progress={categoryProgress}
                    size={56}
                    color={isComplete ? '#7DD3C0' : '#FF9B8A'}
                  />

                  <View style={styles.categoryContent}>
                    <Text style={styles.categoryLabel}>{label}</Text>
                    <Text style={styles.categoryStatus}>
                      {isComplete ? 'Complete!' : `${categoryProgress}% complete`}
                    </Text>
                  </View>

                  {!isComplete && (
                    <Text style={styles.chevron}>›</Text>
                  )}
                </View>
              </FloatingCard>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <PiaButton onPress={onComplete}>
          Done for Today
        </PiaButton>

        <TouchableOpacity onPress={handleContinue} style={styles.continueButton}>
          <Text style={styles.continueButtonText}>
            Continue where I left off
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  mascotContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  categoriesContainer: {
    flex: 1,
    gap: 16,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  completedCard: {
    opacity: 0.7,
  },
  categoryContent: {
    flex: 1,
  },
  categoryLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  categoryStatus: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  chevron: {
    fontSize: 28,
    color: Colors.primary,
  },
  actionsContainer: {
    marginTop: 32,
    gap: 12,
  },
  continueButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  reminderBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent5,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  reminderIcon: {
    fontSize: 32,
  },
  reminderText: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    lineHeight: 20,
    fontWeight: '500',
  },
});
