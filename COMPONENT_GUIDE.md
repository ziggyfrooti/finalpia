# 🎨 Component Usage Guide

## Quick Reference for Kid-Friendly Components

### 1. Mascot Component 🎭

**When to use:**
- Welcome screens
- Completion screens
- Category hub
- Any screen that needs a friendly character

**Example:**
```tsx
import { Mascot } from '../components/Mascot';

// Happy mascot
<Mascot size="md" type="happy" animate={true} />

// Celebrating mascot for success
<Mascot size="lg" type="celebrating" animate={true} />

// Thinking mascot for questions
<Mascot size="sm" type="thinking" animate={true} />

// Excited mascot for achievements
<Mascot size="md" type="excited" animate={true} />
```

**Props:**
- `size`: 'sm' (60px), 'md' (80px), 'lg' (120px)
- `type`: 'happy', 'excited', 'thinking', 'celebrating'
- `animate`: true/false (default: true)

---

### 2. Floating Sparkles ✨

**When to use:**
- Background decoration
- Success/celebration screens
- To add magic to any screen

**Example:**
```tsx
import { FloatingSparkles } from '../components/FloatingSparkles';

// Light sparkles
<FloatingSparkles count={5} />

// More sparkles for celebration
<FloatingSparkles count={12} />
```

**Props:**
- `count`: Number of sparkles (default: 5)

**Note:** Add near the top of your screen, automatically positions behind content

---

### 3. Floating Shapes 🌟

**When to use:**
- Whimsical background effect
- Welcome screens
- Waiting screens

**Example:**
```tsx
import { FloatingShapes } from '../components/FloatingShapes';

<FloatingShapes count={5} />
```

**Props:**
- `count`: Number of shapes (default: 5)

**Note:** Renders stars, hearts, and clouds randomly

---

### 4. Enhanced PiaButton 🎯

**When to use:**
- Primary actions
- Navigation
- Submission buttons

**Example:**
```tsx
import { PiaButton } from '../components/PiaButton';

// Primary button with animation
<PiaButton onPress={handleSubmit}>
  Submit
</PiaButton>

// Secondary style
<PiaButton 
  variant="secondary" 
  onPress={handleCancel}
>
  Cancel
</PiaButton>

// Without animation
<PiaButton 
  animate={false}
  onPress={handleAction}
>
  Click Me
</PiaButton>
```

**Props:**
- `onPress`: Function to call on press
- `variant`: 'primary' | 'secondary'
- `animate`: true/false (default: true)
- `disabled`: true/false

---

### 5. FloatingCard 📋

**When to use:**
- Content containers
- Card-based layouts
- Information panels

**Example:**
```tsx
import { FloatingCard } from '../components/FloatingCard';

// Static card
<FloatingCard>
  <Text>Content here</Text>
</FloatingCard>

// Animated floating card
<FloatingCard animate={true}>
  <Text>This card floats!</Text>
</FloatingCard>
```

**Props:**
- `animate`: true/false (default: false)
- `style`: Custom ViewStyle

---

### 6. ScreenWrapper 🖼️

**When to use:**
- Wrap every screen for consistent layout
- Provides safe area handling

**Example:**
```tsx
import { ScreenWrapper } from '../components/ScreenWrapper';

// Standard background
<ScreenWrapper>
  {/* Your content */}
</ScreenWrapper>

// With gradient
<ScreenWrapper useGradient={true}>
  {/* Your content */}
</ScreenWrapper>

// Custom background color
<ScreenWrapper backgroundColor="#FFE5E0">
  {/* Your content */}
</ScreenWrapper>
```

**Props:**
- `statusBarStyle`: 'auto' | 'light' | 'dark' | 'inverted'
- `backgroundColor`: Color string
- `useGradient`: true/false (default: false)

---

### 7. CategoryTile 🎨

**When to use:**
- Selection screens
- Category lists
- Checkbox alternatives

**Example:**
```tsx
import { CategoryTile } from '../components/CategoryTile';

<CategoryTile
  label="Daily Reflection"
  icon={<Text style={{ fontSize: 24 }}>📝</Text>}
  selected={isSelected}
  onToggle={() => setIsSelected(!isSelected)}
/>
```

**Props:**
- `label`: Display text
- `icon`: React node (emoji, icon component)
- `selected`: Boolean
- `onClick` or `onToggle`: Handler function

---

## 🎨 Color Reference (from theme.ts)

```tsx
import { Colors } from '../constants/theme';

// Primary
Colors.primary       // Pink: #FF6B9D
Colors.primaryLight  // Light pink: #FFB8D1
Colors.primaryDark   // Dark pink: #E85A8A

// Secondary
Colors.secondary     // Yellow: #FFD93D
Colors.secondaryLight // Light yellow: #FFF4B8
Colors.secondaryDark  // Dark yellow: #FFC107

// Accents
Colors.accent1       // Teal: #7DD3C0
Colors.accent2       // Purple: #A78BFA
Colors.accent3       // Coral: #FF9B8A
Colors.accent4       // Sky blue: #6BDBFF
Colors.accent5       // Mint: #B4EFC4

// Backgrounds
Colors.background    // Soft pink: #FFF5F7
Colors.backgroundAlt // Sky blue: #F0F9FF
Colors.surface       // White: #FFFFFF

// Text
Colors.text          // Dark: #2D3748
Colors.textSecondary // Medium: #718096
Colors.textTertiary  // Light: #A0AEC0
```

---

## 🎭 Complete Screen Example

```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Mascot } from '../components/Mascot';
import { FloatingSparkles } from '../components/FloatingSparkles';
import { FloatingCard } from '../components/FloatingCard';
import { PiaButton } from '../components/PiaButton';
import { Colors } from '../constants/theme';

export default function MyKidFriendlyScreen() {
  return (
    <ScreenWrapper useGradient={true}>
      <FloatingSparkles count={8} />
      
      <View style={styles.container}>
        {/* Friendly mascot */}
        <Mascot size="lg" type="happy" animate={true} />
        
        {/* Title */}
        <Text style={styles.title}>Welcome!</Text>
        
        {/* Content card */}
        <FloatingCard animate={true}>
          <Text style={styles.content}>
            Let's have fun learning today!
          </Text>
        </FloatingCard>
        
        {/* Action button */}
        <PiaButton onPress={() => console.log('Clicked!')}>
          Let's Go! 🚀
        </PiaButton>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  content: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
```

---

## 💡 Best Practices

1. **Don't Overdo It**: Use 5-8 sparkles, not 50
2. **Match Mascot Mood**: Use appropriate mascot type for context
3. **Consistent Colors**: Stick to theme colors
4. **Performance**: Don't stack too many animated components
5. **Accessibility**: Maintain text contrast ratios
6. **Touch Targets**: Keep buttons large (minimum 44x44)

---

## 🎯 Animation Guidelines

### When to Animate:
- ✅ Entry/exit animations
- ✅ Success feedback
- ✅ Button presses
- ✅ Background decorations
- ✅ Progress indicators

### When NOT to Animate:
- ❌ While user is reading
- ❌ During critical tasks
- ❌ If it distracts from content
- ❌ If performance suffers

---

## 🚀 Quick Start Checklist

For any new kid-friendly screen:

- [ ] Wrap in `<ScreenWrapper>`
- [ ] Add `<FloatingSparkles>` for magic
- [ ] Include `<Mascot>` for friendliness
- [ ] Use `<PiaButton>` for actions
- [ ] Use theme `Colors` for consistency
- [ ] Add appropriate emojis
- [ ] Make text large and bold
- [ ] Test on actual device
