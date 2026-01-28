import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { PiaButton } from '../components/PiaButton';
import { CategoryTile } from '../components/CategoryTile';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { getCategories } from '../data/categories';
import { isWeekend as checkIsWeekend } from '../lib/dateUtils';

interface PartsOfMyDayProps {
  onContinue: (selectedCategories: string[]) => void;
  timezone?: string;
  isWeekend?: boolean; // Can be passed from parent or auto-detected
  initialSelections?: string[]; // Existing selections when resuming
}

const categoryIcon = (emoji: string) => <Text style={{ fontSize: 20, color: '#7DD3C0' }}>{emoji}</Text>;

export default function PartsOfMyDay({ onContinue, timezone = 'America/New_York', isWeekend, initialSelections }: PartsOfMyDayProps) {
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
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {isWeekendDay ? 'My Weekend' : 'Parts of My Day'}
        </Text>
        <Text style={styles.subtitle}>Choose what you want to talk about</Text>
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
          onPress={() => onContinue(selected)}
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
    backgroundColor: '#FBF9F4',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    marginBottom: 32,
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 32,
  },
  gridItem: {
    width: '47%',
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignSelf: 'center',
  },
  counterBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#7DD3C0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  counterText: {
    fontSize: 14,
    color: '#334155',
  },
  continueButton: {
    width: '100%',
  },
});
