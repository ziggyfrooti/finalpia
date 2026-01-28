# TODO List - Awaiting Your Approval

## Quick Summary

I've analyzed all your feedback and created a detailed implementation plan. Here's what needs to be done:

---

## Priority 1: Must-Do Tasks (6-8 hours)

### 1. ✅ Fix Transport Conversation Starters (10 minutes)
**What**: Add conversation starters for Bus/Transport in TodaysStory
**Why**: Currently missing, parents see no suggestions for this category
**File**: `src/screens/TodaysStory.tsx`

---

### 2. ✅ Implement "Send to Parent" Lock System (2 hours)
**What**:
- Add "Send to Parent" button on CompletionScreen after confetti
- Lock check-in after sending (prevent edits)
- Show "Already completed today" if locked

**Why**: Prevent kids from editing after submission, ensure one-time daily entry

**Changes**:
- CompletionScreen: Add "Send to Parent" button + "I'll send later" option
- Database: Add `isLocked` and `sentToParentAt` fields
- Guard: Block new check-in if today's is locked
- Parent view: Show "✉️ Sent to you" badge

**Files**:
- `src/screens/CompletionScreen.tsx`
- `src/lib/db.ts`
- `App.tsx`
- `src/screens/TodaysStory.tsx`

---

### 3. ✅ Timezone-Based Daily Reset (3-4 hours)
**What**:
- Use parent's timezone for daily reset
- Store check-in with date (YYYY-MM-DD) and day of week
- Prevent multiple check-ins same day
- Allow new check-in at midnight in their timezone

**Why**: Kids in different timezones see correct day, proper daily tracking

**Changes**:
- Database: Add `date` and `dayOfWeek` fields to check-ins
- Logic: Check if today's check-in exists before creating new
- Utility: Create timezone-aware date functions
- Optional: Monday-Friday restriction (we'll discuss)

**Files**:
- `src/lib/dateUtils.ts` (new file)
- `src/lib/db.ts`
- `App.tsx`
- `src/screens/CategoryHub.tsx` (show date)

---

### 4. ✅ Add Change Category Confirmation (30 minutes)
**What**:
- If user has completed categories, prevent deselecting them
- Completed categories show lock icon 🔒
- Can only ADD new categories, not remove completed ones

**Why**: Prevent accidental data loss

**Files**:
- `src/screens/PartsOfMyDay.tsx`
- `App.tsx` (pass progress data)

---

## Priority 2: Nice-to-Have (3 hours)

### 5. ✅ Dynamic Card Rotation (2-3 hours)
**What**:
- Expand card pool to 30-50 cards per category
- Randomly select 8 cards each day
- Ensures variety, no repetition

**Why**: Kids won't get bored after 2 days

**Options**:
- **Option A**: I generate 150-250 cards using AI, you review (recommended)
- **Option B**: You write all cards yourself (time-consuming)
- **Option C**: Template system with variables (Phase 2)

**Files**:
- `src/screens/MomentCards.tsx`
- `src/data/cardPools.ts` (new file with large card library)

---

### 6. ✅ Save Confirmation Feedback (30 minutes)
**What**:
- Show checkmark after each swipe
- "All saved!" message when exiting
- Better user confidence

**Files**:
- `src/screens/MomentCards.tsx`

---

## Priority 3: Future (Optional)

### 7. ⏳ Offline Support (2-3 hours)
**What**: Cache swipes locally, sync when online
**Why**: Prevent data loss on poor connection
**Complexity**: Medium

### 8. ⏳ School Day Configuration (2 hours)
**What**: Add holidays, custom school schedules
**Why**: More flexible for different schools
**Complexity**: Medium

### 9. ⏳ AI-Generated Cards (1-2 days)
**What**: Generate personalized cards using Claude API
**Why**: Ultimate personalization
**Complexity**: High, cost implications

---

## Questions I Need You to Answer

### Question 1: School Days Restriction
**Should check-ins only be available Monday-Friday?**

- Option A: Yes, restrict to Mon-Fri only (school days)
- Option B: Available every day, parents decide when kids use it
- Option C: Mon-Fri default, with toggle in parent settings

**My recommendation**: Option B (every day), add toggle later

---

### Question 2: Card Content Strategy
**How should we create 30-50 cards per category?**

- Option A: I use AI to generate 150-250 varied cards, you review and approve (2 hours total)
- Option B: You write all cards yourself (8-10 hours)
- Option C: Start with current 6-8 cards, add more later

**My recommendation**: Option A (I generate, you review)

---

### Question 3: "Send to Parent" Flow
**When should "Send to Parent" button appear?**

- Option A: After completing ALL categories (on CompletionScreen) - recommended
- Option B: After each category (more frequent reminders)
- Option C: On CategoryHub when progress is 100%

**My recommendation**: Option A (CompletionScreen only)

---

### Question 4: Weekend Check-ins
**Should the app work on weekends?**

- Option A: Yes, available 7 days a week
- Option B: No, Monday-Friday only
- Option C: Available weekends with different categories (family time, hobbies)

**My recommendation**: Option A (7 days), Option C as Phase 2

---

### Question 5: Locked Check-in Behavior
**If today's check-in is locked, what happens when kid tries to start?**

- Option A: Show "Already completed today! Come back tomorrow 🎉" (block completely)
- Option B: Show read-only view of their responses
- Option C: Allow viewing but not editing

**My recommendation**: Option A (friendly block message)

---

## Implementation Order (My Recommendation)

### Today (6-8 hours)
1. Transport conversation starters (10 min) ✅
2. Timezone daily reset (3-4 hours) ✅
3. "Send to Parent" lock (2 hours) ✅
4. Change category confirmation (30 min) ✅

**Result**: Fully functional daily check-in system with proper locking

---

### Next Session (3 hours)
5. I generate 150-250 cards (1 hour)
6. You review and approve cards (1 hour)
7. Implement card rotation (1 hour)

**Result**: Fresh content every day

---

### Optional Polish (Later)
8. Save confirmation feedback (30 min)
9. Offline support (2-3 hours)
10. Advanced features (AI cards, templates, etc.)

---

## What I Need From You

Please confirm:

1. **Approve Priority 1 tasks?** (Yes/No or changes)
2. **Answer the 5 questions above** (School days, cards, send to parent, weekends, locked behavior)
3. **Any additional requirements or changes?**

Once you confirm, I'll:
1. Create detailed technical specs
2. Start implementing in the order you approve
3. Test each feature as we go

---

## Quick Decision Helper

**If you want to launch ASAP**:
- Approve Priority 1 only (6-8 hours)
- School days: Every day (Option B)
- Cards: I generate, you review (Option A)
- Send to parent: CompletionScreen only (Option A)
- Weekends: Available (Option A)
- Locked: Friendly block (Option A)

**If you want more polish**:
- Approve Priority 1 + 2 (9-11 hours)
- Add offline support
- Custom school day config

**If you want ultimate experience**:
- All priorities (12-15 hours)
- AI-generated cards
- Advanced features

---

**What's your decision?** 🚀

Reply with:
- "Approve all Priority 1" + answers to 5 questions
- Or specific tasks you want to prioritize differently
