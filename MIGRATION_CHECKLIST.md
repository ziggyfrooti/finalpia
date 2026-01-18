# Step 4: Migration Checklist

Use this checklist to track progress while migrating all screens from the web app.

## 🎯 Goal
Replicate all functionality from `pia` web app in the React Native mobile app.

---

## Phase 1: Shared Components (Priority: HIGH)

- [x] FloatingCard.tsx
- [x] Mascot.tsx  
- [x] PiaButton.tsx
- [ ] CategoryTile.tsx
- [ ] LoadingScreen.tsx
- [ ] ProgressRing.tsx

**Why first?** These are used across multiple screens, so completing them first makes screen migration easier.

---

## Phase 2: Core Authentication Flow (Priority: HIGH)

- [x] LoginScreen.tsx
- [x] EmailLoginScreen.tsx
- [x] Auth state management
- [ ] ParentGate.tsx - Parent verification screen
- [ ] ModeSelector.tsx - Choose Kid or Parent mode

**Why next?** Users need to get past authentication before seeing other features.

---

## Phase 3: Parent Screens (Priority: MEDIUM)

- [ ] ParentSpaceHome.tsx - Main parent dashboard
- [ ] ParentSetupScreen.tsx - Initial parent setup
- [ ] AddChildScreen.tsx - Add child profile
- [ ] TodaysStory.tsx - View kid's daily entries
- [ ] YourDay.tsx - Parent daily reflection
- [ ] YourBalance.tsx - Parent wellbeing tracking
- [ ] RemindersScreen.tsx - Set reminders
- [ ] ReflectionGoalsScreen.tsx - Parent goals

**Migration tips:**
1. Start with ParentSpaceHome (navigation hub)
2. Then ParentSetupScreen (first-time flow)
3. Then AddChildScreen (needed for setup)
4. Rest can be done in any order

---

## Phase 4: Kid Screens (Priority: MEDIUM)

- [ ] MyDayWelcome.tsx - Kid welcome/intro screen
- [ ] CategoryHub.tsx - Category selection
- [ ] PartsOfMyDay.tsx - Day structure view
- [ ] MomentCards.tsx - Daily moment cards
- [ ] CompletionScreen.tsx - Task completion

**Migration tips:**
1. Start with MyDayWelcome (entry point)
2. Then CategoryHub (main navigation)
3. Then PartsOfMyDay and MomentCards (core features)
4. CompletionScreen last (final step)

---

## Phase 5: Database Integration (Priority: HIGH)

- [ ] User profiles in Firestore
- [ ] Child profiles schema
- [ ] Daily entries/activities
- [ ] Parent reflections
- [ ] Categories and templates
- [ ] Real-time data sync
- [ ] Offline support

**Create these files:**
- [ ] `src/lib/db.ts` - Database helpers
- [ ] `src/lib/types.ts` - TypeScript types
- [ ] `src/lib/hooks/useUserProfile.ts`
- [ ] `src/lib/hooks/useChildren.ts`
- [ ] `src/lib/hooks/useDailyEntry.ts`

---

## Phase 6: Navigation & State (Priority: HIGH)

- [ ] Parent navigation stack
- [ ] Kid navigation stack
- [ ] Tab navigation (if needed)
- [ ] Deep linking support
- [ ] State management (Context or Redux)

**Create these files:**
- [ ] `src/navigation/ParentNavigator.tsx`
- [ ] `src/navigation/KidNavigator.tsx`
- [ ] `src/context/AppContext.tsx`

---

## Phase 7: Polish & Features (Priority: LOW)

- [ ] Animations (replace framer-motion)
- [ ] SVG icons (replace lucide-react)
- [ ] Better mascot graphics
- [ ] Sound effects (optional)
- [ ] Haptic feedback
- [ ] Push notifications
- [ ] Offline mode
- [ ] App icons and splash screens
- [ ] Error boundaries
- [ ] Analytics

---

## Testing Checklist

After each phase, test:

- [ ] **Web:** Works in browser (`npm run web`)
- [ ] **iOS:** Works in simulator (if on macOS)
- [ ] **Android:** Works in emulator
- [ ] **Firebase:** Data saves correctly
- [ ] **Navigation:** Can navigate between screens
- [ ] **Auth:** Login/logout works
- [ ] **Forms:** Input validation works
- [ ] **State:** Data persists correctly

---

## Migration Strategy: Step-by-Step

### For Each Screen:

1. **Copy the file** from web project
   ```bash
   cp ../pia/src/screens/ScreenName.tsx src/screens/
   ```

2. **Convert HTML to React Native**
   - `<div>` → `<View>`
   - `<span>`, `<p>` → `<Text>`
   - `<button>` → `<TouchableOpacity>`
   - `<img>` → `<Image>`

3. **Convert CSS to StyleSheet**
   ```typescript
   // Before (web)
   className="text-xl font-bold"
   
   // After (mobile)
   style={styles.title}
   
   // Add to StyleSheet
   const styles = StyleSheet.create({
     title: {
       fontSize: 20,
       fontWeight: 'bold',
     }
   });
   ```

4. **Replace web-specific imports**
   ```typescript
   // Before
   import { useRouter } from 'next/navigation'
   import { motion } from 'framer-motion'
   
   // After
   import { useNavigation } from '@react-navigation/native'
   import { Animated } from 'react-native'
   ```

5. **Test the screen**
   ```bash
   npm run web
   ```

6. **Commit changes**
   ```bash
   git add .
   git commit -m "Add ScreenName"
   ```

---

## Quick Reference: Common Conversions

### Styling
| Web CSS | React Native |
|---------|-------------|
| `padding: 16px` | `padding: 16` |
| `margin-top: 8px` | `marginTop: 8` |
| `background-color: #fff` | `backgroundColor: '#fff'` |
| `font-size: 16px` | `fontSize: 16` |
| `display: flex` | (default, remove) |
| `flex-direction: row` | `flexDirection: 'row'` |

### Components
| Web HTML | React Native |
|----------|-------------|
| `<div>` | `<View>` |
| `<span>`, `<p>` | `<Text>` |
| `<button>` | `<TouchableOpacity>` |
| `<input>` | `<TextInput>` |
| `<img>` | `<Image>` |
| `<a>` | `<TouchableOpacity>` |

### Events
| Web | React Native |
|-----|-------------|
| `onClick` | `onPress` |
| `onChange` | `onChangeText` (TextInput) |
| `onSubmit` | `onPress` (on button) |

### Navigation
| Next.js | React Navigation |
|---------|-----------------|
| `router.push('/page')` | `navigation.navigate('Page')` |
| `router.back()` | `navigation.goBack()` |
| `router.replace('/page')` | `navigation.replace('Page')` |

---

## Estimated Time

| Phase | Estimated Time |
|-------|---------------|
| Phase 1: Components | 2-3 hours |
| Phase 2: Auth Flow | 1-2 hours |
| Phase 3: Parent Screens | 4-6 hours |
| Phase 4: Kid Screens | 4-6 hours |
| Phase 5: Database | 3-4 hours |
| Phase 6: Navigation | 2-3 hours |
| Phase 7: Polish | 4-6 hours |
| **Total** | **20-30 hours** |

*These are estimates for someone familiar with React. Add 50% if new to React Native.*

---

## Progress Tracking

**Overall Progress: 20% Complete** (Steps 1-3 done)

| Phase | Status | Progress |
|-------|--------|----------|
| Phase 1 | 🔄 In Progress | 50% (3/6) |
| Phase 2 | 🔄 In Progress | 60% (3/5) |
| Phase 3 | ⏳ Not Started | 0% (0/8) |
| Phase 4 | ⏳ Not Started | 0% (0/5) |
| Phase 5 | ⏳ Not Started | 0% (0/6) |
| Phase 6 | ⏳ Not Started | 0% (0/4) |
| Phase 7 | ⏳ Not Started | 0% (0/9) |

Update this as you complete items!

---

## 🎉 When You're Done

You'll have:
- ✅ Full-featured mobile app
- ✅ Identical functionality to web app
- ✅ Works on iOS, Android, and Web
- ✅ Shared Firebase backend
- ✅ Ready to publish to app stores

**Next steps after Step 4:**
1. Add app icons and branding
2. Test on real devices
3. Add analytics
4. Submit to App Store / Play Store
5. Celebrate! 🎊
