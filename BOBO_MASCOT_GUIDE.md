# Bobo - The PIA Mascot Guide

## Meet Bobo 🌿

Bobo is a friendly, mint green jelly-like blob character designed to provide a calm and comforting presence throughout the PIA app. Bobo is gender-neutral, child-friendly, and responds to different contexts with appropriate emotional expressions.

## Character Design

- **Shape**: Soft, rounded, jelly-like blob with smooth organic edges
- **Color**: Mint green pastel (#B8E6D5) with lighter highlights (#D4F1E8)
- **Eyes**: Big, expressive charcoal eyes (#3D3D3D)
- **Mouth**: Tiny curved smile (varies by emotion)
- **Features**: No nose, no accessories, minimal flat illustration style
- **Shadow**: Soft shadow beneath for depth

## Available Emotional States

### 1. **Idle** (Default/Home Screen)
```tsx
<Mascot type="idle" size="md" />
```
- **When to use**: Home screen, welcome screens, neutral states
- **Expression**: Relaxed posture, gentle floating animation, softly blinking eyes, small warm smile
- **Animation**: Gentle up-down floating

### 2. **Happy** (Activity Saved)
```tsx
<Mascot type="happy" size="md" />
```
- **When to use**: After saving activities, successful actions, positive feedback
- **Expression**: Eyes curved upward (happy eyes), wider smile, slight bounce
- **Animation**: Subtle bouncing motion
- **Decoration**: Tiny sparkles

### 3. **Curious** (Ask About Day)
```tsx
<Mascot type="curious" size="md" />
```
- **When to use**: Asking questions, prompting user input, exploration screens
- **Expression**: Slightly larger eyes looking to the side, small "o" shaped mouth, gentle head tilt
- **Animation**: Gentle floating

### 4. **Thinking** (Loading)
```tsx
<Mascot type="thinking" size="md" />
```
- **When to use**: Loading states, processing, waiting screens
- **Expression**: Eyes looking upward, tiny neutral smile
- **Animation**: Calm pulsing (breathing effect)

### 5. **Excited** (Streak Achievement)
```tsx
<Mascot type="excited" size="md" />
```
- **When to use**: Achievements, milestones, celebrations, streak completions
- **Expression**: Wide sparkling eyes, joyful smile, slight upward stretch
- **Animation**: Energetic bouncing
- **Decoration**: Confetti and sparkles (gold, pink, blue)

### 6. **Sleepy** (End of Day)
```tsx
<Mascot type="sleepy" size="md" />
```
- **When to use**: Bedtime screens, end of day summary, goodnight messages
- **Expression**: Half-closed eyes, gentle smile, slightly drooped shape
- **Animation**: Gentle floating

### 7. **Calm** (Parent Space)
```tsx
<Mascot type="calm" size="md" />
```
- **When to use**: Parent dashboard, settings, informational screens
- **Expression**: Calm neutral eyes, small reassuring smile
- **Animation**: Minimal floating, very calm

### 8. **Shy** (First-Time User)
```tsx
<Mascot type="shy" size="md" />
```
- **When to use**: Onboarding, first-time experiences, introducing new features
- **Expression**: Slightly averted eyes, tilted posture, small hesitant smile
- **Animation**: Gentle floating

## Size Options

```tsx
// Small (60x60)
<Mascot type="idle" size="sm" />

// Medium (80x80) - Default
<Mascot type="idle" size="md" />

// Large (120x120)
<Mascot type="idle" size="lg" />
```

## Animation Control

```tsx
// Animated (default)
<Mascot type="happy" animate={true} />

// Static (no animation)
<Mascot type="happy" animate={false} />
```

## Usage Examples by Screen

### Home/Welcome Screen
```tsx
<Mascot type="idle" size="lg" animate={true} />
```

### After Completing an Activity
```tsx
<Mascot type="happy" size="md" animate={true} />
```

### Loading Screen
```tsx
<Mascot type="thinking" size="md" animate={true} />
```

### Achievement/Completion Screen
```tsx
<Mascot type="excited" size="lg" animate={true} />
```

### Question/Prompt Screen
```tsx
<Mascot type="curious" size="md" animate={true} />
```

### Bedtime/End of Day
```tsx
<Mascot type="sleepy" size="md" animate={true} />
```

### Parent Dashboard
```tsx
<Mascot type="calm" size="sm" animate={false} />
```

### Onboarding/First Launch
```tsx
<Mascot type="shy" size="md" animate={true} />
```

## Implementation Notes

1. **Consistent Character**: All emotional states maintain the same blob shape, mint green color, and charcoal eyes
2. **Minimal Design**: No complex backgrounds, props, or accessories - just pure Bobo
3. **Child-Friendly**: Soft, rounded edges with no sharp features
4. **Gender-Neutral**: No gender-specific traits
5. **Smooth Animations**: All animations are gentle and calming, appropriate for children
6. **Performance**: Uses native driver for smooth 60fps animations

## Design Philosophy

Bobo embodies the PIA app's core values:
- **Calm & Comforting**: Soft colors and gentle animations create a safe space
- **Encouraging**: Happy and excited states celebrate user achievements
- **Curious & Thoughtful**: Prompts reflection without pressure
- **Consistent**: Same friendly face across all interactions builds trust

## Future Enhancements

Consider adding:
- Blink animation for idle state
- Breathing animation for calm state
- Custom sounds for different emotional states (already implemented in SoundManager)
- Seasonal variations (winter hat, summer sunglasses - optional)

---

**Note**: The mascot component uses SVG for crisp rendering at any size and React Native Animated API for smooth, performant animations.
