import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { PiaButton } from '../components/PiaButton';
import { CategoryTile } from '../components/CategoryTile';

interface PartsOfMyDayProps {
  onContinue: (selectedCategories: string[]) => void;
}

const categoryIcon = (emoji: string) => <Text style={{ fontSize: 20, color: '#7DD3C0' }}>{emoji}</Text>;

const categories = [
  {
    id: 'lunch',
    label: 'Lunch',
    icon: categoryIcon('🍽️'),
  },
  {
    id: 'recess',
    label: 'Recess',
    icon: categoryIcon('👥'),
  },
  {
    id: 'classroom',
    label: 'Classroom',
    icon: categoryIcon('📚'),
  },
  {
    id: 'specials',
    label: 'Specials',
    icon: categoryIcon('🎨'),
  },
  {
    id: 'transport',
    label: 'Bus / Carline',
    icon: categoryIcon('🚌'),
  },
];

export default function PartsOfMyDay({ onContinue }: PartsOfMyDayProps) {
  const [selected, setSelected] = useState<string[]>(['lunch', 'recess', 'classroom']);

  const toggleCategory = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Parts of My Day</Text>
        <Text style={styles.subtitle}>Choose what you want to talk about</Text>
      </View>

      {/* Categories Grid */}
      <View style={styles.grid}>
        {categories.map((category) => (
          <View key={category.id} style={styles.gridItem}>
            <CategoryTile
              icon={category.icon}
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
