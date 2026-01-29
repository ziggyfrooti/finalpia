import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { FloatingCard } from './FloatingCard';
import { PiaButton } from './PiaButton';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../constants/theme';

interface ComingSoonModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
}

const { width } = Dimensions.get('window');

export const ComingSoonModal: React.FC<ComingSoonModalProps> = ({ 
  visible, 
  onClose,
  title = 'Coming Soon'
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.overlayTouchable} 
          activeOpacity={1} 
          onPress={onClose}
        />
        
        <FloatingCard style={styles.modalCard}>
          <View style={styles.content}>
            {/* Under Construction Icon */}
            <View style={styles.iconContainer}>
              <Text style={styles.constructionIcon}>🚧</Text>
            </View>

            {/* Title */}
            <Text style={styles.title}>{title}</Text>

            {/* Message */}
            <Text style={styles.message}>
              We're working on something special for you! This feature is currently under construction and will be available soon.
            </Text>

            {/* Decorative elements */}
            <View style={styles.decorativeContainer}>
              <Text style={styles.decorativeEmoji}>✨</Text>
              <Text style={styles.decorativeEmoji}>🎨</Text>
              <Text style={styles.decorativeEmoji}>💫</Text>
            </View>

            {/* Close Button */}
            <PiaButton onPress={onClose}>
              Got it!
            </PiaButton>
          </View>
        </FloatingCard>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  overlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalCard: {
    width: Math.min(width - 48, 400),
    maxWidth: '100%',
    ...Shadow.lg,
  },
  content: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.secondaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  constructionIcon: {
    fontSize: 56,
  },
  title: {
    ...Typography.h2,
    color: Colors.text,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  message: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 24,
  },
  decorativeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  decorativeEmoji: {
    fontSize: 24,
    opacity: 0.6,
  },
});
