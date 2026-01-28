# Developer Troubleshooting Guide

## Quick Reference: Where to Fix What

This guide tells developers **exactly** which files to modify for specific issues or changes.

---

## Common Issues & Exact Fix Locations

### 🔴 Build Errors

#### "Cannot find module 'firebase'"
**File**: [package.json](../package.json)
**Fix**: Run `npm install firebase`
**Line**: Check dependencies section

#### "Unexpected token in App.tsx"
**File**: [App.tsx](../App.tsx)
**Lines to Check**:
- Lines 521-594: Check for proper async function syntax
- Look for `async function` declarations inside JSX props (use `const fn = async ()` instead)
**Example Fix**: See lines 523-558 for proper pattern

#### TypeScript strict mode errors
**File**: [tsconfig.json](../tsconfig.json)
**Line**: 4 (`"strict": true`)
**Fix**: Either fix type errors or temporarily set to `false` (not recommended)

---

### 🔴 Firebase Connection Issues

#### "Firebase not initialized"
**Files to Check**:
1. [.env](../.env) - Ensure all EXPO_PUBLIC_FIREBASE_* variables are set
2. [src/lib/firebase.ts](../src/lib/firebase.ts) - Lines 1-40, check initialization
3. [App.tsx](../App.tsx) - Line 1, ensure firebase imported

**Exact Steps**:
```bash
# 1. Copy template
cp .env.example .env

# 2. Fill in values from Firebase Console → Project Settings → General

# 3. Restart dev server
npm start -- --clear
```

#### "Permission denied" Firestore errors
**File**: Firebase Console → Firestore → Rules
**Fix**: Deploy these rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /parents/{parentId} {
      allow read, write: if request.auth != null && request.auth.uid == parentId;

      match /kids/{kidId} {
        allow read, write: if request.auth != null && request.auth.uid == parentId;

        match /checkins/{checkinId} {
          allow read, write: if request.auth != null && request.auth.uid == parentId;

          match /swipes/{swipeId} {
            allow read, write: if request.auth != null && request.auth.uid == parentId;
          }
        }
      }

      match /parentSwipes/{swipeId} {
        allow read, write: if request.auth != null && request.auth.uid == parentId;
      }
    }
  }
}
```

---

### 🔴 Check-In Flow Issues

#### User can create multiple check-ins per day
**File**: [src/lib/db.ts](../src/lib/db.ts)
**Function**: `createTodayCheckin` (lines 114-173)
**Issue**: Check logic at lines 127-153 (should detect existing check-in by date)
**Also Check**: [App.tsx](../App.tsx) lines 410-460 (PartsOfMyDay onContinue handler)

#### Progress not saving
**Files**:
1. [App.tsx](../App.tsx) - Lines 153-175 (`saveProgress` useEffect)
2. [src/lib/db.ts](../src/lib/db.ts) - Lines 254-267 (`updateCategoryProgress` function)
3. [src/screens/MomentCards.tsx](../src/screens/MomentCards.tsx) - Lines 82-86 (onProgressUpdate callback)

**Debugging Steps**:
```javascript
// Add console.log in App.tsx line 162:
console.log('💾 Saving progress:', categoryProgress);

// Add console.log in MomentCards.tsx line 96:
console.log('📊 Progress update:', progress, 'for category:', category);
```

#### Swipes not saving to Firestore
**File**: [src/lib/db.ts](../src/lib/db.ts)
**Function**: `saveSwipe` (lines 331-370)
**Common Issue**: Swipe ID generation (line 342) - ensure category and cardIndex are valid
**Also Check**: [src/screens/MomentCards.tsx](../src/screens/MomentCards.tsx) lines 54-84 (handleSwipe function)

**Debug**:
```javascript
// Add to MomentCards.tsx line 59:
console.log('💳 Swiping:', { category, cardIndex, cardText, choice });
```

#### "Send to Parent" button not working
**File**: [App.tsx](../App.tsx)
**Lines**: 521-594 (CompletionScreen onSendToParent handler)
**Key Logic**:
- Line 523-558: `performSendToParent` function definition
- Line 560-567: Check if all categories complete
- Line 570-590: Show confirmation if incomplete

**Common Fixes**:
- Ensure `currentCheckinId` is set (check line 558: `if (user?.uid && selectedKid?.id && currentCheckinId)`)
- Verify `lockCheckin` is being called (line 526)
- Check Alert is showing (line 536)

---

### 🔴 Weekend vs. Weekday Issues

#### Always showing weekday categories (even on Saturday/Sunday)
**File**: [src/lib/dateUtils.ts](../src/lib/dateUtils.ts)
**Lines**: 47-54 (`isWeekend` function)
**CRITICAL**: Lines 48-49 have a temporary override:
```typescript
// TEMPORARY: Force weekend mode for testing weekend cards
return true;
```

**Fix**: Uncomment production code (lines 51-53):
```typescript
const dayOfWeek = getDayOfWeek(timezone);
return dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday';
```

#### Wrong categories for timezone
**File**: [src/lib/dateUtils.ts](../src/lib/dateUtils.ts)
**Function**: `getDayOfWeek` (lines 31-40)
**Check**: Timezone string format (must be IANA format like "America/New_York")
**Also Check**: [App.tsx](../App.tsx) line 95 (loads parent timezone from Firestore)

---

### 🔴 Card Content Issues

#### Want to add new cards to a category
**File**: [src/data/cardPools.ts](../src/data/cardPools.ts)
**Steps**:
1. Find the category constant (e.g., `LUNCH_CARDS` at line 15)
2. Add new card object:
   ```typescript
   { text: 'New card text here', emoji: '😊' }
   ```
3. Ensure apostrophes are escaped: `didn\'t` not `didn't`

**Card Format**:
- `text`: String with child-friendly language (first person: "I...")
- `emoji`: Single emoji relevant to the card

**Example** (line 15-25 for LUNCH_CARDS):
```typescript
export const LUNCH_CARDS: Card[] = [
  { text: 'I sat with my friends at lunch', emoji: '🍽️' },
  { text: 'I tried a new food today', emoji: '🥗' },
  // Add your new card here:
  { text: 'I had my favorite meal', emoji: '😋' },
];
```

#### Want to add a new category
**Files to Modify**:
1. [src/data/categories.ts](../src/data/categories.ts)
   - Add to `WEEKDAY_CATEGORIES` (line 16) or `WEEKEND_CATEGORIES` (line 53)
   ```typescript
   {
     id: 'new-category-id',
     label: 'Category Label',
     emoji: '📚',
     description: 'Description here',
   }
   ```

2. [src/data/cardPools.ts](../src/data/cardPools.ts)
   - Create new card array (e.g., `NEW_CATEGORY_CARDS`)
   - Add to `CARD_POOLS` object at bottom (around line 500):
   ```typescript
   'new-category-id': NEW_CATEGORY_CARDS,
   ```

**No changes needed in screens** - they dynamically load categories!

#### Wrong apostrophe encoding in cards
**File**: [src/data/cardPools.ts](../src/data/cardPools.ts)
**Issue**: TypeScript requires escaped apostrophes in string literals
**Example**:
- ❌ Wrong: `"I didn't like it"`
- ✅ Correct: `"I didn\'t like it"`

**Note**: There was a backup file `cardPools.ts.bak` with unescaped apostrophes - this has been archived.

---

### 🔴 Navigation Issues

#### Screen not showing up
**File**: [App.tsx](../App.tsx)
**Steps**:
1. Add screen to `RootStackParamList` (lines 49-71):
   ```typescript
   NewScreen: { param?: string };
   ```
2. Add `<Stack.Screen>` in navigator (around line 200-700):
   ```typescript
   <Stack.Screen name="NewScreen">
     {({ navigation, route }) => (
       <NewScreen
         onAction={() => navigation.navigate('NextScreen')}
       />
     )}
   </Stack.Screen>
   ```

#### Navigation type errors
**File**: [App.tsx](../App.tsx)
**Line**: 49-71 (RootStackParamList type definition)
**Fix**: Ensure screen name and params match exactly:
```typescript
// Type definition
type RootStackParamList = {
  MomentCards: { category: string };  // params are required
};

// Navigation call
navigation.navigate('MomentCards', { category: 'lunch' });
```

#### Back button not working
**Check**: Does screen have a back button in UI?
- If using React Navigation: Back button automatic on Stack
- If custom back button: Ensure `onBack` prop passed and calls `navigation.goBack()` or `navigation.navigate('PreviousScreen')`

---

### 🔴 State Management Issues

#### State not persisting between screens
**File**: [App.tsx](../App.tsx)
**Issue**: State lives in App.tsx and is passed to screens via props
**State Variables** (lines 58-75):
- `user`, `kids`, `selectedKid`, `currentCheckinId`, `selectedCategories`, `categoryProgress`, `checkInSent`, `parentTimezone`

**Fix**: Ensure callbacks update App.tsx state, not local component state
**Example** (lines 410-460):
```typescript
onContinue={async (categories) => {
  setSelectedCategories(categories);  // Updates App.tsx state
  // ... create check-in
}}
```

#### Progress not updating in UI
**Files to Check**:
1. [App.tsx](../App.tsx) - Lines 153-175 (`saveProgress` useEffect)
2. [src/screens/CategoryHub.tsx](../src/screens/CategoryHub.tsx) - Lines 56-57 (reads progress from props)
3. [src/screens/MomentCards.tsx](../src/screens/MomentCards.tsx) - Lines 82-86 (calls onProgressUpdate)

**Debug Pattern**:
```typescript
// In CategoryHub
console.log('📊 Progress prop:', progress);

// In MomentCards
console.log('📈 Updating progress to:', newProgress);
```

---

### 🔴 Authentication Issues

#### Login fails silently
**File**: [src/lib/auth.ts](../src/lib/auth.ts)
**Function**: `login` (around line 20-40)
**Check**: Error handling - should throw or return error
**Also Check**: [src/screens/EmailLoginScreen.tsx](../src/screens/EmailLoginScreen.tsx) - Displays error Alert

#### User not staying logged in
**File**: [App.tsx](../App.tsx)
**Lines**: 78-112 (first useEffect with auth listener)
**Issue**: Firebase auth persistence should be automatic
**Fix**: Check Firebase configuration in [src/lib/firebase.ts](../src/lib/firebase.ts)

#### Wrong user loaded after login
**File**: [App.tsx](../App.tsx)
**Lines**: 80-111 (loads kids and parent profile)
**Debug**: Add `console.log('User loaded:', user.uid, user.email)` at line 82

---

### 🔴 Timezone Issues

#### Daily reset happening at wrong time
**File**: [src/lib/dateUtils.ts](../src/lib/dateUtils.ts)
**Function**: `getTodayDateString` (lines 11-24)
**Check**: Uses `Intl.DateTimeFormat` with timezone parameter
**Issue**: Parent timezone might not be set correctly
**Fix**: Check [App.tsx](../App.tsx) line 95 (loads parent timezone from Firestore)

#### Check-in date doesn't match user's date
**Issue**: Timezone not passed to `createTodayCheckin`
**File**: [App.tsx](../App.tsx)
**Lines**: 427-446 (createTodayCheckin call)
**Fix**: Ensure `timezone: parentTimezone` is passed (line 430)

---

## Feature Modification Guides

### How to Add a New Screen

**Files to Modify**:
1. Create screen component: `src/screens/NewScreen.tsx`
2. Add to navigation: [App.tsx](../App.tsx)
   - Type definition (lines 49-71)
   - Stack.Screen (lines 200-700)
3. Add navigation calls from other screens

**Template**:
```typescript
// src/screens/NewScreen.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { PiaButton } from '../components/PiaButton';

interface NewScreenProps {
  onContinue: () => void;
  data: string;
}

export default function NewScreen({ onContinue, data }: NewScreenProps) {
  return (
    <ScreenWrapper>
      <View>
        <Text>{data}</Text>
        <PiaButton onPress={onContinue}>Continue</PiaButton>
      </View>
    </ScreenWrapper>
  );
}
```

### How to Modify Database Schema

**Steps**:
1. Update TypeScript types in [src/lib/db.ts](../src/lib/db.ts) (lines 29-62)
   ```typescript
   export type Checkin = {
     // ... existing fields
     newField: string;  // Add new field
   };
   ```

2. Update Firestore operations (same file)
   - Find function (e.g., `createTodayCheckin` at line 114)
   - Add new field to document:
   ```typescript
   await addDoc(checkinsRef, {
     // ... existing fields
     newField: 'default value',
   });
   ```

3. Update screens that read this data
   - Pass new field via props
   - Display in UI

4. **Migration**: Old documents won't have new field
   - Use optional properties: `newField?: string`
   - Provide defaults: `data.newField || 'default'`

### How to Change Sound Effects

**Files**:
1. Add sound file to [assets/sounds/](../assets/sounds/)
2. Update [src/utils/SoundManager.ts](../src/utils/SoundManager.ts)
   - Add to `sounds` object (around line 10)
   ```typescript
   newSound: require('../../assets/sounds/new-sound.mp3'),
   ```
3. Call in screens:
   ```typescript
   SoundManager.play('newSound');
   ```

### How to Update Card Content at Scale

**File**: [src/data/cardPools.ts](../src/data/cardPools.ts)
**Tools**: Use find-and-replace with regex

**Examples**:
- Replace all emojis: Find `emoji: '🍽️'` → Replace `emoji: '🍴'`
- Update phrasing: Find `'I ` → Replace `'Today I '`
- Fix apostrophes: Find `didn't` → Replace `didn\'t`

**Test After Bulk Changes**:
```bash
npm start
# Navigate to MomentCards and verify cards display correctly
```

---

## Quick Debugging Checklist

### App Won't Build
- [ ] Run `npm install`
- [ ] Check for TypeScript errors: `npx tsc --noEmit`
- [ ] Check for syntax errors in [App.tsx](../App.tsx)
- [ ] Clear cache: `npm start -- --clear`

### App Builds But Crashes
- [ ] Check console for error messages
- [ ] Verify Firebase configuration in [.env](../.env)
- [ ] Check Firestore rules are deployed
- [ ] Look for null reference errors (accessing props that don't exist)

### Data Not Saving
- [ ] Check internet connection
- [ ] Verify Firestore rules allow writes
- [ ] Check console for permission denied errors
- [ ] Add `console.log` before Firestore calls to verify function is reached
- [ ] Check if user is authenticated: `console.log('User:', auth.currentUser)`

### Navigation Stuck
- [ ] Check if navigation callback is being called: `console.log('Navigating to X')`
- [ ] Verify screen name matches `RootStackParamList` exactly
- [ ] Check for blocking Alerts or modals
- [ ] Ensure `navigation` prop is available (check component wrapping)

### State Not Updating
- [ ] Check if callback in [App.tsx](../App.tsx) is updating state
- [ ] Verify state variable is passed as prop to component
- [ ] Look for state updates in wrong place (local vs. App.tsx state)
- [ ] Check React DevTools for state values

---

## File Reference Quick Links

### Core Files
- **Main App**: [App.tsx](../App.tsx) - All state and navigation
- **Database**: [src/lib/db.ts](../src/lib/db.ts) - All Firestore operations
- **Date Utils**: [src/lib/dateUtils.ts](../src/lib/dateUtils.ts) - Timezone logic
- **Categories**: [src/data/categories.ts](../src/data/categories.ts) - Category definitions
- **Card Content**: [src/data/cardPools.ts](../src/data/cardPools.ts) - All card text

### Configuration
- **TypeScript**: [tsconfig.json](../tsconfig.json)
- **Expo**: [app.json](../app.json)
- **Dependencies**: [package.json](../package.json)
- **Environment**: [.env](../.env) (use [.env.example](../.env.example) as template)

### Key Screens (src/screens/)
- **Login**: [EmailLoginScreen.tsx](../src/screens/EmailLoginScreen.tsx)
- **Category Selection**: [PartsOfMyDay.tsx](../src/screens/PartsOfMyDay.tsx)
- **Progress Hub**: [CategoryHub.tsx](../src/screens/CategoryHub.tsx)
- **Card Swiping**: [MomentCards.tsx](../src/screens/MomentCards.tsx)
- **Completion**: [CompletionScreen.tsx](../src/screens/CompletionScreen.tsx)

---

## Getting Help

### Documentation Priority
1. **This guide** (06_TROUBLESHOOTING_GUIDE.md) - Exact fix locations
2. [02_CODEMAP.md](02_CODEMAP.md) - File descriptions and purposes
3. [01_ARCHITECTURE_OVERVIEW.md](01_ARCHITECTURE_OVERVIEW.md) - How systems work together
4. [03_TEST_PLAN.md](03_TEST_PLAN.md) - How to verify fixes work

### Still Stuck?
1. Search archived docs in `/archive/2026-01-28/` for historical context
2. Check git history for when code last worked: `git log --oneline src/path/to/file.ts`
3. Ask team member or create GitHub issue

### Adding to This Guide
When you fix a tricky bug:
1. Add a new section to this guide
2. Include exact file paths and line numbers
3. Show before/after code examples
4. Explain why the bug happened

---

## Emergency Rollback

If major issue after changes:
```bash
# See recent commits
git log --oneline -5

# Rollback to previous commit (replace COMMIT_HASH)
git revert COMMIT_HASH

# Or reset entirely (DANGER - loses uncommitted work)
git reset --hard HEAD~1
```

---

**Last Updated**: 2026-01-28
**Maintainer**: Development Team
