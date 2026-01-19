import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { FloatingCard } from '../components/FloatingCard';
import { Mascot } from '../components/Mascot';

type Child = {
  id: string;
  name?: string;
  avatar?: string;
  [key: string]: any;
};

interface ModeSelectorProps {
  onSelectKidSpace: () => void;
  onSelectParentSpace: () => void;
  selectedChild: Child | null;
  childrenList: Child[];
  onSelectChild: (child: Child) => void;
}

export default function ModeSelector({
  onSelectKidSpace,
  onSelectParentSpace,
  selectedChild,
  childrenList,
  onSelectChild,
}: ModeSelectorProps) {
  const [showChildSelector, setShowChildSelector] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Mascot size="md" />
        <Text style={styles.title}>Choose Your Space</Text>

        {/* Child Selector */}
        {childrenList.length > 1 && (
          <View style={styles.childSelectorContainer}>
            <TouchableOpacity
              onPress={() => setShowChildSelector(!showChildSelector)}
              style={styles.childSelectorButton}
            >
              <Text style={styles.childAvatar}>{selectedChild?.avatar ?? '🙂'}</Text>
              <Text style={styles.childName}>{selectedChild?.name ?? 'Choose child'}</Text>
              <Text style={styles.chevron}>▼</Text>
            </TouchableOpacity>

            {showChildSelector && (
              <View style={styles.dropdown}>
                {childrenList.map((child) => (
                  <TouchableOpacity
                    key={child.id}
                    onPress={() => {
                      onSelectChild(child);
                      setShowChildSelector(false);
                    }}
                    style={[
                      styles.dropdownItem,
                      selectedChild?.id === child.id && styles.dropdownItemSelected,
                    ]}
                  >
                    <Text style={styles.dropdownAvatar}>{child.avatar ?? '🙂'}</Text>
                    <Text style={styles.dropdownName}>{child.name ?? 'Child'}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
      </View>

      {/* Mode Cards */}
      <View style={styles.modesContainer}>
        {/* Kid Space */}
        <FloatingCard>
          <TouchableOpacity onPress={onSelectKidSpace} style={styles.modeCard}>
            <View style={styles.modeIconContainer}>
              <Text style={styles.modeIcon}>✨</Text>
            </View>
            <View style={styles.modeContent}>
              <Text style={styles.modeTitle}>My Day</Text>
              <Text style={styles.modeSubtitle}>For kids to share moments from school</Text>
              <Text style={styles.modeActivity}>Last activity: Today</Text>
            </View>
          </TouchableOpacity>
        </FloatingCard>

        {/* Parent Space */}
        <FloatingCard>
          <TouchableOpacity onPress={onSelectParentSpace} style={styles.modeCard}>
            <View style={[styles.modeIconContainer, styles.parentIconContainer]}>
              <Text style={styles.modeIcon}>🧭</Text>
            </View>
            <View style={styles.modeContent}>
              <Text style={styles.modeTitle}>Parent Space</Text>
              <Text style={styles.modeSubtitle}>Connect with your child's day</Text>
              <Text style={styles.modeActivity}>New updates available</Text>
            </View>
          </TouchableOpacity>
        </FloatingCard>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FBF9F4',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  header: {
    alignItems: 'center',
    gap: 16,
    marginBottom: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1E293B',
  },
  childSelectorContainer: {
    position: 'relative',
    width: '100%',
    maxWidth: 280,
  },
  childSelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  childAvatar: {
    fontSize: 20,
  },
  childName: {
    flex: 1,
    fontSize: 14,
    color: '#334155',
  },
  chevron: {
    fontSize: 10,
    color: '#64748B',
  },
  dropdown: {
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
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownItemSelected: {
    backgroundColor: 'rgba(180, 239, 227, 0.2)',
  },
  dropdownAvatar: {
    fontSize: 20,
  },
  dropdownName: {
    fontSize: 14,
    color: '#334155',
  },
  modesContainer: {
    flex: 1,
    gap: 24,
  },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
  },
  modeIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#7DD3C0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7DD3C0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 4,
  },
  parentIconContainer: {
    backgroundColor: '#FFB8D1',
    shadowColor: '#FFB8D1',
  },
  modeIcon: {
    fontSize: 32,
  },
  modeContent: {
    flex: 1,
  },
  modeTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  modeSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  modeActivity: {
    fontSize: 12,
    color: '#94A3B8',
  },
});
