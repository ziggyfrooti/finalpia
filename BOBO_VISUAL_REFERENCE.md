# Bobo Visual Reference Guide

## Character Overview

**Name**: Bobo  
**Species**: Friendly Jelly Blob  
**Color**: Mint Green Pastel (#B8E6D5)  
**Personality**: Calm, comforting, encouraging, child-friendly

## Emotional State Visual Reference

This guide shows the visual characteristics of each Bobo emotional state.

---

### 1. IDLE (Default/Home Screen)

```
     ∧_∧
    (◕‿◕)
   ╱     ╲
  ╱       ╲
 ╱   🌿   ╲
╲         ╱
 ╲_______╱
    ~~~
```

**Visual Characteristics:**
- Shape: Standard rounded blob
- Eyes: Medium size, relaxed, with small white highlights
- Mouth: Small gentle smile (curved upward)
- Pose: Centered, balanced
- Animation: Gentle floating (up and down, 2 seconds)
- Shadow: Soft ellipse underneath

**When to Use:** Home screen, default state, neutral contexts

---

### 2. HAPPY (Activity Saved)

```
     ∧_∧
    (^‿^)
   ╱  ✨  ╲
  ╱       ╲
 ╱   🌿   ╲
╲         ╱
 ╲_______╱
    ~~~
```

**Visual Characteristics:**
- Shape: Standard rounded blob
- Eyes: Curved upward (happy arcs) 
- Mouth: Wider smile
- Pose: Slight bounce implied
- Animation: Gentle bouncing (600ms cycles)
- Decorations: 2 small sparkles (gold, pink)
- Shadow: Soft ellipse underneath

**When to Use:** After saving activities, positive feedback, encouragement

---

### 3. CURIOUS (Ask About Day)

```
     ∧_∧
    (◉‿o)
   ╱     ╲
  ╱       ╲
 ╱   🌿   ╲
╲         ╱
 ╲_______╱
    ~~~
```

**Visual Characteristics:**
- Shape: Standard rounded blob
- Eyes: Slightly larger, looking to the side
- Mouth: Small "o" shape (circle)
- Pose: Gentle head tilt (implied by eye position)
- Animation: Gentle floating
- Shadow: Soft ellipse underneath

**When to Use:** Asking questions, prompting input, exploration screens

---

### 4. THINKING (Loading)

```
     ∧_∧
    (◕‿◕)↑
   ╱     ╲
  ╱       ╲
 ╱   🌿   ╲
╲         ╱
 ╲_______╱
    ~~~
```

**Visual Characteristics:**
- Shape: Standard rounded blob
- Eyes: Looking upward
- Mouth: Tiny neutral smile
- Pose: Calm, centered
- Animation: Gentle pulsing/breathing (scale 1.0 to 1.02, 1.5s)
- Shadow: Soft ellipse underneath

**When to Use:** Loading states, processing, waiting

---

### 5. EXCITED (Achievement)

```
     ∧_∧✨
    (⊙‿⊙)
   ╱ ✨  ╲✨
  ╱   ⭐  ╲
 ╱   🌿   ╲
╲    ✨   ╱
 ╲___✨__╱
    ~~~
```

**Visual Characteristics:**
- Shape: Slightly stretched upward (celebratory pose)
- Eyes: Wide, sparkling (extra white highlights)
- Mouth: Joyful wide smile
- Pose: Slight upward stretch
- Animation: Energetic bouncing (400ms cycles)
- Decorations: Multiple sparkles and confetti (gold, pink, blue)
- Shadow: Soft ellipse underneath

**When to Use:** Achievements, milestones, streaks, celebrations

---

### 6. SLEEPY (End of Day)

```
     ∧_∧
    (‿‿‿)
   ╱     ╲
  ╱       ╲
 ╱   🌿   ╲
╲         ╱
 ╲_______╱
    ~~~
```

**Visual Characteristics:**
- Shape: Slightly drooped/melted
- Eyes: Half-closed (curved lines)
- Mouth: Gentle calm smile
- Pose: Relaxed, droopy
- Animation: Gentle floating
- Shadow: Soft ellipse underneath

**When to Use:** Bedtime, end of day, goodnight messages

---

### 7. CALM (Parent Space)

```
     ∧_∧
    (◕‿◕)
   ╱     ╲
  ╱       ╲
 ╱   🌿   ╲
╲         ╱
 ╲_______╱
    ~~~
```

**Visual Characteristics:**
- Shape: Standard rounded blob
- Eyes: Relaxed, neutral
- Mouth: Small reassuring smile
- Pose: Minimal movement, stable
- Animation: Gentle floating (can be disabled)
- Shadow: Soft ellipse underneath

**When to Use:** Parent dashboard, settings, informational screens

---

### 8. SHY (First-Time User)

```
    ∧_∧
   (◕‿◕)
  ╱     ╲
 ╱       ╲
╱   🌿    ╲
╲        ╱
 ╲______╱
   ~~~
```

**Visual Characteristics:**
- Shape: Slightly tilted to one side
- Eyes: Slightly averted (looking down-left)
- Mouth: Small hesitant smile
- Pose: Gentle tilt/lean
- Animation: Gentle floating
- Shadow: Soft ellipse underneath

**When to Use:** Onboarding, first launch, introducing new features

---

## Design Specifications

### Color Palette
```
Primary Body:   #B8E6D5 (Mint Green Pastel)
Highlight:      #D4F1E8 (Lighter Mint)
Eyes:           #3D3D3D (Charcoal)
Eye Highlight:  #FFFFFF (White, 70-95% opacity)
Shadow:         rgba(0, 0, 0, 0.08)

Sparkles (Excited/Happy):
- Gold:         #FFD700
- Pink:         #FFB6C1  
- Blue:         #87CEEB
```

### Dimensions
```
Small:   60 x 60 px
Medium:  80 x 80 px (default)
Large:   120 x 120 px

Viewbox: 0 0 100 100 (SVG)
```

### Animation Timings
```
Floating:   2000ms (2s) per cycle
Bouncing:   600ms happy, 400ms excited
Pulsing:    1500ms (1.5s) per cycle
```

### Proportions
```
Body blob:      ~70% of viewbox height
Eyes:           3.5-4.5px radius (depends on emotion)
Eye spacing:    ~26px apart (center to center)
Mouth:          ~20-28px wide
Shadow:         ~28px radius (horizontal), 4px (vertical)
```

## Technical Implementation

### SVG Structure
```xml
<Svg viewBox="0 0 100 100">
  <Defs>
    <RadialGradient id="boboGradient">
      <!-- Gradient for 3D effect -->
    </RadialGradient>
  </Defs>
  
  <G>
    <!-- Shadow -->
    <Ellipse ... />
    
    <!-- Body (Path with custom shape) -->
    <Path d="..." fill="url(#boboGradient)" />
    
    <!-- Eyes (varies by emotion) -->
    <!-- Mouth (varies by emotion) -->
    <!-- Decorations (sparkles, etc.) -->
  </G>
</Svg>
```

### React Native Component
```tsx
<Mascot 
  type="idle"      // Emotional state
  size="md"        // sm, md, lg
  animate={true}   // Animation on/off
/>
```

## Character Consistency Checklist

When creating new emotional states or variations, ensure:

- ✅ Mint green color (#B8E6D5) is maintained
- ✅ Charcoal eyes (#3D3D3D) are consistent
- ✅ Blob shape remains soft and rounded (no sharp edges)
- ✅ No nose, no accessories, no clothing
- ✅ Gender-neutral appearance
- ✅ White highlights in eyes for sparkle
- ✅ Soft shadow underneath
- ✅ Smooth organic edges
- ✅ Child-friendly and non-threatening
- ✅ Minimal flat illustration style
- ✅ Consistent proportions across states

## Accessibility Notes

- High contrast between eyes (charcoal) and body (mint green)
- Simple, clear expressions that children can understand
- Animations can be disabled for users sensitive to motion
- Emotional states are reinforced with both visual and contextual cues

---

**Design Philosophy**: Bobo is designed to be a constant, comforting companion throughout a child's journaling journey. Each emotional state is carefully crafted to be age-appropriate, encouraging, and supportive while maintaining the character's core identity and personality.
