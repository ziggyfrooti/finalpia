# Complete Testing Guide - PIA Mobile App

## Status: Ready for Testing

All 17 screens now have proper SafeAreaView implementation. Text positioning issues are fixed.

---

## Test Credentials

- **Email**: test@gmail.com
- **Password**: 123456

---

## How to Start Testing

### Mobile (Recommended)
```bash
cd "/Users/enj0800/AI-Work/pia mobile app"
npx expo start
```
Scan the QR code with Expo Go app on your phone.

### Web (Quick Test)
```bash
cd "/Users/enj0800/AI-Work/pia mobile app"
npm run web
```
Open http://localhost:8081

---

## Complete Test Flows

### Flow 1: New User Setup (First Time)
**Time**: 5 minutes

1. **Login**
   - See splash screen with PIA mascot
   - Click "Continue with Email"
   - Enter test@gmail.com / 123456
   - Successfully authenticate

2. **Parent Setup** (If first time)
   - Enter parent name
   - Click "Continue"
   - Redirected to Add Child screen

3. **Add Child**
   - Enter child's name (e.g., "Emma")
   - Select an avatar emoji
   - Click "Add Child"
   - See success modal
   - Click "Continue"

4. **Mode Selector**
   - See two options: "My Day" and "Parent Space"
   - See child selector at top (shows Emma)
   - Verify logout button works

**What to Check**:
- ✓ No text cut off at top/bottom
- ✓ All buttons visible and clickable
- ✓ Navigation flows smoothly
- ✓ Child data persists

---

### Flow 2: Kid's Daily Check-In ("My Day")
**Time**: 8 minutes

1. **Start from Mode Selector**
   - Click "My Day" card

2. **Welcome Screen**
   - See greeting with child's name
   - See time-appropriate greeting (morning/afternoon/evening)
   - Click "Start My Day"

3. **Parts of My Day** (Category Selection)
   - See 5 categories: Lunch, Recess, Classroom, Specials, Bus/Carline
   - Default: 3 selected (Lunch, Recess, Classroom)
   - Toggle categories on/off
   - See counter update ("3 parts selected")
   - Click "Continue"

4. **Category Hub** (Progress Tracking)
   - See all selected categories as cards
   - Each shows 0% complete
   - Click a category (e.g., "Lunch")

5. **Moment Cards** (Swipe Experience)
   - See category-specific cards
   - **Test swipe mechanics**:
     - Swipe RIGHT = "This happened to me"
     - Swipe LEFT = "This didn't happen to me"
     - Cards animate and disappear
     - Progress bar updates
   - **Pause menu** (tap pause button):
     - Can resume
     - Can go back to categories
     - Can go home
   - Complete all cards in category

6. **Back to Category Hub**
   - See completed category marked 100%
   - Progress ring shows completion
   - Click another category or "Complete My Day"

7. **Completion Screen**
   - See celebration message
   - See mascot
   - Click "Back to Home"

**What to Check**:
- ✓ Swipe gestures work smoothly
- ✓ Progress persists across screens
- ✓ Can navigate back without losing data
- ✓ Pause menu works correctly
- ✓ All text visible (especially on cards)
- ✓ Animations smooth
- ✓ Data saves to Firebase

---

### Flow 3: Parent Space Experience
**Time**: 6 minutes

1. **Start from Mode Selector**
   - Select child from dropdown (if multiple)
   - Click "Parent Space" card

2. **Parent Space Home**
   - See 4 options:
     - "Today's Story" (View today's moments)
     - "Your Day" (Swipe through moments)
     - "Your Balance" (View charts/analytics)
     - "Kid Check-in" (Help kid check in)

3. **Today's Story**
   - See child selector at top
   - View moments from today's check-in
   - See categories completed
   - See specific cards swiped right/left
   - Navigate back

4. **Your Day** (Swipe View)
   - Swipe through child's moments
   - See visual representation
   - Navigate back

5. **Your Balance** (Analytics)
   - See charts and stats
   - View trends
   - Navigate back

**What to Check**:
- ✓ Child selector works (if multiple children)
- ✓ Data from kid's check-in displays correctly
- ✓ All 4 options accessible
- ✓ Back navigation works
- ✓ No data loss between screens

---

### Flow 4: Multiple Children Management
**Time**: 4 minutes

1. **Add Another Child**
   - From Mode Selector, click child dropdown
   - Click "Add Another Child"
   - Fill in details
   - Add child

2. **Switch Between Children**
   - Use dropdown to switch
   - Verify different data for each child
   - Check "Today's Story" shows correct child

**What to Check**:
- ✓ Can add multiple children
- ✓ Data doesn't mix between children
- ✓ Dropdown updates correctly

---

### Flow 5: Logout and Re-login
**Time**: 2 minutes

1. **Logout**
   - From Mode Selector, click "Sign out"
   - Verify redirected to login screen

2. **Re-login**
   - Login with test@gmail.com / 123456
   - Verify all data persists (children, check-ins)
   - Verify no need to re-setup

**What to Check**:
- ✓ Logout works
- ✓ Data persists after logout
- ✓ Can login again successfully

---

## Device-Specific Testing

### iPhone with Notch (iPhone X+)
**Critical Areas to Check**:
- Top of screen: Text should not go under notch/Dynamic Island
- Bottom of screen: Buttons should not go under home indicator
- Swipe cards: Content visible during swipe gesture
- Modals: Properly centered and visible

### Android Devices
**Critical Areas to Check**:
- Status bar: Text not hidden
- Navigation bar: Buttons accessible
- Different screen sizes: Layout responsive

### iPad/Tablets
**Check**:
- Layout scales appropriately
- Touch targets still comfortable
- Cards don't stretch awkwardly

---

## Detailed Feature Testing

### 1. Swipe Card Mechanics
**Test**:
- Smooth swipe gesture (not too sensitive/insensitive)
- Visual feedback during swipe
- Card snaps back if not swiped far enough
- Next card appears smoothly
- Progress bar updates immediately
- No crashes on rapid swiping

### 2. Firebase Integration
**Test**:
- Data saves immediately (no delay)
- Data persists across app restarts
- Multiple users don't conflict
- Network errors handled gracefully

### 3. Form Validation
**Test**:
- Can't submit empty names (parent/child)
- Email validation works
- Password validation works
- Error messages clear and helpful

### 4. Navigation
**Test**:
- Back buttons work on all screens
- Can navigate to any flow from Mode Selector
- No dead ends
- No double-navigation bugs

---

## Edge Cases to Test

### 1. No Internet Connection
- Try logging in offline
- Try checking in offline
- Verify error messages

### 2. Empty States
- Parent views Today's Story before kid checks in
- Select 0 categories (should prevent continue)
- Complete all categories before completing day

### 3. Interruptions
- Answer phone call during swipe
- App goes to background mid-check-in
- Lock device and unlock
- Verify data not lost

### 4. Data Integrity
- Complete check-in twice same day
- Switch children mid-check-in
- Delete child (if feature exists)

---

## Known Limitations

1. **Google Sign-In**: May not work on web (Firebase limitation)
2. **Offline Mode**: Requires internet for first login
3. **Data Sync**: Real-time updates may have slight delay

---

## Reporting Issues

When reporting bugs, include:

1. **Device**: iPhone 14 Pro, Android Pixel 7, etc.
2. **Screen**: Which screen the issue occurred
3. **Steps**: Exact steps to reproduce
4. **Expected**: What should happen
5. **Actual**: What actually happened
6. **Screenshot**: If applicable

**Example**:
```
Device: iPhone 14 Pro
Screen: MomentCards
Steps:
  1. Started check-in
  2. Selected Lunch category
  3. Swiped 3 cards right
  4. App froze
Expected: Card should disappear and next card appear
Actual: App froze, had to force quit
Screenshot: [attached]
```

---

## Success Criteria

The app is working correctly if:

- ✓ All text is visible (no cutoff)
- ✓ All buttons are clickable
- ✓ Navigation flows logically
- ✓ Data persists correctly
- ✓ No crashes or freezes
- ✓ Swipe gestures feel natural
- ✓ Loading states show when needed
- ✓ Error messages are helpful

---

## Performance Benchmarks

**Load Times** (should be):
- Login → Mode Selector: < 2 seconds
- Mode Selector → My Day Welcome: Instant
- Category selection → Category Hub: < 1 second
- Swipe card response: < 100ms

**Data Operations**:
- Save swipe: < 500ms
- Load Today's Story: < 2 seconds
- Add child: < 1 second

---

## Next Steps After Testing

1. **Test on your actual device** (not simulator)
2. **Complete at least 2 full check-ins**
3. **Try all 4 Parent Space features**
4. **Test with 2+ children**
5. **Report any issues found**

---

## Quick Command Reference

```bash
# Start for mobile
npx expo start

# Start for web
npm run web

# Clear cache if issues
npm start -- --clear

# Check for errors
npx tsc --noEmit

# View logs
# (Logs appear in terminal where expo is running)
```

---

## Questions to Ask While Testing

1. **UX**: Does this feel intuitive?
2. **Flow**: Am I confused at any point?
3. **Visual**: Does text positioning look correct?
4. **Speed**: Is anything too slow?
5. **Bugs**: Did anything unexpected happen?
6. **Value**: Would a parent/kid actually use this?

---

**Testing should take approximately 30-45 minutes for complete coverage.**

Good luck! 🚀
