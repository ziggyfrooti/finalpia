# Product Context: PIA - Parent & Kid Connect

## What is PIA?

PIA (Parent-Kid App) is a mobile application designed to strengthen the connection between elementary school children (ages 6-11) and their parents through daily reflections and emotional check-ins. The app provides a structured, age-appropriate way for kids to share their school day experiences with their parents, helping parents stay informed and engaged even when they can't be physically present.

## Target Users

### Primary Users
- **Children (Ages 6-11)**: Elementary school students who want to share their day with parents
- **Parents**: Working parents who want to stay connected with their child's daily experiences

### User Personas
1. **The Busy Parent**: Works full-time, wants to know what happened at school but struggles to get detailed answers from "How was school?" questions
2. **The Elementary Student**: Has stories to share but may forget details by the time parent asks, or feels overwhelmed by open-ended questions

## Core Value Proposition

PIA transforms the classic "How was school?" conversation by:
- **Structuring Reflection**: Breaking the day into specific categories (lunch, recess, classroom, etc.)
- **Making it Visual & Fun**: Using swipeable cards, emojis, and progress tracking
- **Preserving Details**: Capturing reflections before they're forgotten
- **Creating Async Communication**: Parents can review reflections on their schedule

## Core User Flows

### 1. Parent Onboarding Flow
```
Sign Up/Login → Parent Setup (name, role, location, timezone, notifications)
→ Add Child Profile (name, avatar, grade) → Mode Selector
```

**Key Screens**:
- Login / EmailLogin
- ParentSetup
- AddChild
- ModeSelector

**Purpose**: Collect parent information, set up timezone-aware daily resets, create child profiles.

### 2. Kid Check-In Flow (My Day)
```
Mode Selector → My Day Welcome → Parts of My Day (category selection)
→ Category Hub → Moment Cards (swipe for each category)
→ Category Hub (track progress) → Completion Screen → Send to Parent
```

**Key Screens**:
- ModeSelector → MyDayWelcome → PartsOfMyDay → CategoryHub → MomentCards → CompletionScreen

**Purpose**: Guide child through structured reflection on their day using swipeable cards.

**Flow Details**:
- **Step 1 (PartsOfMyDay)**: Child selects which parts of their day to talk about (e.g., lunch, recess, classroom)
  - Weekday: Pre-selects lunch, recess, classroom
  - Weekend: Pre-selects family time, activities, outdoor
- **Step 2 (CategoryHub)**: Shows progress for each selected category with circular progress rings
- **Step 3 (MomentCards)**: For each category, child swipes through 8 random cards
  - Swipe right (👍) = "This happened" or "I felt this"
  - Swipe left (👎) = "This didn't happen" or "I didn't feel this"
  - Cards are statements like "I had fun at recess" or "Someone made me laugh"
- **Step 4 (CompletionScreen)**: Review and send to parent
  - Option to send immediately or "I'll send it later"
  - Once sent, check-in is locked (can't add more that day)

### 3. Parent View Flow (Parent Space)
```
Mode Selector → Parent Space Home → Today's Story (view child's check-in)
                                  → Your Balance (parent self-reflection)
                                  → Your Day (parent check-in cards)
```

**Key Screens**:
- ParentSpaceHome → TodaysStory / YourBalance / YourDay

**Purpose**: Let parents review child's reflections and do their own check-ins.

## Weekend vs. Weekday Logic

PIA adapts its categories based on the day of the week, using the parent's timezone for consistency:

**Weekday Categories** (Monday-Friday):
- 🍽️ Lunch
- 👥 Recess
- 📚 Classroom
- 🎨 Specials (Art, Music, PE)
- 🏠 Going Home

**Weekend Categories** (Saturday-Sunday):
- 👨‍👩‍👧 Family Time
- 🎮 Activities & Hobbies
- 🏃 Outdoor Time
- 👫 Friends & Playdates
- ⚽ Sports & Classes
- 🛏️ Quiet Time

This timezone-aware logic ensures daily resets happen at midnight in the parent's local time, not UTC.

## Key Features

### Phase 1 (Current - COMPLETE)
✅ **Authentication**: Email/password login with Firebase Auth
✅ **Parent Onboarding**: Profile setup with timezone, notifications, location
✅ **Child Profiles**: Add multiple children with names, avatars, grades
✅ **Mode Selector**: Choose between "My Day" (kid mode) or "Parent Space"
✅ **Category Selection**: Weekend vs. weekday categories with smart pre-selection
✅ **Swipeable Cards**: 8 random cards per category with smooth animations
✅ **Progress Tracking**: Visual progress rings showing completion per category
✅ **Firestore Integration**: Real-time saving of check-ins, swipes, progress
✅ **Send to Parent**: Lock check-in after sending with confirmation
✅ **Resume Flow**: Return to in-progress check-ins
✅ **Sound Effects**: Audio feedback for swipes and completion
✅ **Confetti Animations**: Celebration effects on completion

### Phase 2 (Planned)
🔲 **Parent Story View**: Rich visualization of child's check-in with patterns/trends
🔲 **Parent Check-In**: "Your Balance" and "Your Day" parent self-reflection cards
🔲 **Analytics Dashboard**: Track child's emotional patterns over time
🔲 **Notifications**: Remind kids to check in, notify parents when check-in is sent
🔲 **Conversation Starters**: Generate discussion prompts based on check-in data
🔲 **Multi-Child Support**: Enhanced UI for parents with multiple children

## Technical Architecture Overview

**Framework**: React Native 0.81 with Expo SDK 54
**Language**: TypeScript 5.9 (strict mode)
**Navigation**: React Navigation 7 (Stack Navigator)
**Backend**: Firebase Authentication + Firestore Database
**State Management**: React hooks (useState, useEffect) in App.tsx
**Audio**: expo-av for sound effects
**Animations**: react-native-confetti-cannon for celebrations

## Data Model Summary

```
parents/{uid}
  - Profile: name, role, location, timezone, notifications

  /kids/{kidId}
    - Profile: name, avatar, grade

    /checkins/{checkinId}
      - date (YYYY-MM-DD), dayOfWeek, isWeekend
      - selectedCategories: string[]
      - categoryProgress: { [category]: 0-100 }
      - isLocked: boolean (true after "Send to Parent")
      - sentToParentAt, completedAt timestamps

      /swipes/{swipeId}
        - category, cardIndex, cardText
        - choice: 'yes' | 'no'
        - timestamps
```

## Project Status

**Current Phase**: Phase 1 Complete ✅
**Next Milestone**: Phase 2 - Parent Space Features
**Known Issues**: None blocking
**Last Major Update**: Syntax error fix in App.tsx (2026-01-28)

## Success Metrics

1. **Engagement**: % of days with completed check-ins
2. **Completion Rate**: % of check-ins that get sent to parent
3. **Parent Viewing**: % of parents who view check-ins within 24 hours
4. **Conversation Quality**: Qualitative feedback from parent-child conversations

## Design Philosophy

- **Kid-First UX**: Simple, visual, playful interface with emojis and animations
- **Low Friction**: Pre-select common categories, only 8 cards per category
- **Safe & Private**: No social features, only parent-child connection
- **Async by Design**: Kids reflect when convenient, parents view when available
- **Emotionally Intelligent**: Cards designed to capture both positive and challenging moments
