# Complete Code Map

## Project Structure Overview

```
pia-mobile-app/
├── assets/               # Static assets (sounds, images)
├── src/                  # Source code
│   ├── components/       # Reusable UI components
│   ├── data/             # Static data (categories, card pools)
│   ├── lib/              # Core utilities (Firebase, auth, database)
│   ├── screens/          # Screen components
│   └── utils/            # Utility functions (sound manager)
├── knowledge/            # Project documentation (this folder)
├── App.tsx               # Root application component
├── app.json              # Expo configuration
├── package.json          # Node dependencies
├── tsconfig.json         # TypeScript configuration
└── .env                  # Environment variables (Firebase config)
```

---

## Root Files

### `App.tsx`
**Lines**: ~750
**Purpose**: Main application entry point with all navigation and state management
**Key Responsibilities**:
- Define `RootStackParamList` for type-safe navigation
- Manage app-wide state (user, kids, selectedKid, currentCheckinId, selectedCategories, categoryProgress, checkInSent, parentTimezone)
- Firebase authentication listener
- useEffect hooks for loading kids and existing check-ins
- Stack Navigator with all screen routes
- Navigation callbacks passed to each screen

**State Variables**:
```typescript
user: User | null                          // Firebase authenticated user
kids: Kid[]                                // List of children for logged-in parent
selectedKid: Kid | null                    // Currently selected child
kidsLoading: boolean                       // Loading state for kids list
currentCheckinId: string | null            // ID of active check-in
selectedCategories: string[]               // Categories selected for current check-in
categoryProgress: Record<string, number>   // Progress (0-100) for each category
checkInSent: boolean                       // Whether current check-in has been sent
parentTimezone: string                     // Parent's timezone (IANA format)
needsParentSetup: boolean                  // Whether parent needs to complete setup
```

**Navigation Screens Defined** (lines 200-750):
- Login, EmailLogin, Splash, ModeSelector, ParentGate
- ParentHome, ParentSetup, AddChild
- MyDayWelcome, PartsOfMyDay, CategoryHub, MomentCards, CompletionScreen
- ParentSpaceHome, TodaysStory, YourBalance, YourDay

**Critical Functions**:
- Authentication listener (useEffect on mount)
- Load kids and parent profile (useEffect when user changes)
- Load existing check-in (useEffect when selectedKid changes)
- Save progress to Firestore (useEffect when categoryProgress changes)

---

## `src/components/` - Reusable UI Components

### `PiaButton.tsx`
**Lines**: ~80
**Purpose**: Primary action button with consistent styling
**Props**:
- `onPress: () => void` - Click handler
- `children: React.ReactNode` - Button label
- `style?: ViewStyle` - Optional custom styles
- `disabled?: boolean` - Disable button

**Styling**:
- Background: `#7DD3C0` (teal)
- Text: White, bold, 16px
- Rounded corners, shadow effect
- Disabled state: Gray background

**Usage**: All primary actions (Continue, Send to Parent, Done for Today, etc.)

---

### `FloatingCard.tsx`
**Lines**: ~60
**Purpose**: Card container with shadow and rounded corners for content grouping
**Props**:
- `children: React.ReactNode` - Card content
- `style?: ViewStyle` - Optional custom styles

**Styling**:
- Background: White
- Border radius: 16px
- Shadow: iOS/Android compatible elevation
- Padding: 16px

**Usage**: Category tiles, progress cards, content containers throughout app

---

### `CategoryTile.tsx`
**Lines**: ~100
**Purpose**: Selectable tile for category selection (used in PartsOfMyDay)
**Props**:
- `icon: React.ReactNode` - Category emoji or icon
- `label: string` - Category name
- `selected: boolean` - Whether category is selected
- `onClick: () => void` - Selection handler

**Styling**:
- Unselected: Light gray border, subtle background
- Selected: Teal border (#7DD3C0), highlighted background
- Icon: Large emoji display
- Label: Below icon, centered

**Usage**: PartsOfMyDay screen for category selection

---

### `ProgressRing.tsx`
**Lines**: ~120
**Purpose**: Circular progress indicator with percentage
**Props**:
- `progress: number` - Progress value (0-100)
- `size: number` - Diameter of ring in pixels
- `color: string` - Color of progress ring

**Implementation**:
- Uses SVG for cross-platform consistency
- Animated progress using react-native Animated API
- Displays percentage text in center

**Usage**: CategoryHub to show completion progress for each category

---

### `ScreenWrapper.tsx`
**Lines**: ~50
**Purpose**: Consistent screen container with safe area handling
**Props**:
- `children: React.ReactNode` - Screen content

**Features**:
- SafeAreaView for iOS notch handling
- Consistent background color (#FBF9F4 - warm off-white)
- Full-screen flex layout

**Usage**: Wrap every screen component for consistent layout

---

### `LoadingScreen.tsx`
**Lines**: ~70
**Purpose**: Full-screen loading indicator with optional message
**Props**:
- `message?: string` - Optional loading message

**Styling**:
- Centered ActivityIndicator
- Optional message below spinner
- Same background as ScreenWrapper

**Usage**: Splash screen, data loading states

---

### `Mascot.tsx`
**Lines**: ~80
**Purpose**: Animated mascot character for engagement (not yet implemented in UI)
**Props**:
- `emotion?: 'happy' | 'excited' | 'thinking'` - Mascot emotion state
- `size?: number` - Size in pixels

**Status**: Component exists but not used in current screens (planned for Phase 2)

---

## `src/data/` - Static Data Definitions

### `categories.ts`
**Lines**: 122
**Purpose**: Define weekday and weekend category configurations
**Exports**:
- `Category` interface
- `WEEKDAY_CATEGORIES`: Array of 5 school-focused categories
- `WEEKEND_CATEGORIES`: Array of 6 family/leisure categories
- `getCategories(isWeekend: boolean)`: Returns appropriate category set
- `getCategoryById(id: string)`: Find category by ID
- `getCategoryEmoji(id: string)`: Get emoji for category
- `getCategoryLabel(id: string)`: Get label for category

**Weekday Categories**:
1. Lunch 🍽️
2. Recess 👥
3. Classroom 📚
4. Specials 🎨
5. Going Home 🏠

**Weekend Categories**:
1. Family Time 👨‍👩‍👧
2. Activities & Hobbies 🎮
3. Outdoor Time 🏃
4. Friends & Playdates 👫
5. Sports & Classes ⚽
6. Quiet Time 🛏️

---

### `cardPools.ts`
**Lines**: ~400
**Purpose**: Define swipeable card content for each category
**Exports**:
- `CardPool` type
- `CARD_POOLS`: Object mapping category IDs to arrays of card objects
- `getRandomCards(category: string, count: number)`: Returns random subset of cards for a category

**Card Structure**:
```typescript
{
  id: string;       // Unique identifier
  text: string;     // Card statement (e.g., "I had fun at recess")
  category: string; // Category ID
}
```

**Card Pools per Category**:
- Each category has 15-20 cards
- Cards designed to capture both positive and challenging moments
- Statements phrased from child's perspective ("I...", "Someone...")

**Example Cards (Lunch category)**:
- "I sat with my friends at lunch"
- "The food tasted good today"
- "I tried something new at lunch"
- "Someone made me laugh at lunchtime"

**Random Selection Logic**:
- Shuffles pool using Fisher-Yates algorithm
- Returns requested count (typically 8 cards per session)
- Ensures variety across check-ins

---

## `src/lib/` - Core Utilities and Database Layer

### `firebase.ts`
**Lines**: ~40
**Purpose**: Initialize Firebase app and services
**Exports**:
- `app`: Initialized Firebase app instance
- `auth`: Firebase Authentication service
- `db`: Firestore database service

**Configuration**:
- Reads environment variables from `expo-constants`
- Initializes Firebase with credentials
- Exports services for use throughout app

**Environment Variables Required**:
```
EXPO_PUBLIC_FIREBASE_API_KEY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
EXPO_PUBLIC_FIREBASE_PROJECT_ID
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
EXPO_PUBLIC_FIREBASE_APP_ID
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
```

---

### `auth.ts`
**Lines**: ~80
**Purpose**: Firebase Authentication helpers
**Exports**:
- `login(email, password)`: Email/password sign in
- `signup(email, password)`: Create new account
- `logout()`: Sign out current user
- `onAuthChange(callback)`: Subscribe to auth state changes
- `getCurrentUser()`: Get current user object

**Error Handling**:
- Wraps Firebase auth errors with user-friendly messages
- Returns structured error objects

**Usage**:
- Called from LoginScreen, EmailLoginScreen
- Auth listener set up in App.tsx useEffect

---

### `db.ts`
**Lines**: 478
**Purpose**: Firestore database operations (CRUD for all collections)
**Exports**: 30+ functions for database operations

#### Helper Functions
- `todayISO()`: Returns today's date in YYYY-MM-DD format (local time)
- `safeId(string)`: Converts string to safe Firestore document ID

#### Parent Profile Operations
```typescript
getParentProfile(uid: string): Promise<ParentProfile | null>
upsertParentProfile(uid: string, data: any): Promise<void>
```

#### Kid Operations
```typescript
listKids(uid: string): Promise<Kid[]>
addKid(uid: string, kid: Partial<Kid>): Promise<string>  // Returns kidId
getKid(uid: string, kidId: string): Promise<Kid | null>
```

#### Check-In Operations
```typescript
createTodayCheckin(params: {
  uid: string;
  kidId: string;
  selectedCategories: string[];
  timezone?: string;
}): Promise<string>  // Returns checkinId (creates or updates)

getCheckin(params: { uid, kidId, checkinId }): Promise<Checkin | null>
getTodayOrLatestCheckin(params: { uid, kidId, timezone? }): Promise<Checkin | null>
getCheckinByDate(params: { uid, kidId, date }): Promise<Checkin | null>
lockCheckin(params: { uid, kidId, checkinId }): Promise<void>
updateCategoryProgress(params: { uid, kidId, checkinId, categoryProgress }): Promise<void>
updateSelectedCategories(params: { uid, kidId, checkinId, selectedCategories }): Promise<void>
canStartNewCheckin(params: { uid, kidId, timezone? }): Promise<{
  allowed: boolean;
  reason?: string;
  existingCheckin?: Checkin;
}>
```

#### Swipe Operations
```typescript
saveSwipe(params: {
  uid, kidId, checkinId, category, cardIndex, cardText, choice
}): Promise<void>
listSwipes(params: { uid, kidId, checkinId }): Promise<Swipe[]>
```

#### Parent Swipe Operations (for YourDay feature)
```typescript
saveParentSwipe(params: {
  uid, category, cardIndex, cardText, choice, date?
}): Promise<void>
listParentSwipes(params: { uid, startDate?, endDate? }): Promise<any[]>
```

**Types Defined**:
```typescript
Kid: { id, name, avatar, grade, createdAt }
Checkin: { id, date, dayOfWeek, isWeekend, selectedCategories,
           categoryProgress, isLocked, sentToParentAt, completedAt,
           createdAt, updatedAt }
Swipe: { id, category, cardIndex, cardText, choice, createdAt, updatedAt }
```

**Key Logic**:
- `createTodayCheckin`: Checks for existing check-in by date, creates or updates
- `lockCheckin`: Sets `isLocked: true`, marks `sentToParentAt` timestamp
- `saveSwipe`: Uses deterministic ID (category + cardIndex) for idempotency
- `listSwipes`: Deduplicates swipes by category + cardIndex, keeps most recent

---

### `dateUtils.ts`
**Lines**: 110
**Purpose**: Timezone-aware date utilities for daily reset logic
**Exports**:
- `getTodayDateString(timezone)`: Returns YYYY-MM-DD for given timezone
- `getDayOfWeek(timezone)`: Returns day name (e.g., "Monday")
- `isWeekend(timezone)`: Returns true if Saturday/Sunday
- `isSameDay(date1, date2)`: Compare two YYYY-MM-DD strings
- `getFriendlyDate(dateString, timezone)`: Returns "Monday, January 27"
- `getTimeOfDay(timezone)`: Returns 'morning', 'afternoon', or 'evening'
- `DEFAULT_TIMEZONE`: Constant for fallback timezone (America/New_York)

**Implementation**:
- Uses `Intl.DateTimeFormat` with timezone option for accurate conversions
- No external date libraries (native JavaScript Date API)
- Returns consistent YYYY-MM-DD format for database storage

**Critical for**:
- Daily check-in reset at midnight (parent's timezone, not UTC)
- Weekend vs. weekday category detection
- Consistent date comparison across devices

**Note**: Line 48-49 has temporary override:
```typescript
return true; // TEMPORARY: Force weekend mode for testing
```
Should be uncommented for production:
```typescript
const dayOfWeek = getDayOfWeek(timezone);
return dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday';
```

---

### `useAuth.ts`
**Lines**: ~60
**Purpose**: React hook for accessing auth state in components
**Exports**:
- `useAuth()`: Returns { user, loading } from Firebase auth

**Implementation**:
- useState and useEffect to subscribe to auth changes
- Returns null while loading
- Used by screens that need current user

**Usage**: Screens that need user state without prop drilling

---

## `src/screens/` - Screen Components

### `LoginScreen.tsx`
**Lines**: ~150
**Purpose**: Initial login screen with email/password and social auth options (future)
**Props**:
- `onLogin: () => void` - Callback when login succeeds

**Features**:
- Email/password input fields
- "Sign In" button
- "Create Account" link (navigates to signup)
- Logo/branding display
- Error message display

**Navigation**:
- On success → calls onLogin() → App.tsx navigates to Splash

---

### `EmailLoginScreen.tsx`
**Lines**: ~180
**Purpose**: Email/password login and signup form
**Props**:
- `onLogin: () => void` - Success callback
- `mode?: 'login' | 'signup'` - Form mode

**Features**:
- Email and password text inputs
- Toggle between login and signup modes
- Form validation (email format, password length)
- Error handling with user-friendly messages
- Loading state during auth request

**Validation**:
- Email: Basic format check
- Password: Minimum 6 characters for Firebase

**Navigation**:
- On success → calls onLogin() → navigates to Splash

---

### `SplashScreen.tsx`
**Lines**: ~80
**Purpose**: Loading screen shown while checking auth and loading data
**Props**:
- `onComplete: () => void` - Callback when loading done

**Flow**:
1. Shows logo and loading indicator
2. App.tsx loads user, kids, parent profile
3. Calls onComplete() after 1-2 seconds

**Navigation**:
- On complete → navigates to ModeSelector (or ParentSetup if needed)

---

### `ModeSelector.tsx`
**Lines**: 355
**Purpose**: Home screen where user chooses between Kid Mode and Parent Space
**Props**:
- `onSelectKidSpace: () => void` - Navigate to kid check-in flow
- `onSelectParentSpace: () => void` - Navigate to parent space
- `selectedChild: Child | null` - Currently selected child
- `childrenList: Child[]` - All children for parent
- `onSelectChild: (child: Child) => void` - Change selected child
- `onAddChild?: () => void` - Navigate to add child screen
- `userEmail?: string | null` - For display
- `onLogout?: () => void` - Sign out
- `lastActivityDate?: string | null` - Show "Last activity: Today" badge
- `hasNewUpdates?: boolean` - Show "New updates" badge on Parent Space

**Layout**:
- Header with user email and settings/logout button
- Child selector (if multiple children) with avatars
- "Add Child" button
- Two large cards:
  1. **My Day** (Kid Mode) - ✨ emoji
  2. **Parent Space** - 🧭 emoji

**Features**:
- Child selector dropdown/modal
- Activity indicators on mode cards
- Logout button in header

**Navigation**:
- Kid Mode → MyDayWelcome
- Parent Space → ParentGate (if first time) or ParentSpaceHome

---

### `ParentGate.tsx`
**Lines**: ~100
**Purpose**: Simple verification screen before parent-only areas (ensures kids don't access)
**Props**:
- `onContinue: () => void` - Navigate to parent area

**Features**:
- Simple math question (e.g., "What is 5 + 3?")
- Text input for answer
- "Continue" button disabled until correct answer
- Kid-friendly error messages ("Oops, try again!")

**Navigation**:
- On correct answer → navigates to next parent screen (ParentSetup or ParentSpaceHome)

---

### `ParentHomeScreen.tsx`
**Lines**: ~120
**Purpose**: [Not currently used - legacy component]
**Status**: Can be archived (replaced by ModeSelector)

---

### `ParentSetupScreen.tsx`
**Lines**: ~200
**Purpose**: First-time parent profile setup
**Props**:
- `onComplete: (profileData) => void` - Callback with profile data

**Form Fields**:
1. Name (text input)
2. Role (dropdown: Mom, Dad, Guardian, Other)
3. Location (text input: City, State)
4. Timezone (dropdown: All US timezones)
5. Notifications (toggle: Remind child to check in)

**Validation**:
- All fields required except notifications
- Timezone defaults to America/New_York

**Data Flow**:
- On submit → calls onComplete(data)
- App.tsx → upsertParentProfile() to Firestore
- App.tsx → setNeedsParentSetup(false)
- Navigate to AddChild screen

---

### `AddChildScreen.tsx`
**Lines**: ~180
**Purpose**: Add a child profile to parent account
**Props**:
- `onComplete: (childData) => void` - Callback with child data
- `onSkip?: () => void` - Optional skip button (for parent with existing kids)

**Form Fields**:
1. Name (text input)
2. Avatar (emoji picker or pre-set options)
3. Grade (dropdown: Pre-K through 5th grade)

**Validation**:
- Name required
- Avatar and grade optional

**Data Flow**:
- On submit → calls onComplete(data)
- App.tsx → addKid() to Firestore
- App.tsx → updates kids state
- Navigate to ModeSelector

---

### `MyDayWelcome.tsx`
**Lines**: ~120
**Purpose**: Welcome screen for kid check-in flow
**Props**:
- `childName: string` - Selected child's name
- `onContinue: () => void` - Navigate to category selection

**Features**:
- Greeting message with child's name
- Mascot character (optional)
- "Let's Talk About My Day" button
- Time-of-day appropriate greeting (Good morning/afternoon/evening)

**Navigation**:
- On continue → navigates to PartsOfMyDay

---

### `PartsOfMyDay.tsx`
**Lines**: 182
**Purpose**: Category selection screen - kid chooses what to talk about
**Props**:
- `onContinue: (selectedCategories: string[]) => void` - Pass selected categories
- `onBack?: () => void` - Optional back button
- `timezone?: string` - For weekend detection
- `isWeekend?: boolean` - Can override weekend detection
- `initialSelections?: string[]` - Pre-selected categories (when resuming)

**Features**:
- Displays appropriate categories (weekday vs. weekend) based on timezone
- Pre-selects default categories:
  - Weekday: Lunch, Recess, Classroom
  - Weekend: Family Time, Activities, Outdoor
- CategoryTile components in grid layout
- Selected counter shows "X parts selected"
- Continue button (enabled when at least 1 category selected)

**Default Selections** (can be toggled off):
- Designed to reduce decision fatigue
- Most common categories pre-selected

**Data Flow**:
- On continue → calls onContinue(selectedCategories)
- App.tsx → createTodayCheckin() → setCurrentCheckinId, setSelectedCategories
- Navigate to CategoryHub

---

### `CategoryHub.tsx`
**Lines**: ~200
**Purpose**: Progress tracking hub showing all selected categories
**Props**:
- `categories: string[]` - Selected category IDs
- `progress: Record<string, number>` - Progress (0-100) for each category
- `onSelectCategory: (category: string) => void` - Navigate to MomentCards for category
- `onComplete: () => void` - Navigate to CompletionScreen

**Layout**:
- Header: "My Day Progress"
- Reminder banner (when all complete): "Ready to send to parent!"
- Category list with ProgressRing for each category
  - Shows emoji, label, progress percentage
  - Tap to continue if incomplete
  - Checkmark if complete
- Bottom actions:
  - "Done for Today" (primary button)
  - "Continue where I left off" (secondary button)

**Behavior**:
- "Continue where I left off" finds first incomplete category
- Categories become unclickable once 100% complete
- Reminder banner appears when all categories reach 100%

**Navigation**:
- On select category → navigate to MomentCards with category param
- On complete → navigate to CompletionScreen

---

### `MomentCards.tsx`
**Lines**: ~300
**Purpose**: Swipeable card interface for category reflection
**Props**:
- `category: string` - Current category ID
- `onComplete: () => void` - Callback when all 8 cards swiped
- `onDone: () => void` - "Done for Today" button pressed (mid-category)
- `onChangeCategory?: () => void` - "Change Category" button pressed
- `onProgressUpdate: (progress: number) => void` - Update progress (0-100)
- `onSwipe: (payload) => void` - Save swipe to Firestore

**Card Mechanics**:
- 8 random cards per category (useMemo ensures same cards for session)
- Swipe right (👍) = "Yes" / "This happened"
- Swipe left (👎) = "No" / "Didn't happen"
- Progress bar at top (X/8 cards)
- Sound effects on swipe (expo-av)

**Swipe Detection**:
- PanResponder for gesture handling
- Threshold: 100px horizontal movement
- Animated card exit
- Immediate Firestore save on swipe

**Pause/Change Options**:
- "Pause" button (top right) opens modal:
  - "Change Category" → navigate to PartsOfMyDay
  - "Done for Today" → navigate to CategoryHub
  - "Go Back One" → undo last swipe (local only, doesn't delete from Firestore)
  - "Resume" → close modal

**Progress Updates**:
- After each swipe: calculate (currentIndex / 8) * 100
- Call onProgressUpdate() → App.tsx → updateCategoryProgress() to Firestore
- On complete (8/8 cards): play categoryComplete sound, call onComplete()

**Navigation**:
- On complete → navigate back to CategoryHub
- On "Done for Today" → navigate to CategoryHub
- On "Change Category" → navigate to PartsOfMyDay

---

### `CompletionScreen.tsx`
**Lines**: 124
**Purpose**: Final screen after completing all categories, option to send to parent
**Props**:
- `isSent: boolean` - Whether check-in already sent today
- `onContinue: () => void` - Navigate back to mode selector (if already sent)
- `onSendToParent?: () => void` - Send check-in to parent (if not sent)

**Display Modes**:
1. **Not Sent Yet**:
   - Message: "Great job! Your reflections have been saved"
   - "Send to Parent ✉️" button (primary action)
   - "I'll send it later" button (secondary action)

2. **Already Sent**:
   - Message: "You already sent today's reflections to your parent!"
   - Subtitle: "Come back tomorrow to share more about your day."
   - "Back to Home" button

**Features**:
- Confetti animation on load (react-native-confetti-cannon)
- Sound effect on load (if not already sent)
- Prevents sending twice per day

**Send to Parent Flow**:
- Check if all categories 100% complete
- If incomplete, show Alert confirmation:
  - "You've only completed X out of Y categories. Send anyway?"
  - "Cancel" / "Send Anyway"
- If complete, send directly
- Call lockCheckin() to Firestore
- Show success Alert: "Sent to Parent! 🎉"
- Clear state, navigate to ModeSelector

**Navigation**:
- On continue (if sent) → navigate to ModeSelector
- On send success → navigate to ModeSelector
- On "I'll send it later" → navigate to ModeSelector

---

### `ParentSpaceHome.tsx`
**Lines**: ~180
**Purpose**: Parent space landing screen with three options
**Props**:
- `onNavigate: (screen: 'todays-story' | 'your-balance' | 'your-day') => void` - Navigate to parent features
- `selectedChild: Child | null` - Currently selected child
- `hasNewCheckin?: boolean` - Badge on "Today's Story"

**Layout**:
- Header: "Parent Space" with emoji
- Three cards:
  1. **Today's Story** 📖 - View child's check-in
     - Badge: "New" if child sent today
  2. **Your Balance** ⚖️ - Parent self-reflection
  3. **Your Day** 📅 - Parent check-in cards

**Validation**:
- "Today's Story" disabled if no child selected
- Shows Alert: "No Child Selected" if clicked without child

**Navigation**:
- Today's Story → navigate to TodaysStory
- Your Balance → navigate to YourBalance
- Your Day → navigate to YourDay

---

### `TodaysStory.tsx`
**Lines**: ~250
**Purpose**: Parent view of child's check-in with visualizations
**Props**:
- `childName: string` - Selected child's name
- `checkinDate: string` - Date of check-in (YYYY-MM-DD)
- `checkinData: Checkin` - Full check-in object with swipes

**Display**:
- Date header: "Monday, January 27"
- Child name: "{Name}'s Day"
- Categories completed: List with progress rings
- Swipe summary for each category:
  - "Yes" cards displayed with emoji
  - "No" cards hidden (focus on positive)
  - Count: "5 moments in Lunch"

**Insights** (future Phase 2):
- Patterns across multiple days
- Emotional trends
- Conversation starters

**Navigation**:
- Back button → navigate to ParentSpaceHome

---

### `YourBalance.tsx`
**Lines**: ~150
**Purpose**: Parent self-reflection prompts (Phase 2 - not yet implemented)
**Props**:
- `onComplete: () => void` - Callback after reflection

**Planned Features**:
- Balance check-in questions for parent
- Emotional state tracking
- Reflection on parenting moments

**Status**: Placeholder component, Phase 2 feature

---

### `YourDay.tsx`
**Lines**: ~200
**Purpose**: Parent check-in cards (similar to kid swipes) (Phase 2 - not yet implemented)
**Props**:
- `onComplete: () => void` - Callback after completion

**Planned Features**:
- Parent-specific card pools (work stress, parenting moments, self-care)
- Same swipe mechanic as MomentCards
- Saved to `parentSwipes` collection in Firestore

**Status**: Placeholder component, Phase 2 feature

---

## `src/utils/` - Utility Functions

### `SoundManager.ts`
**Lines**: ~150
**Purpose**: Manage audio playback for sound effects
**Exports**:
- `SoundManager.preload()`: Load all sound files into memory
- `SoundManager.play(soundName)`: Play a specific sound
- `SoundManager.unload()`: Clean up audio resources

**Sound Effects**:
- `swipeYes`: Positive chime when swiping right
- `swipeNo`: Neutral tone when swiping left
- `categoryComplete`: Celebration sound when finishing category
- `checkInComplete`: Completion sound for full check-in

**Implementation**:
- Uses `expo-av` Audio API
- Sounds stored in `/assets/sounds/`
- Preloaded on app start for instant playback
- No overlap (new sound stops previous)

**Usage**:
- MomentCards: Play on swipe
- CompletionScreen: Play on load
- CategoryHub: Play when category complete

---

## `assets/` - Static Assets

### `assets/sounds/`
**Audio Files**:
- `swipe-yes.mp3` - Positive swipe sound
- `swipe-no.mp3` - Neutral swipe sound
- `category-complete.mp3` - Category completion sound
- `checkin-complete.mp3` - Full check-in completion sound

**Format**: MP3 (cross-platform compatibility)
**Size**: Small files (<100KB each) for fast loading

---

## Configuration Files

### `app.json`
**Purpose**: Expo configuration for build and deployment
**Key Settings**:
```json
{
  "expo": {
    "name": "PIA - Parent & Kid Connect",
    "slug": "pia-mobile-app",
    "version": "1.0.0",
    "platforms": ["ios", "android", "web"],
    "ios": {
      "bundleIdentifier": "com.pia.app"
    },
    "android": {
      "package": "com.pia.app"
    }
  }
}
```

---

### `package.json`
**Purpose**: Node.js dependencies and scripts
**Key Dependencies**:
- expo: ~54.0.31
- react: 18.3.1
- react-native: 0.81.5
- firebase: ^12.8.0
- @react-navigation/native: ^7.0.13
- typescript: ^5.9.7

**Scripts**:
- `start`: Start Expo dev server
- `android`: Run on Android
- `ios`: Run on iOS
- `web`: Run in web browser

---

### `tsconfig.json`
**Purpose**: TypeScript compiler configuration
**Key Settings**:
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true
  }
}
```
- Extends Expo's base TypeScript config
- Strict mode enabled (enforces type safety)

---

### `.env` (not committed to git)
**Purpose**: Environment variables for Firebase configuration
**Required Variables**:
```
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=...
```

**Security**: Add to `.gitignore`, never commit

---

## Documentation Files (Root Directory)

### `README.md`
**Lines**: 280
**Purpose**: Main project documentation
**Sections**:
- Setup instructions
- Firebase configuration
- Development workflow
- Deployment guide

---

### `SUMMARY.md`
**Lines**: 344
**Purpose**: Detailed project status and roadmap
**Sections**:
- Completed features checklist
- TODO screens list
- Migration notes from web to mobile

---

### `QA_VERIFICATION_REPORT.md`
**Lines**: ~500
**Purpose**: Comprehensive test case documentation
**Content**:
- 94 test cases with code-level verification
- Covers onboarding, check-ins, edge cases
- Validates Firestore schema and data flow

---

### Other Documentation (35+ files in root)
Many task-specific markdown files documenting:
- Bug fixes (BUG_FIXES_COMPLETE.md)
- Firebase setup (FIREBASE_SETUP.md)
- Phase completion (PHASE2_COMPLETE.md)
- Migration guides (WEB_VS_MOBILE.md)
- Testing guides (COMPLETE_TESTING_GUIDE.md)

**Recommendation**: These should be moved to `/archive` or consolidated into `/knowledge`.

---

## File Count Summary

| Directory | Files | Total Lines (est.) |
|-----------|-------|-------------------|
| src/components/ | 7 | ~650 |
| src/data/ | 2 | ~520 |
| src/lib/ | 5 | ~750 |
| src/screens/ | 17 | ~2,800 |
| src/utils/ | 1 | ~150 |
| **Root** | App.tsx | ~750 |
| **Config** | 3 files | ~200 |
| **Total Source Code** | 35 files | ~5,820 lines |

---

## Critical Path Files

**Must understand for any feature work**:
1. `App.tsx` - All state and navigation
2. `src/lib/db.ts` - All Firestore operations
3. `src/lib/dateUtils.ts` - Timezone logic
4. `src/data/categories.ts` - Category definitions
5. `src/data/cardPools.ts` - Card content

**Most frequently modified**:
1. `App.tsx` - Every navigation/state change
2. Screen files in `src/screens/` - UI updates
3. `src/lib/db.ts` - Database schema changes

**Can largely ignore**:
- Documentation markdown files (reference only)
- `assets/` (static files)
- Config files (rarely change after initial setup)
