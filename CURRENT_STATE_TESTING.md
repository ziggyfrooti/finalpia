# Current State Testing Plan - PIA Mobile App

## Status: Ready for Manual Testing

Based on comprehensive code review, here's the current state and testing plan.

---

## Issues Analysis

### ✅ Already Fixed
1. **Progress Tracking Bug** - FIXED
   - Previous issue: Pausing mid-category marked it as 100% complete
   - Fix: Added `onProgressUpdate` callback that calculates actual progress `(currentIndex / cards.length) * 100`
   - Files: `MomentCards.tsx` (lines 276-280), `App.tsx` (lines 276-280)

2. **Safe Area Handling** - FIXED
   - All 17 screens wrapped with `ScreenWrapper`
   - Text no longer cut off on notched devices

3. **Firebase Connection** - FIXED
   - `.env` configured with credentials
   - Authentication working

4. **TodaysStory Data Dependency** - NOT AN ISSUE
   - Code correctly handles missing `checkinId` by fetching latest check-in
   - Fallback logic at `TodaysStory.tsx:168-178`

5. **Swipe Save Validation** - GOOD
   - Line 283 in App.tsx checks: `if (user && selectedKid?.id && currentCheckinId)`
   - Won't attempt to save with null checkinId

### ⚠️ Known Issues (Non-Critical)

6. **YourBalance is Static** - ACKNOWLEDGED
   - All data hardcoded (lines 15-29 in `YourBalance.tsx`)
   - Shows UI mockup, not real data
   - **Decision**: This is a "nice to have" parent feature, not critical for kid flow
   - **Action**: Document as future enhancement, NOT a blocker for current version

7. **No Minimum Category Selection** - MINOR UX
   - User can continue with 0 categories in PartsOfMyDay
   - **Impact**: Creates empty check-in
   - **Action**: Test to verify if this causes issues in CategoryHub

8. **CategoryHub "Done" Always Enabled** - MINOR UX
   - "Done for Today" button works even with 0% progress
   - **Impact**: User can complete check-in without any swipes
   - **Action**: Test to verify this is intentional (allows flexibility)

### ❌ Critical Issues Found by Analysis

9. **Swipe Save Failure Handling** - NEEDS TESTING
   - If `saveSwipe()` fails, card still advances
   - Location: `MomentCards.tsx:96-122`
   - **Risk**: Silent data loss
   - **Test**: Disconnect internet during swipe, verify behavior

---

## Manual Testing Checklist

### Pre-Testing Setup
- [ ] Expo dev server running (`npx expo start`)
- [ ] Test device connected
- [ ] Firebase accessible
- [ ] Test credentials ready: test@gmail.com / 123456

---

## Test Suite 1: Login & Setup Flow (10 minutes)

### Test 1.1: Email Login
- [ ] Open app
- [ ] See splash screen (should auto-advance after 2.5s)
- [ ] See login screen
- [ ] Click "Continue with Email"
- [ ] Enter test@gmail.com / 123456
- [ ] Click "Sign In"
- [ ] **Expected**: Navigate to ModeSelector (user exists)
- [ ] **Check**: No errors in console

### Test 1.2: Logout and Re-login
- [ ] From ModeSelector, click "Sign out"
- [ ] **Expected**: Navigate to login screen
- [ ] Re-login with test@gmail.com / 123456
- [ ] **Expected**: Navigate to ModeSelector
- [ ] **Check**: All kids still present in dropdown

### Test 1.3: Child Selector
- [ ] Click child dropdown in ModeSelector
- [ ] **Expected**: See list of existing children
- [ ] Select different child
- [ ] **Expected**: Selected child updates
- [ ] **Check**: Child name displays correctly

---

## Test Suite 2: Kid Flow - Full Check-In (15 minutes)

### Test 2.1: Start Check-In
- [ ] From ModeSelector, click "My Day" card
- [ ] **Expected**: Navigate to MyDayWelcome
- [ ] **Check**: Child's name appears in greeting
- [ ] **Check**: Time-appropriate greeting (morning/afternoon/evening)
- [ ] Click "Start My Day"
- [ ] **Expected**: Navigate to PartsOfMyDay

### Test 2.2: Category Selection
- [ ] **Check**: Lunch, Recess, Classroom pre-selected
- [ ] Toggle off "Lunch"
- [ ] **Check**: Counter shows "2 parts selected"
- [ ] Toggle "Specials" on
- [ ] **Check**: Counter shows "3 parts selected"
- [ ] Click "Continue"
- [ ] **Expected**: Navigate to CategoryHub
- [ ] **Check**: Only selected categories appear (Recess, Classroom, Specials)

### Test 2.3: Complete One Category (Lunch)
- [ ] Click "Lunch" category card
- [ ] **Expected**: Navigate to MomentCards
- [ ] **Check**: Card shows lunch-specific moment
- [ ] Swipe RIGHT (Yes)
- [ ] **Check**: Card animates off screen
- [ ] **Check**: Next card appears
- [ ] **Check**: Progress bar increases
- [ ] Continue swiping through 5 more cards
- [ ] **Expected**: After last card, navigate to CategoryHub
- [ ] **Check**: Lunch shows 100% complete
- [ ] **Check**: Lunch card has checkmark/green indicator

### Test 2.4: Pause Mid-Category (CRITICAL TEST)
- [ ] Click "Recess" category
- [ ] Swipe 2 cards (out of ~10)
- [ ] Click pause button (top right)
- [ ] **Expected**: Pause menu appears
- [ ] Click "Change Category"
- [ ] **Expected**: Navigate to CategoryHub
- [ ] **CRITICAL CHECK**: Recess should show ~20% complete, NOT 100%
- [ ] **Check**: Console shows correct progress value
- [ ] Click "Recess" again
- [ ] **Expected**: Starts from card 3 (next uncompleted card)

### Test 2.5: "Done for Today" Mid-Category
- [ ] In Recess, pause after 3 cards
- [ ] Click "Done for Today"
- [ ] **Expected**: Navigate to CategoryHub
- [ ] **CRITICAL CHECK**: Recess shows ~30% complete
- [ ] Click "Done for Today" from CategoryHub
- [ ] **Expected**: Navigate to CompletionScreen
- [ ] **Check**: Celebration message appears
- [ ] Click "Done"
- [ ] **Expected**: Navigate to ModeSelector

### Test 2.6: Complete All Categories
- [ ] Start new check-in
- [ ] Select 2 categories (Lunch, Recess)
- [ ] Complete Lunch (all cards)
- [ ] **Check**: Lunch shows 100%
- [ ] Complete Recess (all cards)
- [ ] **Check**: Recess shows 100%
- [ ] **Check**: "All done!" or similar message appears
- [ ] Click "Complete My Day"
- [ ] **Expected**: Navigate to CompletionScreen
- [ ] **Check**: Success message
- [ ] Navigate back to ModeSelector

---

## Test Suite 3: Parent Flow (15 minutes)

### Test 3.1: Navigate to Parent Space
- [ ] From ModeSelector, click "Parent Space" card
- [ ] **Expected**: Navigate to ParentSpaceHome
- [ ] **Check**: See 4 option cards:
  - Kid Check-in
  - Today's Story
  - Your Day
  - Your Balance

### Test 3.2: Today's Story (After Kid Check-In)
- [ ] Ensure kid has completed at least one check-in today
- [ ] From ParentSpaceHome, click "Today's Story"
- [ ] **Expected**: Navigate to TodaysStory
- [ ] **Check**: Child selector shows current child
- [ ] **Check**: Today's date displays
- [ ] **Check**: Completed categories show with swipe data
- [ ] Expand a category
- [ ] **Check**: "Yes" and "No" swipes separated
- [ ] **Check**: Conversation starters appear
- [ ] Click back arrow
- [ ] **Expected**: Navigate to ParentSpaceHome

### Test 3.3: Today's Story (No Check-In)
- [ ] Login as new user OR use child with no check-ins
- [ ] Navigate to Parent Space → Today's Story
- [ ] **Expected**: Empty state message ("No check-in yet")
- [ ] **Check**: No crash, graceful handling

### Test 3.4: Your Day (Parent Swipe)
- [ ] From ParentSpaceHome, click "Your Day"
- [ ] **Expected**: Category selection screen
- [ ] Select 2-3 categories (e.g., Children, Work)
- [ ] Click "Continue"
- [ ] **Expected**: Swipe cards screen
- [ ] Swipe through 3-5 cards
- [ ] **Check**: Cards animate correctly
- [ ] **Check**: Progress bar updates
- [ ] Complete all cards
- [ ] **Expected**: Navigate back to ParentSpaceHome
- [ ] **Check**: Data saved (check Firestore console)

### Test 3.5: Your Balance (Static Data)
- [ ] From ParentSpaceHome, click "Your Balance"
- [ ] **Expected**: Navigate to YourBalance
- [ ] **Check**: Bubble chart displays
- [ ] **Check**: Weekly breakdown shows
- [ ] **Check**: Suggestions card displays
- [ ] **KNOWN ISSUE**: Data is hardcoded, not real
- [ ] **Action**: Document that this works as UI mockup
- [ ] Click back
- [ ] **Expected**: Navigate to ParentSpaceHome

### Test 3.6: Kid Check-In from Parent Space
- [ ] From ParentSpaceHome, click "Kid Check-in"
- [ ] **Expected**: Navigate to MyDayWelcome (kid flow)
- [ ] **Check**: Can complete kid flow
- [ ] Return to ModeSelector
- [ ] Go to Parent Space → Today's Story
- [ ] **Check**: New check-in appears

---

## Test Suite 4: Multiple Children (10 minutes)

### Test 4.1: Add Second Child
- [ ] From ModeSelector, click child dropdown
- [ ] Click "Add Another Child"
- [ ] **Expected**: Navigate to AddChildScreen
- [ ] Enter name (e.g., "Oliver")
- [ ] Select avatar
- [ ] Click "Add Child"
- [ ] **Expected**: Success modal appears
- [ ] Click "Continue"
- [ ] **Expected**: Navigate to ModeSelector
- [ ] **Check**: Dropdown now shows both children

### Test 4.2: Switch Between Children
- [ ] Select first child from dropdown
- [ ] Complete check-in for first child
- [ ] Return to ModeSelector
- [ ] Switch to second child via dropdown
- [ ] Complete check-in for second child
- [ ] Go to Parent Space → Today's Story
- [ ] **Check**: Shows second child's data
- [ ] Use kid selector to switch to first child
- [ ] **CHECK**: Shows first child's data (not mixed)

---

## Test Suite 5: Edge Cases & Error Handling (10 minutes)

### Test 5.1: Network Interruption
- [ ] Start swiping cards
- [ ] Disconnect internet/wifi
- [ ] Swipe 2-3 cards
- [ ] **Expected**: Error alert appears OR cards queue for later
- [ ] Reconnect internet
- [ ] **Check**: Data eventually saves OR user can retry
- [ ] **CRITICAL**: Verify no data lost

### Test 5.2: Rapid Swiping
- [ ] Start swiping cards very quickly
- [ ] Swipe 5 cards in <2 seconds
- [ ] **Expected**: All swipes register
- [ ] **Check**: No crashes
- [ ] **Check**: All swipes saved in Firestore

### Test 5.3: App Backgrounding
- [ ] Start check-in, complete 2 categories
- [ ] Put app in background (home button)
- [ ] Wait 30 seconds
- [ ] Return to app
- [ ] **Expected**: Still on same screen
- [ ] **Check**: Progress preserved
- [ ] Continue check-in
- [ ] **Check**: Data saves correctly

### Test 5.4: Empty Category Selection
- [ ] In PartsOfMyDay, deselect all categories
- [ ] Click "Continue"
- [ ] **Expected**: Either disabled OR alert appears
- [ ] **Action**: Document actual behavior

### Test 5.5: "Done" with 0% Progress
- [ ] Start check-in with 3 categories
- [ ] Don't complete any category
- [ ] Click "Done for Today"
- [ ] **Expected**: Either confirmation dialog OR completes anyway
- [ ] **Action**: Document actual behavior

---

## Test Suite 6: Data Persistence (5 minutes)

### Test 6.1: Check Firestore Data
- [ ] Complete a full check-in
- [ ] Open Firebase Console
- [ ] Navigate to: `parents/{uid}/kids/{kidId}/checkins/`
- [ ] **Check**: Today's check-in exists
- [ ] **Check**: `selectedCategories` array correct
- [ ] Navigate to: `.../checkins/{checkinId}/swipes/`
- [ ] **Check**: All swipes saved
- [ ] **Check**: Each swipe has: category, cardIndex, cardText, choice

### Test 6.2: Logout and Re-login Data Check
- [ ] Complete check-in
- [ ] Logout
- [ ] Close app completely
- [ ] Reopen app
- [ ] Login
- [ ] Go to Parent Space → Today's Story
- [ ] **Check**: All previous data still visible

---

## Performance Checks

### Load Times (Should be fast)
- [ ] Login to ModeSelector: < 2 seconds
- [ ] ModeSelector to MyDayWelcome: Instant
- [ ] PartsOfMyDay to CategoryHub: < 1 second
- [ ] Card swipe response: < 100ms
- [ ] TodaysStory load: < 2 seconds

### Visual Quality
- [ ] No text cutoff on any screen
- [ ] All buttons clickable and visible
- [ ] Animations smooth (60fps)
- [ ] No layout shifts or jumps
- [ ] Cards swipe smoothly

### Console Checks
- [ ] No errors in console during happy path
- [ ] Warnings acceptable (React Native may have expected warnings)
- [ ] No "undefined" or "null" errors

---

## Issue Documentation Template

If you find any issues, document them like this:

```
**Issue #X: [Brief Description]**
- Screen: [Screen name]
- Steps to reproduce:
  1. [Step 1]
  2. [Step 2]
  3. [Step 3]
- Expected: [What should happen]
- Actual: [What actually happened]
- Severity: [Critical / High / Medium / Low]
- Screenshot: [If applicable]
- Console error: [If any]
```

---

## Success Criteria

The app is ready for sounds/celebrations if:

✅ All critical tests pass:
- Login/logout works
- Kid flow completes successfully
- Progress tracking accurate (mid-category pause shows correct %)
- Parent space displays data correctly
- Multiple children don't mix data
- Data persists across sessions

✅ Performance is acceptable:
- No crashes
- Smooth animations
- Fast load times

✅ Known issues are documented:
- YourBalance static data (acknowledged, not critical)
- Any other non-critical UX issues

---

## After Testing

Once testing is complete:

1. **If all tests pass**:
   - Document: "Current version verified working ✅"
   - Proceed to Phase 1: Sounds & Celebrations implementation

2. **If critical issues found**:
   - Document all issues
   - Fix critical issues first
   - Re-test
   - Then proceed to sounds/celebrations

3. **If minor issues found**:
   - Document issues
   - Decide: Fix now OR add to future enhancements
   - Proceed to sounds/celebrations if issues non-blocking

---

## Next Step After Testing

Once you confirm the app works:

1. Review `PHASE_1_IMPLEMENTATION.md` for sounds/celebrations plan
2. Approve the plan or suggest changes
3. I'll implement:
   - Swipe sounds (left/right different sounds)
   - Completion celebration sounds
   - Confetti animation on CompletionScreen
   - Optional: Haptic feedback

Estimated implementation time: 2-3 hours
Libraries needed: expo-av, react-native-confetti-cannon

---

**Ready to test!** 🧪

Start with Test Suite 1 (Login & Setup), then proceed through each suite systematically.
