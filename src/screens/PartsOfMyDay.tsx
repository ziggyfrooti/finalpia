import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { PiaButton } from '../components/PiaButton';
import { CategoryTile } from '../components/CategoryTile';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Mascot } from '../components/Mascot';
import { FloatingSparkles } from '../components/FloatingSparkles';
import { getCategories } from '../data/categories';
import { isWeekend as checkIsWeekend } from '../lib/dateUtils';
import { Colors } from '../constants/theme';

interface PartsOfMyDayProps {
  onContinue: (selectedCategories: string[]) => void;
  onBack?: () => void; // Optional back button handler
  timezone?: string;
  isWeekend?: boolean; // Can be passed from parent or auto-detected
  initialSelections?: string[]; // Existing selections when resuming
}

const categoryIcon = (emoji: string) => <Text style={{ fontSize: 20, color: '#7DD3C0' }}>{emoji}</Text>;

export default function PartsOfMyDay({ onContinue, onBack, timezone = 'America/New_York', isWeekend, initialSelections }: PartsOfMyDayProps) {
  // Detect if weekend (use prop if provided, otherwise calculate)
  const isWeekendDay = useMemo(() => {
    if (isWeekend !== undefined) return isWeekend;
    return checkIsWeekend(timezone);
  }, [isWeekend, timezone]);

  // Get appropriate categories for today
  const categories = useMemo(() => {
    return getCategories(isWeekendDay);
  }, [isWeekendDay]);

  // Default selections based on day type
  const defaultSelections = useMemo(() => {
    if (isWeekendDay) {
      // Weekend: pre-select Family Time, Activities, Outdoor
      return ['family-time', 'activities', 'outdoor'];
    } else {
      // Weekday: pre-select Lunch, Recess, Classroom
      return ['lunch', 'recess', 'classroom'];
    }
  }, [isWeekendDay]);

  // Use initialSelections if provided, otherwise use defaults
  const [selected, setSelected] = useState<string[]>(initialSelections || defaultSelections);

  const toggleCategory = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  return (
    <ScreenWrapper useGradient={true}>
      <FloatingSparkles count={8} />
      <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button */}
      {onBack && (
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      )}

      {/* Header with Mascot */}
      <View style={styles.header}>
        <View style={styles.mascotContainer}>
          <Mascot size="lg" type="happy" animate={true} />
        </View>
        <Text style={styles.title}>
          {isWeekendDay ? 'My Weekend' : 'Parts of My Day'}
        </Text>
        <Text style={styles.subtitle}>Choose what you want to talk about ✨</Text>
      </View>

      {/* Categories Grid */}
      <View style={styles.grid}>
        {categories.map((category) => (
          <View key={category.id} style={styles.gridItem}>
            <CategoryTile
              icon={categoryIcon(category.emoji)}
              label={category.label}
              selected={selected.includes(category.id)}
              onClick={() => toggleCategory(category.id)}
            />
          </View>
        ))}
      </View>

      {/* Selected Counter & Continue */}
      <View style={styles.footer}>
        <View style={styles.counter}>
          <View style={styles.counterBadge}>
            <Text style={styles.counterBadgeText}>{selected.length}</Text>
          </View>
          <Text style={styles.counterText}>
            {selected.length === 1 ? 'part selected' : 'parts selected'}
          </Text>
        </View>

        <PiaButton
          onPress={() => {
            if (selected.length === 0) {
              Alert.alert(
                'Select Categories',
                'Please select at least one part of your day to talk about.'
              );
              return;
            }
            onContinue(selected);
          }}
          style={styles.continueButton}
        >
          Continue
        </PiaButton>
      </View>
    </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  backButton: {
    marginBottom: 16,
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '600',
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
    fontWeight: '500',
  },
  grid: {
    gap: 12,
    marginBottom: 32,
  },
  gridItem: {
    width: '100%',
  },
  footer: {
    marginTop: 32,
    gap: 16,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: Colors.primaryLight,
    borderRadius: 20,
    alignSelf: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  counterBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBadgeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  counterText: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '600',
  },
  continueButton: {
    width: '100%',
  },
});
