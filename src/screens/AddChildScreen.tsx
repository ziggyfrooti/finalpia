import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal } from 'react-native';
import { PiaButton } from '../components/PiaButton';
import { Mascot } from '../components/Mascot';
import { addKid, getCurrentUser } from '../lib/db';
import { ScreenWrapper } from '../components/ScreenWrapper';

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
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Mascot size="md" />
        <Text style={styles.title}>Add Your Child</Text>
        <Text style={styles.subtitle}>Let's get to know them!</Text>
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
          {loading ? 'Adding...' : addedKids.length > 0 ? 'Add Another Child' : 'Add Child'}
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
              <PiaButton onPress={handleAddAnother} style={styles.modalButton}>
                Add Another
              </PiaButton>
              <PiaButton onPress={handleContinue} style={styles.continueButton}>
                Continue
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
    backgroundColor: '#FBF9F4',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  addedKidsSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: 'rgba(125, 211, 192, 0.1)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#7DD3C0',
  },
  addedKidsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 12,
  },
  addedKidsList: {
    gap: 8,
  },
  addedKidCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  addedKidAvatar: {
    fontSize: 28,
  },
  addedKidInfo: {
    flex: 1,
  },
  addedKidName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  addedKidGrade: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  addedKidCheck: {
    fontSize: 20,
    color: '#7DD3C0',
  },
  section: {
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1E293B',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  avatarOption: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarOptionSelected: {
    borderColor: '#7DD3C0',
    backgroundColor: 'rgba(125, 211, 192, 0.1)',
  },
  avatarEmoji: {
    fontSize: 32,
  },
  gradeScrollContainer: {
    paddingVertical: 4,
    gap: 8,
  },
  gradeOption: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    marginRight: 8,
  },
  gradeOptionSelected: {
    borderColor: '#7DD3C0',
    backgroundColor: 'rgba(125, 211, 192, 0.1)',
  },
  gradeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  gradeTextSelected: {
    color: '#1E293B',
    fontWeight: '600',
  },
  buttonsContainer: {
    gap: 12,
    marginTop: 32,
  },
  addButton: {
    backgroundColor: '#7DD3C0',
  },
  continueButton: {
    backgroundColor: '#FFB4A2',
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
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(125, 211, 192, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successIcon: {
    fontSize: 48,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  modalKidInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(125, 211, 192, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    width: '100%',
  },
  modalKidAvatar: {
    fontSize: 36,
  },
  modalKidTextInfo: {
    flex: 1,
  },
  modalKidName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
  },
  modalKidGrade: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#7DD3C0',
  },
});
