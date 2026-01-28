# Architecture Overview

## Tech Stack

### Core Framework
- **React Native**: 0.81.5
- **Expo SDK**: 54.0.31
- **TypeScript**: 5.9.7 (strict mode enabled)
- **Node**: Compatible with Expo requirements

### Key Libraries
- **Navigation**: @react-navigation/native ^7.0.13, @react-navigation/native-stack ^7.1.8
- **Backend**: firebase ^12.8.0 (Authentication + Firestore)
- **Animation**: react-native-confetti-cannon ^1.5.2
- **Audio**: expo-av ~14.1.4
- **UI Components**: Custom components built on react-native primitives

### Development Tools
- **TypeScript**: Strict mode enforced
- **Expo**: Development server, builds, and deployment
- **Firebase Console**: Database management and authentication

## Application Architecture

### Architecture Pattern
**Centralized State Management in App.tsx**
- All navigation logic in a single App.tsx component
- React hooks (useState, useEffect) for state management
- Props drilling for passing data to child components
- No external state management library (Redux, MobX, etc.)

### Component Hierarchy
```
App.tsx (Root)
├── NavigationContainer
│   └── Stack.Navigator
│       ├── Login
│       ├── EmailLogin
│       ├── Splash
│       ├── ModeSelector
│       ├── ParentGate
│       ├── ParentSetup
│       ├── AddChild
│       ├── ParentHome
│       ├── MyDayWelcome
│       ├── PartsOfMyDay
│       ├── CategoryHub
│       ├── MomentCards
│       ├── CompletionScreen
│       ├── ParentSpaceHome
│       ├── TodaysStory
│       ├── YourBalance
│       └── YourDay
```

## Navigation Structure

### Navigator Type
**React Navigation 7 - Stack Navigator**
- Type-safe navigation with TypeScript
- Defined in `RootStackParamList` interface

### Navigation Flow Map
```
┌─────────────────────────────────────────────────────────────┐
│                         Login Flow                           │
└─────────────────────────────────────────────────────────────┘
Login → EmailLogin → (Auth) → Splash → ModeSelector

┌─────────────────────────────────────────────────────────────┐
│                      Onboarding Flow                         │
└─────────────────────────────────────────────────────────────┘
ModeSelector → ParentGate → ParentSetup → AddChild → ModeSelector

┌─────────────────────────────────────────────────────────────┐
│                     Kid Check-In Flow                        │
└─────────────────────────────────────────────────────────────┘
ModeSelector → MyDayWelcome → PartsOfMyDay → CategoryHub
                                                   ↓
                                              MomentCards
                                                   ↓
                                           CompletionScreen → ModeSelector

┌─────────────────────────────────────────────────────────────┐
│                      Parent Space Flow                       │
└─────────────────────────────────────────────────────────────┘
ModeSelector → ParentSpaceHome → TodaysStory / YourBalance / YourDay
```

### Screen Props Pattern
Each screen receives props through Stack.Screen's `children` render prop:
```typescript
<Stack.Screen name="ScreenName">
  {({ navigation, route }) => (
    <ScreenComponent
      prop1={stateValue}
      onAction={(payload) => {
        // Update state
        // Navigate to next screen
        navigation.navigate('NextScreen', { params });
      }}
    />
  )}
</Stack.Screen>
```

## State Management

### App-Level State (App.tsx)
```typescript
// Authentication & User
const [user, setUser] = useState<User | null>(null);

// Child Management
const [kids, setKids] = useState<Kid[]>([]);
const [selectedKid, setSelectedKid] = useState<Kid | null>(null);
const [kidsLoading, setKidsLoading] = useState(false);

// Check-In State
const [currentCheckinId, setCurrentCheckinId] = useState<string | null>(null);
const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
const [categoryProgress, setCategoryProgress] = useState<Record<string, number>>({});
const [checkInSent, setCheckInSent] = useState(false);

// Parent Settings
const [parentTimezone, setParentTimezone] = useState<string>('America/New_York');
const [needsParentSetup, setNeedsParentSetup] = useState(false);
```

### State Flow Patterns

**1. Check-In Initialization**
```
PartsOfMyDay → onContinue(selectedCategories)
  → createTodayCheckin() → setCurrentCheckinId, setSelectedCategories
  → navigate to CategoryHub
```

**2. Progress Tracking**
```
MomentCards → onProgressUpdate(progress)
  → setCategoryProgress({ ...prev, [category]: progress })
  → updateCategoryProgress() Firestore call
```

**3. Swipe Handling**
```
MomentCards → onSwipe({ category, cardIndex, cardText, choice })
  → saveSwipe() to Firestore
  → Update UI immediately
```

**4. Send to Parent**
```
CompletionScreen → onSendToParent()
  → lockCheckin() Firestore call
  → setCheckInSent(true)
  → Alert confirmation → Clear state → Navigate to ModeSelector
```

## Firebase Integration

### Firebase Configuration
**Location**: `src/lib/firebase.ts`
**Environment Variables**: Loaded from `.env` via `expo-constants`
```
EXPO_PUBLIC_FIREBASE_API_KEY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
EXPO_PUBLIC_FIREBASE_PROJECT_ID
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
EXPO_PUBLIC_FIREBASE_APP_ID
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
```

### Firestore Schema
```
/parents/{uid}
  - name: string
  - email: string
  - role: string (e.g., "Mom", "Dad")
  - location: string (city/state)
  - timezone: string (IANA timezone)
  - notifications: boolean
  - createdAt: timestamp
  - updatedAt: timestamp

  /kids/{kidId}
    - name: string
    - avatar: string (emoji or URL)
    - grade: string
    - createdAt: timestamp

    /checkins/{checkinId}
      - date: string (YYYY-MM-DD format)
      - dayOfWeek: string ("Monday", "Tuesday", etc.)
      - isWeekend: boolean
      - selectedCategories: string[]
      - categoryProgress: { [categoryId]: number } (0-100)
      - isLocked: boolean (true after "Send to Parent")
      - sentToParentAt: timestamp | null
      - completedAt: timestamp | null
      - createdAt: timestamp
      - updatedAt: timestamp

      /swipes/{swipeId}
        - category: string
        - cardIndex: number
        - cardText: string
        - choice: 'yes' | 'no' | 'unsure'
        - createdAt: timestamp
        - updatedAt: timestamp

  /parentSwipes/{swipeId}
    - date: string (YYYY-MM-DD)
    - category: string
    - cardIndex: number
    - cardText: string
    - choice: 'yes' | 'no'
    - createdAt: timestamp
    - updatedAt: timestamp
```

### Database Operations (src/lib/db.ts)

**Parent Operations**:
- `getParentProfile(uid)`: Fetch parent document
- `upsertParentProfile(uid, data)`: Create or update parent profile

**Kid Operations**:
- `listKids(uid)`: Get all children for a parent
- `addKid(uid, kid)`: Add a new child profile
- `getKid(uid, kidId)`: Get specific child

**Check-In Operations**:
- `createTodayCheckin({ uid, kidId, selectedCategories, timezone })`: Create or update today's check-in
- `getCheckin({ uid, kidId, checkinId })`: Get specific check-in
- `getTodayOrLatestCheckin({ uid, kidId, timezone })`: Get today's check-in or most recent
- `getCheckinByDate({ uid, kidId, date })`: Get check-in for specific date
- `lockCheckin({ uid, kidId, checkinId })`: Mark check-in as sent to parent
- `updateCategoryProgress({ uid, kidId, checkinId, categoryProgress })`: Update progress
- `canStartNewCheckin({ uid, kidId, timezone })`: Check if new check-in allowed

**Swipe Operations**:
- `saveSwipe({ uid, kidId, checkinId, category, cardIndex, cardText, choice })`: Save kid swipe
- `listSwipes({ uid, kidId, checkinId })`: Get all swipes for a check-in
- `saveParentSwipe({ uid, category, cardIndex, cardText, choice, date })`: Save parent swipe
- `listParentSwipes({ uid, startDate, endDate })`: Get parent swipes in date range

## Timezone Handling

### Date Utilities (src/lib/dateUtils.ts)
```typescript
getTodayDateString(timezone): string        // Returns YYYY-MM-DD for timezone
getDayOfWeek(timezone): string              // Returns "Monday", "Tuesday", etc.
isWeekend(timezone): boolean                // Returns true if Saturday/Sunday
isSameDay(date1, date2): boolean            // Compare date strings
getFriendlyDate(dateString, timezone): string   // "Monday, January 27"
getTimeOfDay(timezone): 'morning' | 'afternoon' | 'evening'
```

**Why Timezone Matters**:
- Daily resets happen at midnight in parent's timezone (not UTC)
- Weekend vs. weekday categories determined by parent's local time
- Check-in dates stored in YYYY-MM-DD format for consistency
- One check-in per day per child (enforced by date + timezone)

## Component Architecture

### Reusable UI Components (src/components/)

**PiaButton** (`PiaButton.tsx`)
- Primary action button with consistent styling
- Props: `onPress`, `children`, `style`, `disabled`

**FloatingCard** (`FloatingCard.tsx`)
- Card container with shadow and rounded corners
- Props: `children`, `style`

**CategoryTile** (`CategoryTile.tsx`)
- Selectable tile for category selection
- Props: `icon`, `label`, `selected`, `onClick`

**ProgressRing** (`ProgressRing.tsx`)
- Circular progress indicator
- Props: `progress` (0-100), `size`, `color`

**ScreenWrapper** (`ScreenWrapper.tsx`)
- Consistent screen container with safe area handling
- Props: `children`

**LoadingScreen** (`LoadingScreen.tsx`)
- Full-screen loading indicator
- Props: `message`

**Mascot** (`Mascot.tsx`)
- Animated mascot character for engagement

### Screen Components (src/screens/)
All screens follow similar patterns:
- Receive props from App.tsx via navigation
- Use reusable UI components
- Call database operations via db.ts
- Trigger navigation callbacks to update app state

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                          App.tsx                             │
│  ┌────────────┐  ┌──────────────┐  ┌───────────────┐       │
│  │   State    │  │  useEffect   │  │  Navigation   │       │
│  │ Management │  │   Hooks      │  │  Callbacks    │       │
│  └─────┬──────┘  └──────┬───────┘  └───────┬───────┘       │
│        │                 │                  │                │
└────────┼─────────────────┼──────────────────┼────────────────┘
         │                 │                  │
         ↓                 ↓                  ↓
┌─────────────────────────────────────────────────────────────┐
│                    Screen Components                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ PartsOfMyDay │  │ CategoryHub  │  │ MomentCards  │      │
│  │              │  │              │  │              │      │
│  │  - Receives  │  │  - Receives  │  │  - Receives  │      │
│  │    props     │  │    props     │  │    props     │      │
│  │  - Calls     │  │  - Calls     │  │  - Calls     │      │
│  │    callbacks │  │    callbacks │  │    callbacks │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
└─────────┼──────────────────┼──────────────────┼──────────────┘
          │                  │                  │
          ↓                  ↓                  ↓
┌─────────────────────────────────────────────────────────────┐
│                      Database Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  src/lib/    │  │  src/lib/    │  │  Firebase    │      │
│  │  db.ts       │  │  dateUtils.ts│  │  Firestore   │      │
│  │              │  │              │  │              │      │
│  │ - CRUD ops   │  │ - Timezone   │  │ - Real-time  │      │
│  │ - Type-safe  │  │ - Date logic │  │ - Serverless │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Change Map: How to Modify Features

### Adding a New Screen
1. **Define route in RootStackParamList** (App.tsx)
   ```typescript
   export type RootStackParamList = {
     // ... existing routes
     NewScreen: { param1: string };
   };
   ```

2. **Create screen component** (src/screens/NewScreen.tsx)
   ```typescript
   interface NewScreenProps {
     param1: string;
     onAction: () => void;
   }
   export default function NewScreen({ param1, onAction }: NewScreenProps) {
     // ... component code
   }
   ```

3. **Add Stack.Screen in App.tsx**
   ```typescript
   <Stack.Screen name="NewScreen">
     {({ navigation, route }) => (
       <NewScreen
         param1={route.params?.param1 || ''}
         onAction={() => {
           // Update state
           navigation.navigate('NextScreen');
         }}
       />
     )}
   </Stack.Screen>
   ```

4. **Update navigation calls** where needed
   ```typescript
   navigation.navigate('NewScreen', { param1: 'value' });
   ```

### Modifying the Check-In Flow
**Files to change**:
- `App.tsx`: Update state management and navigation callbacks
- `src/screens/PartsOfMyDay.tsx`: Modify category selection
- `src/screens/CategoryHub.tsx`: Update progress display
- `src/screens/MomentCards.tsx`: Change card interaction
- `src/lib/db.ts`: Update Firestore operations if schema changes
- `src/data/categories.ts`: Modify category definitions
- `src/data/cardPools.ts`: Update card content

**Example: Add a new category**
1. Add to `WEEKDAY_CATEGORIES` or `WEEKEND_CATEGORIES` in `src/data/categories.ts`
2. Add card pool in `src/data/cardPools.ts` for the new category
3. No changes needed in screens (they dynamically load categories)

### Changing Database Schema
1. **Update TypeScript types** in `src/lib/db.ts`
   ```typescript
   export type Checkin = {
     // ... existing fields
     newField: string;
   };
   ```

2. **Update Firestore operations** in `src/lib/db.ts`
   ```typescript
   await setDoc(ref, { ...existingData, newField: 'value' });
   ```

3. **Update screens** that use the data
   - Read new field from Firestore
   - Pass to components via props
   - Update UI to display

4. **Migration plan** for existing data
   - Firestore is schemaless, so old documents won't have new field
   - Use optional properties (`newField?: string`) or provide defaults

### Adding Authentication Providers
1. **Update Firebase configuration** (Firebase Console)
2. **Modify src/lib/auth.ts** to add new provider
3. **Update LoginScreen** to add button for new provider
4. **Test authentication flow**

## Performance Considerations

### Optimization Strategies
- **useMemo**: Used in PartsOfMyDay, CategoryHub, MomentCards to prevent unnecessary recalculations
- **React.memo**: Not currently used but recommended for frequently re-rendered components
- **Lazy Loading**: Screens loaded on-demand via React Navigation
- **Firestore Limits**: Using `limit()` in queries to prevent large reads
- **Index Management**: Ensure Firestore indexes exist for common queries

### Known Performance Notes
- Card pool generation uses `useMemo` to ensure same 8 cards per category session
- Progress updates throttled by user interaction (no real-time polling)
- Audio files preloaded in SoundManager for instant feedback

## Security Considerations

### Firebase Security Rules
**Required Firestore Rules**:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own parent document
    match /parents/{parentId} {
      allow read, write: if request.auth != null && request.auth.uid == parentId;

      // Users can only access their own kids
      match /kids/{kidId} {
        allow read, write: if request.auth != null && request.auth.uid == parentId;

        // Users can only access their own kids' check-ins
        match /checkins/{checkinId} {
          allow read, write: if request.auth != null && request.auth.uid == parentId;

          match /swipes/{swipeId} {
            allow read, write: if request.auth != null && request.auth.uid == parentId;
          }
        }
      }

      // Users can only access their own parent swipes
      match /parentSwipes/{swipeId} {
        allow read, write: if request.auth != null && request.auth.uid == parentId;
      }
    }
  }
}
```

### Authentication
- Email/password only (no social auth yet)
- Firebase Auth handles token management
- User session persists across app restarts
- Logout clears local state and Firebase session

## Testing Strategy

### Current Testing Approach
- **Manual Testing**: QA_VERIFICATION_REPORT.md documents 94 test cases
- **Code-Level Verification**: Tests verify Firestore schema, state management, navigation
- **No Automated Tests**: No Jest/React Native Testing Library setup yet

### Recommended Testing Additions
1. **Unit Tests**: Test utility functions (dateUtils, getRandomCards)
2. **Integration Tests**: Test Firestore operations with emulator
3. **E2E Tests**: Test full user flows with Detox or Appium
4. **Type Checking**: Enforce strict TypeScript (already enabled)

## Build & Deployment

### Development
```bash
npm start          # Start Expo dev server
npm run android    # Run on Android emulator
npm run ios        # Run on iOS simulator
npm run web        # Run in web browser
```

### Environment Setup
1. Copy `.env.example` to `.env`
2. Fill in Firebase configuration values
3. Run `npm install`
4. Start dev server

### Production Builds
- **iOS**: `eas build --platform ios`
- **Android**: `eas build --platform android`
- **Configure** in `eas.json` (not yet created)

## Dependencies Management

### Critical Dependencies
- **expo**: Core framework (must stay on SDK 54 for React Native 0.81 compatibility)
- **firebase**: JS SDK 12.8+ (latest features for auth and Firestore)
- **react-navigation**: v7 for type-safe navigation
- **typescript**: 5.9+ for strict type checking

### Updating Dependencies
1. Check Expo SDK compatibility: https://docs.expo.dev/versions/latest/
2. Update package.json
3. Run `npm install`
4. Test all core flows
5. Check for breaking changes in Firebase SDK

## Troubleshooting Common Issues

### Build Errors
- **Metro bundler cache**: `npx expo start -c`
- **Node modules**: `rm -rf node_modules && npm install`
- **TypeScript errors**: Check tsconfig.json, ensure strict mode is handled

### Firebase Connection Issues
- Verify `.env` file exists and has correct values
- Check Firebase Console for API key restrictions
- Ensure Firestore rules are deployed

### Navigation Issues
- Verify screen name matches RootStackParamList exactly
- Check that all required params are passed
- Use TypeScript to catch navigation type errors

## Future Architecture Improvements

### Recommended Changes for Scale
1. **State Management**: Consider Zustand or React Query for better state sync
2. **Component Library**: Migrate to a design system (e.g., React Native Paper)
3. **API Layer**: Create abstraction layer over Firestore for easier testing
4. **Error Handling**: Add global error boundary and crash reporting (Sentry)
5. **Analytics**: Add event tracking (Firebase Analytics or Mixpanel)
6. **Offline Support**: Implement Firestore offline persistence
7. **Code Splitting**: Lazy-load screens and components for faster startup
