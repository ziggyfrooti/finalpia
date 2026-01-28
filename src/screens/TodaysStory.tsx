import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { FloatingCard } from '../components/FloatingCard';
import LoadingScreen from '../components/LoadingScreen';
import { listSwipes, getCurrentUser, Kid, getTodayOrLatestCheckin, Checkin } from '../lib/db';
import { ScreenWrapper } from '../components/ScreenWrapper';

interface TodaysStoryProps {
  onBack: () => void;
  kids: Kid[];
  selectedKid: Kid | null;
  onSelectKid: (kid: Kid) => void;
  checkinId?: string;
  dateLabel?: string;
}

type Swipe = {
  id: string;
  category: string;
  cardText: string;
  choice: 'yes' | 'no' | 'unsure';
};

const CATEGORY_META: Record<string, { label: string; emoji: string; baseQuestions: string[] }> = {
  lunch: { 
    label: 'Lunch', 
    emoji: '🍽️',
    baseQuestions: [
      'Who did you sit near at lunch today?',
      'What was the best part of lunch?',
      'Was anything annoying or funny at lunch?',
    ],
  },
  recess: { 
    label: 'Recess', 
    emoji: '⚽',
    baseQuestions: [
      'Who did you play with today?',
      'What game did you play?',
      'Was there anything you wish went differently?',
    ],
  },
  classroom: { 
    label: 'Classroom', 
    emoji: '📚',
    baseQuestions: [
      'What was the most interesting thing you learned?',
      'Was anything confusing today?',
      'Did you get to share an idea in class?',
    ],
  },
  specials: { 
    label: 'Specials', 
    emoji: '🎨',
    baseQuestions: [
      'What did you do in specials today?',
      'What was your favorite part?',
      'Did you make something you\'re proud of?',
    ],
  },
  bus: {
    label: 'Bus/After-school',
    emoji: '🚌',
    baseQuestions: [
      'Who did you talk to after school?',
      'Was the ride home calm or loud?',
      'Anything fun happen on the way home?',
    ],
  },
  'going-home': {
    label: 'Going Home',
    emoji: '🏠',
    baseQuestions: [
      'How did you get home today?',
      'Who did you talk to on the way home?',
      'Was the ride or walk home calm or busy?',
      'What were you thinking about on the way?',
    ],
  },
  // Weekend categories
  'family-time': {
    label: 'Family Time',
    emoji: '👨‍👩‍👧',
    baseQuestions: [
      'What did you do with your family today?',
      'Who did you spend the most time with?',
      'What was your favorite part?',
    ],
  },
  activities: {
    label: 'Activities & Hobbies',
    emoji: '🎮',
    baseQuestions: [
      'What activity did you enjoy most?',
      'Did you learn or discover something new?',
      'What would you like to do more of?',
    ],
  },
  outdoor: {
    label: 'Outdoor Time',
    emoji: '🏃',
    baseQuestions: [
      'What did you do outside today?',
      'Did you notice anything interesting in nature?',
      'How did being outside make you feel?',
    ],
  },
  friends: {
    label: 'Friends & Playdates',
    emoji: '👫',
    baseQuestions: [
      'Who did you play with today?',
      'What games or activities did you do together?',
      'What made you laugh the most?',
    ],
  },
  'sports-classes': {
    label: 'Sports & Classes',
    emoji: '⚽',
    baseQuestions: [
      'What class or sport did you go to?',
      'What did you practice or learn?',
      'How did you feel about your performance?',
    ],
  },
  'quiet-time': {
    label: 'Quiet Time',
    emoji: '🛏️',
    baseQuestions: [
      'What did you do during your quiet time?',
      'Did you feel relaxed or restless?',
      'What were you thinking about?',
    ],
  },
};

// Generate conversation starters based on actual swipe choices
function generateQuestions(category: string, yes: string[], no: string[], unsure: string[]): string[] {
  const meta = CATEGORY_META[category];
  const questions: string[] = [];

  // Start with baseQuestions
  if (meta?.baseQuestions) {
    questions.push(...meta.baseQuestions);
  }

  // Add dynamic questions based on YES responses
  if (yes.length > 0) {
    const yesText = yes[0].toLowerCase();
    if (category === 'lunch') {
      if (yesText.includes('friend')) questions.push('Who did you sit with at lunch?');
      if (yesText.includes('food') || yesText.includes('ate')) questions.push('What was your favorite thing you ate?');
      if (yesText.includes('new')) questions.push('Tell me about trying something new!');
    } else if (category === 'recess') {
      if (yesText.includes('play') || yesText.includes('game')) questions.push('What game did you play?');
      if (yesText.includes('friend')) questions.push('Who did you play with?');
      if (yesText.includes('fun')) questions.push('What made it so fun?');
    } else if (category === 'classroom') {
      if (yesText.includes('learn')) questions.push('What was the most interesting thing you learned?');
      if (yesText.includes('help')) questions.push('How did you help someone today?');
      if (yesText.includes('proud') || yesText.includes('answer')) questions.push('Tell me more about that moment!');
    } else if (category === 'specials') {
      if (yesText.includes('create') || yesText.includes('made')) questions.push('What did you create?');
      if (yesText.includes('art') || yesText.includes('music')) questions.push('What was your favorite part?');
    } else if (category === 'bus') {
      if (yesText.includes('talk') || yesText.includes('friend')) questions.push('Who did you talk to?');
      if (yesText.includes('fun')) questions.push('What made it fun?');
    }
  }

  // Add questions based on NO responses
  if (no.length > 0) {
    const noText = no[0].toLowerCase();
    if (category === 'lunch') {
      if (noText.includes('friend') || noText.includes('alone')) questions.push('Would you like to sit with different friends tomorrow?');
      if (noText.includes('food') || noText.includes('hungry')) questions.push('What would you like for lunch next time?');
    } else if (category === 'recess') {
      if (noText.includes('play') || noText.includes('alone')) questions.push('What would have made recess better?');
      if (noText.includes('argument') || noText.includes('disagree')) questions.push('How did that make you feel?');
    } else if (category === 'classroom') {
      if (noText.includes('confus') || noText.includes('understand')) questions.push('What part was tricky?');
      if (noText.includes('boring')) questions.push('What would make it more interesting?');
    }
  }

  // Questions based on UNSURE responses  
  if (unsure.length > 0) {
    questions.push('Tell me more about what you\'re feeling about that.');
  }

  // Return unique questions, limit to 5 max
  return [...new Set(questions)].slice(0, 5);
}

function makeNote(yes: string[], no: string[], unsure: string[]) {
  const total = yes.length + no.length + unsure.length;
  if (total === 0) return 'No moments captured yet';
  if (yes.length >= 4) return 'Lots of good moments today';
  if (yes.length >= 2) return 'A mix of moments today';
  if (no.length >= 3) return 'A few things didn\'t click today';
  return 'A quieter day';
}

export default function TodaysStory({
  onBack,
  kids,
  selectedKid,
  onSelectKid,
  checkinId,
  dateLabel,
}: TodaysStoryProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [swipes, setSwipes] = useState<Swipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showKidSelector, setShowKidSelector] = useState(false);
  const [activeCheckin, setActiveCheckin] = useState<Checkin | null>(null);

  // Fetch checkin for selected kid
  useEffect(() => {
    let cancelled = false;

    async function fetchCheckin() {
      if (!selectedKid) {
        setActiveCheckin(null);
        return;
      }

      try {
        const user = getCurrentUser();
        if (!user) return;

        // Use provided checkinId or fetch the latest
        if (checkinId) {
          setActiveCheckin({ id: checkinId } as Checkin);
        } else {
          const checkin = await getTodayOrLatestCheckin({ 
            uid: user.uid, 
            kidId: selectedKid.id 
          });
          if (!cancelled) {
            setActiveCheckin(checkin);
          }
        }
      } catch (error) {
        console.error('Failed to fetch checkin:', error);
        if (!cancelled) setActiveCheckin(null);
      }
    }

    fetchCheckin();
    return () => {
      cancelled = true;
    };
  }, [selectedKid, checkinId]);

  // Load swipes for active checkin
  useEffect(() => {
    let cancelled = false;

    async function loadSwipes() {
      if (!selectedKid || !activeCheckin) {
        setSwipes([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const user = getCurrentUser();
        if (!user) {
          console.warn('No authenticated user');
          if (!cancelled) setSwipes([]);
          return;
        }

        const rows = await listSwipes({ 
          uid: user.uid, 
          kidId: selectedKid.id, 
          checkinId: activeCheckin.id
        });
        
        if (!cancelled) {
          setSwipes(rows);
        }
      } catch (error) {
        console.error('Failed to load swipes:', error);
        if (!cancelled) setSwipes([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadSwipes();
    return () => {
      cancelled = true;
    };
  }, [selectedKid, activeCheckin]);

  if (loading) {
    return <LoadingScreen label="Loading story..." />;
  }

  const grouped = Object.entries(
    swipes.reduce((acc, s) => {
      const cat = s.category || 'other';
      if (!acc[cat]) acc[cat] = { yes: [], no: [], unsure: [] };
      if (s.choice === 'yes') acc[cat].yes.push(s.cardText);
      else if (s.choice === 'no') acc[cat].no.push(s.cardText);
      else acc[cat].unsure.push(s.cardText);
      return acc;
    }, {} as Record<string, { yes: string[]; no: string[]; unsure: string[] }>)
  ).filter(([, v]) => v.yes.length + v.no.length + v.unsure.length > 0)
   .sort((a, b) => b[1].yes.length - a[1].yes.length);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Today's Story</Text>
        
        {/* Kid Selector */}
        {kids.length > 0 && (
          <View style={styles.kidSelectorContainer}>
            <TouchableOpacity
              onPress={() => setShowKidSelector(!showKidSelector)}
              style={styles.kidSelectorButton}
            >
              <Text style={styles.kidAvatar}>{selectedKid?.avatar ?? '😊'}</Text>
              <View style={styles.kidInfo}>
                <Text style={styles.kidName}>{selectedKid?.name ?? 'Select a child'}</Text>
                <Text style={styles.kidDate}>{dateLabel || 'Today'}</Text>
              </View>
              <Text style={styles.chevron}>▼</Text>
            </TouchableOpacity>

            {showKidSelector && (
              <View style={styles.kidDropdown}>
                {kids.map((kid) => (
                  <TouchableOpacity
                    key={kid.id}
                    onPress={() => {
                      onSelectKid(kid);
                      setShowKidSelector(false);
                    }}
                    style={[
                      styles.kidDropdownItem,
                      selectedKid?.id === kid.id && styles.kidDropdownItemSelected,
                    ]}
                  >
                    <Text style={styles.kidDropdownAvatar}>{kid.avatar ?? '😊'}</Text>
                    <Text style={styles.kidDropdownName}>{kid.name ?? 'Child'}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
      </View>

      {/* Sections */}
      {grouped.length === 0 ? (
        <FloatingCard>
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              {!selectedKid ? 'No child selected' : !activeCheckin ? 'No check-ins yet' : 'No moments yet'}
            </Text>
            <Text style={styles.emptyText}>
              {!selectedKid 
                ? 'Select a child to see their story.'
                : !activeCheckin
                ? `${selectedKid.name} hasn't completed a check-in yet. Start one from the Kid Space!`
                : `Once ${selectedKid.name} swipes a few cards, you'll see highlights and conversation starters here.`}
            </Text>
          </View>
        </FloatingCard>
      ) : (
        grouped.map(([category, data]) => {
          const meta = CATEGORY_META[category] ?? {
            label: category,
            emoji: '✨',
          };
          const note = makeNote(data.yes, data.no, data.unsure);
          const isExpanded = expandedSection === category;
          const questions = generateQuestions(category, data.yes, data.no, data.unsure);

          return (
            <FloatingCard key={category} style={styles.categoryCard}>
              <TouchableOpacity
                onPress={() => setExpandedSection(isExpanded ? null : category)}
                style={styles.categoryHeader}
              >
                <View style={styles.categoryHeaderLeft}>
                  <Text style={styles.categoryEmoji}>{meta.emoji}</Text>
                  <View>
                    <Text style={styles.categoryLabel}>{meta.label}</Text>
                    <Text style={styles.categoryNote}>{note}</Text>
                  </View>
                </View>
                <Text style={styles.expandIcon}>{isExpanded ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.expandedContent}>
                  {data.yes.length > 0 && (
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>✓ What went well</Text>
                      {data.yes.map((text, i) => (
                        <Text key={i} style={styles.sectionItem}>• {text}</Text>
                      ))}
                    </View>
                  )}

                  {data.no.length > 0 && (
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>✗ What didn't go well</Text>
                      {data.no.map((text, i) => (
                        <Text key={i} style={styles.sectionItem}>• {text}</Text>
                      ))}
                    </View>
                  )}

                  {data.unsure.length > 0 && (
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>? Not sure about</Text>
                      {data.unsure.map((text, i) => (
                        <Text key={i} style={styles.sectionItem}>• {text}</Text>
                      ))}
                    </View>
                  )}

                  <View style={styles.questionsSection}>
                    <Text style={styles.questionsTitle}>💬 Conversation starters</Text>
                    {questions.map((q, i) => (
                      <Text key={i} style={styles.questionItem}>"{q}"</Text>
                    ))}
                  </View>
                </View>
              )}
            </FloatingCard>
          );
        })
      )}
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
    marginBottom: 24,
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
  kidSelectorContainer: {
    position: 'relative',
    width: '100%',
    marginTop: 16,
  },
  kidSelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  kidAvatar: {
    fontSize: 24,
  },
  kidInfo: {
    flex: 1,
  },
  kidName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  kidDate: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  chevron: {
    fontSize: 10,
    color: '#64748B',
  },
  kidDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 8,
    overflow: 'hidden',
    zIndex: 10,
  },
  kidDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  kidDropdownItemSelected: {
    backgroundColor: 'rgba(255, 184, 209, 0.15)',
  },
  kidDropdownAvatar: {
    fontSize: 24,
  },
  kidDropdownName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#334155',
  },
  emptyState: {
    paddingVertical: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  categoryCard: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  categoryEmoji: {
    fontSize: 32,
  },
  categoryLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  categoryNote: {
    fontSize: 13,
    color: '#64748B',
  },
  expandIcon: {
    fontSize: 16,
    color: '#94A3B8',
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  sectionItem: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
    lineHeight: 20,
  },
  questionsSection: {
    backgroundColor: 'rgba(125, 211, 192, 0.1)',
    borderRadius: 12,
    padding: 12,
  },
  questionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  questionItem: {
    fontSize: 13,
    color: '#334155',
    marginBottom: 6,
    fontStyle: 'italic',
  },
});
