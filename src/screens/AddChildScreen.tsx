import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { PiaButton } from '../components/PiaButton';
import { Mascot } from '../components/Mascot';
import { addKid, getCurrentUser } from '../lib/db';

interface AddChildScreenProps {
  onComplete: (kidId: string) => void;
  onCancel: () => void;
}

const avatarOptions = ['😊', '🌟', '🚀', '🦄', '🌈', '⭐', '🎨', '🎮', '📚', '⚽'];

export default function AddChildScreen({ onComplete, onCancel }: AddChildScreenProps) {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('😊');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!name.trim()) {
      Alert.alert('Name Required', 'Please enter your child\'s name');
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
      });
      onComplete(kidId);
    } catch (error) {
      console.error('Failed to add kid:', error);
      Alert.alert('Error', 'Could not add child. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Mascot size="md" />
        <Text style={styles.title}>Add Your Child</Text>
        <Text style={styles.subtitle}>Let's get to know them!</Text>
      </View>

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

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <PiaButton
          onPress={handleAdd}
          disabled={loading || !name.trim()}
          style={styles.addButton}
        >
          {loading ? 'Adding...' : 'Add Child'}
        </PiaButton>
        <PiaButton
          onPress={onCancel}
          variant="secondary"
          disabled={loading}
        >
          Cancel
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
  buttonsContainer: {
    gap: 12,
    marginTop: 32,
  },
  addButton: {
    backgroundColor: '#7DD3C0',
  },
});
