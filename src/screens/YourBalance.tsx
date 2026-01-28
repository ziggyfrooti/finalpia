import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { FloatingCard } from '../components/FloatingCard';
import { PiaButton } from '../components/PiaButton';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { ScreenWrapper } from '../components/ScreenWrapper';

interface YourBalanceProps {
  onBack: () => void;
}

const { width } = Dimensions.get('window');
const chartSize = Math.min(width - 80, 350);

const bubbleData = [
  { category: 'Children', size: 140, color: '#7DD3C0', x: 45, y: 35, sentiment: 'positive' },
  { category: 'Work', size: 120, color: '#FFB4A2', x: 25, y: 60, sentiment: 'mixed' },
  { category: 'Family', size: 100, color: '#B4EFE3', x: 65, y: 55, sentiment: 'positive' },
  { category: 'Self', size: 60, color: '#FFDAD4', x: 50, y: 75, sentiment: 'needs-attention' },
  { category: 'Friends', size: 50, color: '#E2E8F0', x: 75, y: 40, sentiment: 'neutral' },
];

const weeklyData = [
  { label: 'Children', count: 24, color: '#7DD3C0' },
  { label: 'Work', count: 18, color: '#FFB4A2' },
  { label: 'Family', count: 15, color: '#B4EFE3' },
  { label: 'Self', count: 6, color: '#FFDAD4' },
  { label: 'Friends', count: 4, color: '#E2E8F0' },
];

export default function YourBalance({ onBack }: YourBalanceProps) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Your Balance</Text>
        <Text style={styles.subtitle}>This week's gentle overview</Text>
      </View>

      {/* Bubble Chart */}
      <FloatingCard style={styles.chartCard}>
        <Svg width={chartSize} height={chartSize * 0.7} viewBox="0 0 100 100">
          {bubbleData.map((bubble, index) => (
            <React.Fragment key={bubble.category}>
              {/* Bubble glow */}
              <Circle
                cx={bubble.x}
                cy={bubble.y}
                r={bubble.size / 16}
                fill={bubble.color}
                opacity="0.2"
              />
              {/* Main bubble */}
              <Circle
                cx={bubble.x}
                cy={bubble.y}
                r={bubble.size / 20}
                fill={bubble.color}
                opacity="0.7"
              />
              {/* Label */}
              <SvgText
                x={bubble.x}
                y={bubble.y}
                textAnchor="middle"
                fontSize="3"
                fontWeight="500"
                fill="white"
              >
                {bubble.category}
              </SvgText>
            </React.Fragment>
          ))}
        </Svg>
        <View style={styles.legend}>
          <Text style={styles.legendText}>Size = frequency</Text>
          <Text style={styles.legendText}>Color = sentiment</Text>
        </View>
      </FloatingCard>

      {/* Summary */}
      <FloatingCard style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryIcon}>📈</Text>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryTitle}>What's filling your days</Text>
            <Text style={styles.summaryText}>
              Your days have been mostly filled with positive family and children moments. Work has been present but balanced.
            </Text>
            <Text style={styles.summaryNote}>
              You might want to check in with yourself more often — "Self" moments have been less frequent this week.
            </Text>
          </View>
        </View>
      </FloatingCard>

      {/* AI Suggestions */}
      <FloatingCard style={styles.suggestionsCard}>
        <View style={styles.suggestionsHeader}>
          <Text style={styles.suggestionsIcon}>💡</Text>
          <Text style={styles.suggestionsTitle}>Gentle suggestions</Text>
        </View>
        
        <View style={styles.suggestion}>
          <Text style={styles.suggestionLabel}>Try tomorrow</Text>
          <Text style={styles.suggestionItem}>• Take 10 minutes for yourself in the morning</Text>
          <Text style={styles.suggestionItem}>• Send a quick message to a friend</Text>
        </View>

        <View style={styles.suggestion}>
          <Text style={styles.suggestionLabel}>Reflect on</Text>
          <Text style={styles.suggestionText}>
            "What small thing brought me joy this week?"
          </Text>
        </View>

        <View style={styles.suggestion}>
          <Text style={styles.suggestionLabel}>One conversation to have</Text>
          <Text style={styles.suggestionText}>
            Ask your partner: "How are you feeling about this week?"
          </Text>
        </View>
      </FloatingCard>

      {/* Weekly Breakdown */}
      <FloatingCard>
        <Text style={styles.breakdownTitle}>This Week's Moments</Text>
        <View style={styles.breakdownList}>
          {weeklyData.map((item) => (
            <View key={item.label} style={styles.breakdownItem}>
              <View style={styles.breakdownLeft}>
                <View style={[styles.breakdownDot, { backgroundColor: item.color }]} />
                <Text style={styles.breakdownLabel}>{item.label}</Text>
              </View>
              <Text style={styles.breakdownCount}>{item.count}</Text>
            </View>
          ))}
        </View>
      </FloatingCard>

      <View style={styles.footer}>
        <PiaButton onPress={onBack} variant="secondary">
          Back to Parent Space
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
  chartCard: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 16,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#64748B',
  },
  summaryCard: {
    marginBottom: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryIcon: {
    fontSize: 20,
    marginTop: 4,
  },
  summaryContent: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
    marginBottom: 12,
  },
  summaryNote: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  suggestionsCard: {
    marginBottom: 16,
    backgroundColor: 'rgba(180, 239, 227, 0.1)',
  },
  suggestionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  suggestionsIcon: {
    fontSize: 20,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  suggestion: {
    marginBottom: 12,
  },
  suggestionLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  suggestionItem: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 2,
  },
  suggestionText: {
    fontSize: 14,
    color: '#334155',
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  breakdownList: {
    gap: 8,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  breakdownDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#334155',
  },
  breakdownCount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  footer: {
    marginTop: 32,
  },
});
