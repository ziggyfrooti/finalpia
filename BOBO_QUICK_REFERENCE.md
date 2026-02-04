# Bobo Quick Reference Card

## 🌿 The 8 States of Bobo

```tsx
import { Mascot } from '../components/Mascot';

// 1. IDLE - Default, home, neutral
<Mascot type="idle" size="md" />

// 2. HAPPY - Activity saved, positive
<Mascot type="happy" size="md" />

// 3. CURIOUS - Questions, exploration
<Mascot type="curious" size="md" />

// 4. THINKING - Loading, processing
<Mascot type="thinking" size="md" />

// 5. EXCITED - Achievements, celebrations
<Mascot type="excited" size="lg" />

// 6. SLEEPY - End of day, bedtime
<Mascot type="sleepy" size="md" />

// 7. CALM - Parent space, info screens
<Mascot type="calm" size="sm" animate={false} />

// 8. SHY - First time, onboarding
<Mascot type="shy" size="md" />
```

## 📏 Sizes
- `sm` = 60px
- `md` = 80px (default)
- `lg` = 120px

## 🎯 Quick Decision Guide

**What screen am I on?** → **Use this state:**

- Home/Welcome → `idle`
- Loading → `thinking`
- Asking a question → `curious`
- Saved something → `happy`
- Achievement unlocked → `excited`
- Bedtime/End of day → `sleepy`
- Parent dashboard → `calm`
- First-time user → `shy`

## 🎨 Bobo's Appearance
- Mint green (#B8E6D5)
- Charcoal eyes (#3D3D3D)
- Soft jelly blob
- No nose, no accessories
- Gender-neutral

## 📖 Full Docs
- `BOBO_MASCOT_GUIDE.md` - Usage guide
- `BOBO_IMPLEMENTATION_GUIDE.md` - Screen recommendations
- `BOBO_VISUAL_REFERENCE.md` - Design specs
- `BOBO_UPDATE_SUMMARY.md` - Complete overview

## 🧪 Test Bobo
Navigate to `BoboShowcase` screen to see all states!

---
💚 Bobo says: "I'm here to help make your PIA journey calm and fun!"
