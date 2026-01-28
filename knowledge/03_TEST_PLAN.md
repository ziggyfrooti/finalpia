# End-to-End Test Plan

## Test Plan Overview

This document defines all critical user journeys and edge cases for the PIA mobile application. Each test case includes preconditions, steps, expected results, and verification criteria.

**Test Coverage**:
- ✅ Authentication flows
- ✅ Parent onboarding
- ✅ Kid check-in flows
- ✅ Progress tracking
- ✅ Send to parent
- ✅ Resume flows
- ✅ Edge cases and error handling
- ⏳ Parent space features (Phase 2)

**Test Environment**:
- iOS Simulator (iPhone 14 Pro, iOS 17+)
- Android Emulator (Pixel 5, Android 13+)
- Web Browser (Chrome, Safari)

---

## Test Suite 1: Authentication & Onboarding

### TC-001: New User Sign Up
**Priority**: Critical
**Preconditions**: App installed, no existing account

**Steps**:
1. Launch app
2. Tap "Create Account"
3. Enter email: `newuser@example.com`
4. Enter password: `password123`
5. Tap "Sign Up"

**Expected Results**:
- Account created in Firebase Auth
- User redirected to Splash screen
- Splash screen shows for 1-2 seconds
- User redirected to ParentSetup screen (needsParentSetup = true)

**Verification**:
- Firebase Console → Authentication → User exists
- Firestore → `parents/{uid}` document does NOT exist yet (created after ParentSetup)

---

### TC-002: Existing User Login
**Priority**: Critical
**Preconditions**: Existing account with email `testuser@example.com`

**Steps**:
1. Launch app
2. Enter email: `testuser@example.com`
3. Enter password: `correctpassword`
4. Tap "Sign In"

**Expected Results**:
- User authenticated
- Redirected to Splash screen
- If parent profile exists → redirect to ModeSelector
- If no parent profile → redirect to ParentSetup

**Verification**:
- Firebase Auth: User signed in
- App state: `user` object populated
- Navigation: Correct screen shown based on profile existence

---

### TC-003: Login with Incorrect Password
**Priority**: High
**Preconditions**: Existing account

**Steps**:
1. Launch app
2. Enter email: `testuser@example.com`
3. Enter password: `wrongpassword`
4. Tap "Sign In"

**Expected Results**:
- Error message displayed: "Invalid email or password"
- User remains on login screen
- No navigation occurs

**Verification**:
- Firebase Auth: No user signed in
- Error Alert shown

---

### TC-004: Parent Profile Setup (First Time)
**Priority**: Critical
**Preconditions**: New user signed in, no parent profile

**Steps**:
1. On ParentSetup screen
2. Enter name: "Sarah Johnson"
3. Select role: "Mom"
4. Enter location: "Seattle, WA"
5. Select timezone: "America/Los_Angeles"
6. Toggle notifications: ON
7. Tap "Continue"

**Expected Results**:
- Parent profile saved to Firestore
- User navigated to AddChild screen
- App state: `needsParentSetup = false`

**Verification**:
```javascript
// Firestore: parents/{uid}
{
  name: "Sarah Johnson",
  role: "Mom",
  location: "Seattle, WA",
  timezone: "America/Los_Angeles",
  notifications: true,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

### TC-005: Add First Child
**Priority**: Critical
**Preconditions**: Parent profile complete, on AddChild screen

**Steps**:
1. Enter child name: "Emma"
2. Select avatar: "😊"
3. Select grade: "2nd Grade"
4. Tap "Add Child"

**Expected Results**:
- Child profile created in Firestore
- App state: `kids` array updated, `selectedKid` set to Emma
- Navigate to ModeSelector

**Verification**:
```javascript
// Firestore: parents/{uid}/kids/{kidId}
{
  name: "Emma",
  avatar: "😊",
  grade: "2nd Grade",
  createdAt: Timestamp
}
```

---

### TC-006: Add Multiple Children
**Priority**: Medium
**Preconditions**: One child already exists

**Steps**:
1. On ModeSelector, tap "Add Child" button
2. Enter name: "Liam"
3. Select avatar: "🦖"
4. Select grade: "Kindergarten"
5. Tap "Add Child"

**Expected Results**:
- Second child added to Firestore
- Both kids visible in ModeSelector
- Can toggle between kids using child selector

**Verification**:
- Firestore: Two kid documents under `parents/{uid}/kids/`
- Child selector shows both Emma and Liam

---

## Test Suite 2: Kid Check-In Flow (Weekday)

### TC-007: Start New Check-In (Weekday)
**Priority**: Critical
**Preconditions**:
- Logged in with child selected
- Current day is Monday-Friday
- No check-in exists for today

**Steps**:
1. On ModeSelector, tap "My Day" card
2. On MyDayWelcome, tap "Let's Talk About My Day"
3. On PartsOfMyDay, observe pre-selected categories: Lunch, Recess, Classroom
4. Tap "Continue"

**Expected Results**:
- Check-in created in Firestore with today's date
- `selectedCategories: ["lunch", "recess", "classroom"]`
- `categoryProgress: { lunch: 0, recess: 0, classroom: 0 }`
- Navigate to CategoryHub
- App state: `currentCheckinId` populated

**Verification**:
```javascript
// Firestore: parents/{uid}/kids/{kidId}/checkins/{checkinId}
{
  date: "2026-01-28",
  dayOfWeek: "Tuesday",
  isWeekend: false,
  selectedCategories: ["lunch", "recess", "classroom"],
  categoryProgress: { lunch: 0, recess: 0, classroom: 0 },
  isLocked: false,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

### TC-008: Select Custom Categories
**Priority**: High
**Preconditions**: On PartsOfMyDay screen

**Steps**:
1. Tap "Lunch" to deselect (pre-selected)
2. Tap "Specials" to select
3. Tap "Going Home" to select
4. Observe counter: "4 parts selected"
5. Tap "Continue"

**Expected Results**:
- Check-in created with custom categories: ["recess", "classroom", "specials", "going-home"]
- CategoryHub shows 4 categories
- Progress rings all at 0%

---

### TC-009: Complete Full Category (8 Cards)
**Priority**: Critical
**Preconditions**:
- Check-in started
- On CategoryHub
- "Lunch" category at 0%

**Steps**:
1. Tap "Lunch" category card
2. On MomentCards, observe 8 cards for Lunch
3. Swipe right on card 1 → Save "yes" to Firestore
4. Swipe left on card 2 → Save "no" to Firestore
5. Continue swiping through all 8 cards (mix of yes/no)
6. After card 8, hear "category complete" sound

**Expected Results**:
- Navigate back to CategoryHub
- Lunch progress ring shows 100%
- Lunch card shows "Complete!" badge
- Lunch card becomes unclickable
- 8 swipes saved to Firestore (swipes subcollection)

**Verification**:
```javascript
// Firestore: parents/{uid}/kids/{kidId}/checkins/{checkinId}
{
  categoryProgress: { lunch: 100, recess: 0, classroom: 0 }
}

// Firestore: parents/{uid}/kids/{kidId}/checkins/{checkinId}/swipes/lunch_0
{
  category: "lunch",
  cardIndex: 0,
  cardText: "I sat with my friends at lunch",
  choice: "yes",
  createdAt: Timestamp
}
// ... 7 more swipe documents
```

---

### TC-010: Pause Mid-Category
**Priority**: Medium
**Preconditions**: On MomentCards screen, completed 3/8 cards

**Steps**:
1. Tap "Pause" button (top right)
2. In modal, tap "Change Category"

**Expected Results**:
- Navigate to PartsOfMyDay
- Progress saved: category shows 37% complete (3/8)
- Can select different category or modify selections

**Verification**:
- Firestore: `categoryProgress: { lunch: 37, ... }`
- Can resume lunch later from 37%

---

### TC-011: Resume Incomplete Check-In
**Priority**: High
**Preconditions**:
- Check-in started yesterday
- Lunch 100%, Recess 37%, Classroom 0%
- App closed and reopened

**Steps**:
1. Launch app
2. Sign in
3. On ModeSelector, tap "My Day"

**Expected Results**:
- **If same day**: Resume flow
  - Navigate directly to CategoryHub
  - Show existing progress (Lunch 100%, Recess 37%, Classroom 0%)
  - Can continue from Recess at card 4
- **If new day**: Fresh start
  - Navigate to MyDayWelcome
  - No existing progress

**Verification**:
- App.tsx useEffect loads existing check-in if same date
- `currentCheckinId` matches yesterday's check-in (if same day)

---

### TC-012: Complete All Categories
**Priority**: Critical
**Preconditions**: All categories at 100%

**Steps**:
1. On CategoryHub, observe "Ready to send to parent!" banner
2. Tap "Done for Today"

**Expected Results**:
- Navigate to CompletionScreen
- Show: "Great job! Your reflections have been saved"
- Display "Send to Parent ✉️" button
- Display "I'll send it later" button
- Play completion sound
- Show confetti animation

---

### TC-013: Send to Parent (All Complete)
**Priority**: Critical
**Preconditions**: CompletionScreen shown, all categories 100%

**Steps**:
1. Tap "Send to Parent ✉️"

**Expected Results**:
- No confirmation dialog (all categories complete)
- Firestore: `lockCheckin()` called
- Alert shown: "Sent to Parent! 🎉"
- On Alert dismiss:
  - State cleared: `currentCheckinId = null`, `selectedCategories = []`, `categoryProgress = {}`
  - Navigate to ModeSelector

**Verification**:
```javascript
// Firestore: parents/{uid}/kids/{kidId}/checkins/{checkinId}
{
  isLocked: true,
  sentToParentAt: Timestamp,
  completedAt: Timestamp,
  updatedAt: Timestamp
}
```

---

### TC-014: Send to Parent (Incomplete)
**Priority**: High
**Preconditions**: CompletionScreen shown, only 2/3 categories complete

**Steps**:
1. Tap "Send to Parent ✉️"
2. Observe Alert: "Send Incomplete Reflection?"
3. Read message: "You've only completed 2 out of 3 categories..."
4. Tap "Send Anyway"

**Expected Results**:
- Check-in locked with partial progress
- Sent to parent successfully
- Same clearing/navigation as TC-013

**Verification**:
- Firestore: `isLocked: true` despite incomplete progress

---

### TC-015: Send Later, Then Send Next Day
**Priority**: Medium
**Preconditions**: CompletionScreen shown

**Steps**:
1. Tap "I'll send it later"
2. Navigate to ModeSelector
3. Close app
4. **Next day**: Open app, tap "My Day"

**Expected Results**:
- **Day 1**: Check-in remains unlocked, can resume
- **Day 2**: New check-in starts (old one still accessible but not editable)

---

### TC-016: Attempt Second Check-In Same Day
**Priority**: High
**Preconditions**: Check-in already sent today (isLocked: true)

**Steps**:
1. On ModeSelector, tap "My Day"
2. On MyDayWelcome, tap "Let's Talk About My Day"
3. On PartsOfMyDay, tap "Continue"

**Expected Results**:
- App detects existing locked check-in for today
- Show Alert: "You already completed your check-in today! Come back tomorrow."
- Navigate back to ModeSelector
- NO new check-in created

**Verification**:
- App.tsx: `canStartNewCheckin()` returns `{ allowed: false, reason: 'already-completed' }`
- Only one check-in document exists for today's date

---

## Test Suite 3: Weekend Check-In Flow

### TC-017: Start Check-In on Weekend
**Priority**: Critical
**Preconditions**:
- Current day is Saturday or Sunday
- Parent timezone set to America/New_York

**Steps**:
1. On ModeSelector, tap "My Day"
2. On MyDayWelcome, note greeting
3. On PartsOfMyDay screen, observe:
   - Title: "My Weekend"
   - Weekend categories displayed:
     - Family Time 👨‍👩‍👧
     - Activities & Hobbies 🎮
     - Outdoor Time 🏃
     - Friends & Playdates 👫
     - Sports & Classes ⚽
     - Quiet Time 🛏️
   - Pre-selected: Family Time, Activities, Outdoor
4. Tap "Continue"

**Expected Results**:
- Check-in created with weekend categories
- `isWeekend: true` in Firestore
- Card pools use weekend-specific cards

**Verification**:
```javascript
// Firestore check-in
{
  date: "2026-01-25",  // Saturday
  dayOfWeek: "Saturday",
  isWeekend: true,
  selectedCategories: ["family-time", "activities", "outdoor"]
}
```

---

### TC-018: Timezone Edge Case (Saturday Midnight)
**Priority**: High
**Preconditions**:
- Parent timezone: America/Los_Angeles (PST)
- Current time: Friday 11:59 PM PST
- App open

**Steps**:
1. Wait 1 minute (time crosses to Saturday 12:00 AM PST)
2. Start new check-in

**Expected Results**:
- Weekend categories shown (Saturday detected in PST timezone)
- Check-in date: Saturday's date
- Card pools: Weekend cards

**Verification**:
- `dateUtils.isWeekend("America/Los_Angeles")` returns `true`
- Check-in created with correct date for PST, not UTC

---

## Test Suite 4: Parent Space (Phase 2)

### TC-019: Access Parent Gate
**Priority**: Medium
**Preconditions**: On ModeSelector

**Steps**:
1. Tap "Parent Space" card
2. On ParentGate, observe math question: "What is 5 + 3?"
3. Enter answer: "8"
4. Tap "Continue"

**Expected Results**:
- Navigate to ParentSpaceHome
- Math question prevents kids from accidentally accessing parent features

---

### TC-020: View Child's Check-In
**Priority**: Critical (Phase 2)
**Preconditions**:
- Child completed and sent check-in today
- Parent in Parent Space

**Steps**:
1. On ParentSpaceHome, tap "Today's Story"
2. Observe check-in data:
   - Date: "Monday, January 27"
   - Categories completed with progress rings
   - Swipes summary (show "yes" cards, hide "no" cards)
   - Card text displayed with emojis

**Expected Results**:
- All "yes" swipes displayed
- "No" swipes hidden (focus on positive)
- Clean, readable visualization

---

### TC-021: Parent Check-In (Your Day)
**Priority**: Medium (Phase 2)
**Preconditions**: Parent in Parent Space

**Steps**:
1. Tap "Your Day"
2. Swipe through parent card pool (work, stress, self-care topics)
3. Complete cards
4. Save to `parentSwipes` collection

**Expected Results**:
- Parent swipes saved separately from kid swipes
- Can track parent's own reflections over time

---

## Test Suite 5: Edge Cases & Error Handling

### TC-022: No Internet Connection on Launch
**Priority**: High
**Preconditions**: Device in airplane mode

**Steps**:
1. Launch app
2. Attempt to sign in

**Expected Results**:
- Error message: "Unable to connect. Please check your internet connection."
- App remains on login screen
- Retry button shown

---

### TC-023: Internet Lost During Swipe
**Priority**: Medium
**Preconditions**: Mid-check-in, device connected

**Steps**:
1. On MomentCards screen
2. Turn off WiFi/data
3. Swipe card

**Expected Results**:
- Swipe fails silently or shows error Alert
- Option to retry when connection restored
- Progress saved locally (if offline persistence enabled)

---

### TC-024: Firestore Write Failure
**Priority**: Medium
**Preconditions**: Firestore rules misconfigured or quota exceeded

**Steps**:
1. Attempt to save swipe
2. Firestore returns permission denied error

**Expected Results**:
- Error Alert: "Could not save swipe. Please try again."
- Card doesn't advance
- User can retry

---

### TC-025: Multiple Devices, Same Account
**Priority**: Low
**Preconditions**:
- Same account logged in on iPhone and iPad
- Start check-in on iPhone

**Steps**:
1. iPhone: Complete Lunch category (100%)
2. iPad: Open app, navigate to CategoryHub
3. Observe progress

**Expected Results**:
- iPad shows stale progress (0%) until app reopened or screen refreshed
- No real-time sync (Firestore onSnapshot not implemented)
- On next launch, iPad loads latest progress from Firestore

**Known Limitation**: No real-time sync between devices

---

### TC-026: Delete Child Profile (Future Feature)
**Priority**: Low
**Preconditions**: Multiple children exist

**Steps**:
1. Settings → Manage Children
2. Tap "Delete" on child profile
3. Confirm deletion

**Expected Results**:
- Child document soft-deleted or archived (NOT hard-deleted)
- Check-ins remain in Firestore for records
- Child removed from UI

**Status**: Feature not yet implemented

---

### TC-027: Log Out and Log Back In
**Priority**: High
**Preconditions**: Logged in with active check-in in progress

**Steps**:
1. On ModeSelector, tap logout
2. Confirm logout
3. Log back in with same credentials
4. Navigate to "My Day"

**Expected Results**:
- Check-in state preserved in Firestore
- Resume from last point (progress rings show correct percentages)
- Local state (App.tsx) cleared on logout
- Reloaded from Firestore on login

---

### TC-028: Rapid Swipes (Stress Test)
**Priority**: Low
**Preconditions**: On MomentCards screen

**Steps**:
1. Swipe all 8 cards as fast as possible (< 5 seconds)
2. Observe Firestore writes

**Expected Results**:
- All 8 swipes saved successfully (no race condition)
- Progress updates correctly (100%)
- No duplicate swipes due to idempotent swipe IDs (category + cardIndex)

---

### TC-029: Change Category Selection Mid-Check-In
**Priority**: Medium
**Preconditions**: Check-in started with Lunch, Recess, Classroom

**Steps**:
1. Complete Lunch (100%)
2. On CategoryHub, tap "← Back" or navigate to PartsOfMyDay
3. Deselect "Recess", select "Specials"
4. Tap "Continue"

**Expected Results**:
- Check-in updated with new categories: ["lunch", "classroom", "specials"]
- Lunch progress preserved (100%)
- Recess progress removed (or archived)
- Specials progress starts at 0%

**Verification**:
- Firestore: `updateSelectedCategories()` called
- Progress recalculated based on new selections

---

### TC-030: Empty Card Pool (Data Error)
**Priority**: Low
**Preconditions**: Card pool for "Lunch" is empty or undefined

**Steps**:
1. Select "Lunch" category
2. Navigate to MomentCards

**Expected Results**:
- Error handling: Show Alert "No cards available for this category"
- Navigate back to CategoryHub
- Log error to console

**Prevention**: Validate card pools in data file, ensure all categories have at least 8 cards

---

## Test Suite 6: Data Integrity & Validation

### TC-031: Verify Firestore Schema
**Priority**: High
**Preconditions**: Check-in completed and sent

**Steps**:
1. Open Firebase Console
2. Navigate to `parents/{uid}/kids/{kidId}/checkins/{checkinId}`
3. Verify document structure

**Expected Schema**:
```javascript
{
  date: "2026-01-28",            // String, YYYY-MM-DD
  dayOfWeek: "Tuesday",          // String
  isWeekend: false,              // Boolean
  selectedCategories: [...],     // Array of strings
  categoryProgress: {...},       // Object, keys = category IDs, values = 0-100
  isLocked: true,                // Boolean
  sentToParentAt: Timestamp,     // Firestore Timestamp
  completedAt: Timestamp,        // Firestore Timestamp
  createdAt: Timestamp,          // Firestore Timestamp
  updatedAt: Timestamp           // Firestore Timestamp
}
```

---

### TC-032: Verify Swipe Deduplication
**Priority**: Medium
**Preconditions**: Swipe same card twice (due to bug or rapid taps)

**Steps**:
1. Swipe card 0 right (yes)
2. Force save again: `saveSwipe({ category: "lunch", cardIndex: 0, choice: "yes" })`
3. Query `listSwipes()` for check-in

**Expected Results**:
- Only ONE swipe document exists for lunch_0
- Most recent swipe overwrites previous (merge: true)
- `listSwipes()` deduplicates by (category + cardIndex) key

---

### TC-033: Verify Timezone Consistency
**Priority**: High
**Preconditions**:
- Parent timezone: America/Chicago (CST)
- Current time: 11:30 PM CST (12:30 AM UTC next day)

**Steps**:
1. Start check-in
2. Check Firestore date field

**Expected Results**:
- Date matches CST date (e.g., "2026-01-28")
- NOT UTC date (which would be "2026-01-29")
- Weekend detection uses CST day of week

**Verification**:
- `getTodayDateString("America/Chicago")` returns correct date for CST
- Consistent across all date operations

---

## Test Suite 7: Performance & UX

### TC-034: App Cold Start Time
**Priority**: Medium
**Target**: < 3 seconds to login screen

**Steps**:
1. Force quit app
2. Launch app
3. Measure time to login screen

**Expected Results**:
- Login screen appears within 3 seconds
- Splash screen minimal
- No blocking operations on launch

---

### TC-035: Navigation Responsiveness
**Priority**: High
**Target**: < 300ms screen transitions

**Steps**:
1. Navigate through full check-in flow
2. Measure time between tap and screen render

**Expected Results**:
- All navigation transitions feel instant (< 300ms)
- No laggy animations
- Smooth stack navigator transitions

---

### TC-036: Swipe Animation Smoothness
**Priority**: High
**Target**: 60 FPS during swipe

**Steps**:
1. On MomentCards, swipe card with gesture
2. Observe animation

**Expected Results**:
- Card follows finger smoothly
- No frame drops during swipe
- Rotation and exit animation smooth

---

### TC-037: Large Check-In History (100+ Check-Ins)
**Priority**: Low
**Preconditions**: Kid has 100 check-ins in Firestore

**Steps**:
1. Load TodaysStory screen
2. Measure load time

**Expected Results**:
- Query limited to recent check-ins (use Firestore `limit()`)
- Load time < 2 seconds
- No memory issues

---

## Test Suite 8: Accessibility

### TC-038: Screen Reader Support
**Priority**: Medium
**Preconditions**: iOS VoiceOver or Android TalkBack enabled

**Steps**:
1. Navigate through check-in flow with screen reader
2. Verify all buttons, labels, and content readable

**Expected Results**:
- All interactive elements have accessible labels
- Progress rings announce percentages
- Card text read aloud clearly

**Status**: Not yet implemented, Phase 2 feature

---

### TC-039: Large Text Support
**Priority**: Low
**Preconditions**: iOS/Android large text settings enabled

**Steps**:
1. Enable large text (200% scale)
2. Navigate through app

**Expected Results**:
- Text scales appropriately
- No text cutoff
- Layouts adjust for larger text

**Status**: Partial support, needs testing

---

## Test Execution Checklist

### Pre-Release Testing (Required)
- [ ] TC-001: New User Sign Up
- [ ] TC-002: Existing User Login
- [ ] TC-004: Parent Profile Setup
- [ ] TC-005: Add First Child
- [ ] TC-007: Start New Check-In (Weekday)
- [ ] TC-009: Complete Full Category
- [ ] TC-012: Complete All Categories
- [ ] TC-013: Send to Parent (All Complete)
- [ ] TC-016: Attempt Second Check-In Same Day
- [ ] TC-017: Start Check-In on Weekend
- [ ] TC-027: Log Out and Log Back In

### Regression Testing (After Bug Fixes)
- [ ] TC-003: Login with Incorrect Password
- [ ] TC-010: Pause Mid-Category
- [ ] TC-011: Resume Incomplete Check-In
- [ ] TC-014: Send to Parent (Incomplete)
- [ ] TC-022: No Internet Connection on Launch
- [ ] TC-029: Change Category Selection Mid-Check-In

### Performance Testing (Before Launch)
- [ ] TC-034: App Cold Start Time
- [ ] TC-035: Navigation Responsiveness
- [ ] TC-036: Swipe Animation Smoothness

### Data Integrity Testing (After Schema Changes)
- [ ] TC-031: Verify Firestore Schema
- [ ] TC-032: Verify Swipe Deduplication
- [ ] TC-033: Verify Timezone Consistency

---

## Automated Testing Recommendations

### Unit Tests (Jest + React Native Testing Library)
```javascript
// Example: dateUtils.test.ts
describe('getTodayDateString', () => {
  it('returns YYYY-MM-DD format for New York timezone', () => {
    const result = getTodayDateString('America/New_York');
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('returns correct date at midnight boundary', () => {
    // Mock Date to 11:59 PM EST
    // Verify returns current day, not next day
  });
});

describe('getRandomCards', () => {
  it('returns 8 unique cards from pool', () => {
    const cards = getRandomCards('lunch', 8);
    expect(cards).toHaveLength(8);
    expect(new Set(cards.map(c => c.id)).size).toBe(8);
  });
});
```

### Integration Tests (Firebase Emulator)
```javascript
// Example: db.test.ts
describe('createTodayCheckin', () => {
  beforeAll(() => {
    // Initialize Firestore emulator
  });

  it('creates check-in with correct schema', async () => {
    const checkinId = await createTodayCheckin({
      uid: 'testuser',
      kidId: 'testkid',
      selectedCategories: ['lunch', 'recess'],
      timezone: 'America/New_York'
    });

    const checkin = await getCheckin({ uid: 'testuser', kidId: 'testkid', checkinId });
    expect(checkin).toMatchObject({
      selectedCategories: ['lunch', 'recess'],
      categoryProgress: { lunch: 0, recess: 0 },
      isLocked: false
    });
  });

  it('updates existing check-in if same date', async () => {
    // Create check-in for today
    const id1 = await createTodayCheckin({ uid: 'testuser', kidId: 'testkid', selectedCategories: ['lunch'] });

    // Call again with different categories
    const id2 = await createTodayCheckin({ uid: 'testuser', kidId: 'testkid', selectedCategories: ['recess'] });

    // Same ID returned
    expect(id1).toBe(id2);

    // Categories updated
    const checkin = await getCheckin({ uid: 'testuser', kidId: 'testkid', checkinId: id1 });
    expect(checkin.selectedCategories).toContain('recess');
  });
});
```

### E2E Tests (Detox)
```javascript
// Example: checkin.e2e.js
describe('Check-In Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
    await loginAsTestUser();
  });

  it('should complete full check-in flow', async () => {
    // Tap My Day
    await element(by.text('My Day')).tap();

    // Tap Let's Talk About My Day
    await element(by.text("Let's Talk About My Day")).tap();

    // Verify categories shown
    await expect(element(by.text('Lunch'))).toBeVisible();

    // Tap Continue
    await element(by.text('Continue')).tap();

    // Select Lunch category
    await element(by.text('Lunch')).tap();

    // Swipe 8 cards
    for (let i = 0; i < 8; i++) {
      await element(by.id('swipe-card')).swipe('right', 'fast');
      await waitFor(element(by.id('swipe-card'))).toBeVisible().withTimeout(2000);
    }

    // Verify back at CategoryHub
    await expect(element(by.text('My Day Progress'))).toBeVisible();

    // Verify Lunch at 100%
    await expect(element(by.text('Complete!'))).toBeVisible();
  });
});
```

---

## Test Coverage Summary

| Test Suite | Test Cases | Priority | Status |
|------------|-----------|----------|--------|
| Authentication & Onboarding | TC-001 to TC-006 | Critical | ✅ Manual |
| Kid Check-In (Weekday) | TC-007 to TC-016 | Critical | ✅ Manual |
| Weekend Check-In | TC-017 to TC-018 | High | ✅ Manual |
| Parent Space | TC-019 to TC-021 | Medium | ⏳ Phase 2 |
| Edge Cases | TC-022 to TC-030 | Medium | ✅ Manual |
| Data Integrity | TC-031 to TC-033 | High | ✅ Manual |
| Performance | TC-034 to TC-037 | Medium | ⏳ Needs Tools |
| Accessibility | TC-038 to TC-039 | Low | ⏳ Phase 2 |

**Total Test Cases**: 39
**Automated**: 0 (all manual currently)
**Recommended for Automation**: 20 (marked with unit/integration/e2e examples)

---

## Bug Tracking Template

When a test fails, log bugs with this format:

**Bug ID**: BUG-XXX
**Test Case**: TC-XXX
**Severity**: Critical / High / Medium / Low
**Description**: Brief description of issue
**Steps to Reproduce**:
1. Step 1
2. Step 2
**Expected**: What should happen
**Actual**: What actually happened
**Screenshots**: Attach if applicable
**Logs**: Relevant console errors
**Environment**: iOS 17 / Android 13 / Web Chrome
**Assigned To**: Developer name
**Status**: Open / In Progress / Fixed / Closed

---

## Test Sign-Off

Before each release, all Critical and High priority test cases must pass.

**Version**: 1.0.0
**Test Date**: YYYY-MM-DD
**Tested By**: QA Engineer Name
**Platform**: iOS / Android / Web
**Pass Rate**: X/Y tests passed
**Blockers**: List any critical bugs
**Sign-Off**: Approved for release [ ] Yes [ ] No
