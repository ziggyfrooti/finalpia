import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal } from 'react-native';
import { PiaButton } from '../components/PiaButton';
import { Mascot } from '../components/Mascot';
import { FloatingSparkles } from '../components/FloatingSparkles';
import { addKid, getCurrentUser } from '../lib/db';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Colors } from '../constants/theme';

interface AddChildScreenProps {
  onComplete: (kidId: string) => void;
  onCancel?: () => void;
  hideCancel?: boolean;
}

const avatarOptions = ['😊', '🌟', '🚀', '🦄', '🌈', '⭐', '🎨', '🎮', '📚', '⚽'];

const gradeOptions = [
  'Pre-K',
  'Kindergarten',
  '1st Grade',
  '2nd Grade',
  '3rd Grade',
  '4th Grade',
  '5th Grade',
  '6th Grade',
  '7th Grade',
  '8th Grade',
  '9th Grade',
  '10th Grade',
  '11th Grade',
  '12th Grade',
];

type AddedKid = {
  id: string;
  name: string;
  avatar: string;
  grade?: string;
};

export default function AddChildScreen({ onComplete, onCancel, hideCancel = false }: AddChildScreenProps) {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('😊');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [loading, setLoading] = useState(false);
  const [addedKids, setAddedKids] = useState<AddedKid[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastAddedKid, setLastAddedKid] = useState<AddedKid | null>(null);

  const handleAdd = async () => {
    // Prevent multiple simultaneous submissions
    if (loading) {
      return;
    }

    if (!name.trim()) {
      Alert.alert('Name Required', 'Please enter your child\'s name');
      return;
    }

    if (!selectedGrade) {
      Alert.alert('Grade Required', 'Please select your child\'s grade');
      return;
    }

    const user = getCurrentUser();
    if (!user) {
      Alert.alert('Error', 'You must be logged in to add a child');
      return;
    }

    setLoading(true);
    try {
      const kidId = await addKid(user.uid, {
        name: name.trim(),
        avatar: selectedAvatar,
        grade: selectedGrade,
      });
      
      console.log('Kid added successfully with ID:', kidId);
      
      // Create added kid object
      const newKid: AddedKid = {
        id: kidId,
        name: name.trim(),
        avatar: selectedAvatar,
        grade: selectedGrade,
      };
      
      console.log('Created newKid object:', newKid);
      
      // Update state
      setAddedKids(prev => {
        const updated = [...prev, newKid];
        console.log('Updated addedKids array:', updated);
        return updated;
      });
      setLastAddedKid(newKid);
      setShowSuccessModal(true);
      
      // Clear form
      setName('');
      setSelectedAvatar('😊');
      setSelectedGrade('');
    } catch (error) {
      console.error('Failed to add kid:', error);
      Alert.alert('Error', 'Could not add child. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    console.log('handleContinue called, addedKids:', addedKids.length);
    if (addedKids.length > 0) {
      const firstKidId = addedKids[0].id;
      console.log('Continuing with kid ID:', firstKidId);
      setShowSuccessModal(false);
      // Small delay to ensure modal closes before navigation
      setTimeout(() => {
        console.log('Calling onComplete with kid ID:', firstKidId);
        onComplete(firstKidId);
      }, 100);
    } else {
      console.warn('No kids added yet, cannot continue');
    }
  };

  const handleAddAnother = () => {
    setShowSuccessModal(false);
  };

  return (
    <ScreenWrapper useGradient={true}>
      <FloatingSparkles count={6} />
      <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Mascot size="lg" type="excited" animate={true} />
        <Text style={styles.title}>Add Your Child</Text>
        <Text style={styles.subtitle}>Let's get to know them! 🌟</Text>
      </View>

      {/* Added Kids List */}
      {addedKids.length > 0 && (
        <View style={styles.addedKidsSection}>
          <Text style={styles.addedKidsLabel}>Added Children:</Text>
          <View style={styles.addedKidsList}>
            {addedKids.map((kid) => (
              <View key={kid.id} style={styles.addedKidCard}>
                <Text style={styles.addedKidAvatar}>{kid.avatar}</Text>
                <View style={styles.addedKidInfo}>
                  <Text style={styles.addedKidName}>{kid.name}</Text>
                  {kid.grade && <Text style={styles.addedKidGrade}>{kid.grade}</Text>}
                </View>
                <Text style={styles.addedKidCheck}>✓</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Name Input */}
      <View style={styles.section}>
        <Text style={styles.label}>Child's Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter name..."
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          autoCorrect={false}
          maxLength={50}
        />
      </View>

      {/* Avatar Selection */}
      <View style={styles.section}>
        <Text style={styles.label}>Choose an Avatar</Text>
        <View style={styles.avatarGrid}>
          {avatarOptions.map((avatar) => (
            <TouchableOpacity
              key={avatar}
              onPress={() => setSelectedAvatar(avatar)}
              style={[
                styles.avatarOption,
                selectedAvatar === avatar && styles.avatarOptionSelected,
              ]}
            >
              <Text style={styles.avatarEmoji}>{avatar}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Grade Selection */}
      <View style={styles.section}>
        <Text style={styles.label}>Grade Level</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.gradeScrollContainer}
        >
          {gradeOptions.map((grade) => (
            <TouchableOpacity
              key={grade}
              onPress={() => setSelectedGrade(grade)}
              style={[
                styles.gradeOption,
                selectedGrade === grade && styles.gradeOptionSelected,
              ]}
            >
              <Text
                style={[
                  styles.gradeText,
                  selectedGrade === grade && styles.gradeTextSelected,
                ]}
              >
                {grade}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <PiaButton
          onPress={handleAdd}
          disabled={loading || !name.trim() || !selectedGrade}
          style={styles.addButton}
        >
          {loading ? 'Adding...' : addedKids.length > 0 ? 'Add Child' : 'Add Child'}
        </PiaButton>
        {addedKids.length > 0 && (
          <PiaButton
            onPress={handleContinue}
            disabled={loading}
            style={styles.continueButton}
          >
            Continue to Next Step
          </PiaButton>
        )}
        {!hideCancel && onCancel && addedKids.length === 0 && (
          <PiaButton
            onPress={() => onCancel()}
            variant="secondary"
            disabled={loading}
          >
            Cancel
          </PiaButton>
        )}
      </View>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIconContainer}>
              <Text style={styles.successIcon}>🎉</Text>
            </View>
            <Text style={styles.modalTitle}>Child Added!</Text>
            {lastAddedKid && (
              <View style={styles.modalKidInfo}>
                <Text style={styles.modalKidAvatar}>{lastAddedKid.avatar}</Text>
                <View style={styles.modalKidTextInfo}>
                  <Text style={styles.modalKidName}>{lastAddedKid.name}</Text>
                  {lastAddedKid.grade && <Text style={styles.modalKidGrade}>{lastAddedKid.grade}</Text>}
                </View>
              </View>
            )}
            <Text style={styles.modalSubtitle}>
              Great! Would you like to add another child or continue?
            </Text>
            <View style={styles.modalButtons}>
              <PiaButton onPress={handleContinue} style={styles.modalContinueButton}>
                Continue
              </PiaButton>
              <PiaButton onPress={handleAddAnother} variant="secondary" style={styles.modalAddButton}>
                Add Another Child
              </PiaButton>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  addedKidsSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: Colors.accent5,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.accent1,
  },
  addedKidsLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  addedKidsList: {
    gap: 8,
  },
  addedKidCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    gap: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addedKidAvatar: {
    fontSize: 32,
  },
  addedKidInfo: {
    flex: 1,
  },
  addedKidName: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  addedKidGrade: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  addedKidCheck: {
    fontSize: 24,
    color: Colors.accent1,
  },
  section: {
    marginBottom: 32,
  },
  label: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    fontSize: 17,
    color: Colors.text,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  avatarOption: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
    transform: [{ scale: 1.05 }],
  },
  avatarEmoji: {
    fontSize: 36,
  },
  gradeScrollContainer: {
    paddingVertical: 4,
    gap: 8,
  },
  gradeOption: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: Colors.border,
    marginRight: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  gradeOptionSelected: {
    borderColor: Colors.accent1,
    backgroundColor: Colors.accent5,
    borderWidth: 3,
  },
  gradeText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  gradeTextSelected: {
    color: Colors.text,
    fontWeight: '700',
  },
  buttonsContainer: {
    gap: 12,
    marginTop: 32,
  },
  addButton: {
    backgroundColor: Colors.accent1,
  },
  continueButton: {
    backgroundColor: Colors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  successIconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  successIcon: {
    fontSize: 56,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  modalKidInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.accent5,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    width: '100%',
  },
  modalKidAvatar: {
    fontSize: 40,
  },
  modalKidTextInfo: {
    flex: 1,
  },
  modalKidName: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
  },
  modalKidGrade: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  modalSubtitle: {
    fontSize: 17,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
    fontWeight: '500',
  },
  modalButtons: {
    width: '100%',
    gap: 12,
  },
  modalContinueButton: {
    width: '100%',
    backgroundColor: Colors.primary,
  },
  modalAddButton: {
    width: '100%',
  },
});
