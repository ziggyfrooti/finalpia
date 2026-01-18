# PIA Mobile - React Native App

> A React Native replica of the PIA web app for iOS, Android, and Web platforms

## 📱 About This Project

This is a mobile version of PIA (Parent & Kid Connect), a calm space for kids to share their day and parents to connect meaningfully. Built with React Native and Expo for cross-platform support.

## ✅ Project Status

**Current Phase:** Steps 1-3 Complete (Basic setup, Firebase, Login)

| Step | Status | Description |
|------|--------|-------------|
| 1. Empty Working Project | ✅ Complete | React Native setup with Expo |
| 2. Firebase Connection | ✅ Complete | Authentication & Firestore ready |
| 3. Login Page | ✅ Complete | Email/Password auth working |
| 4. Complete Flow | ⏳ Next | Migrate all screens from web app |

See [SUMMARY.md](./SUMMARY.md) for detailed status.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn
- (Optional) Xcode for iOS development
- (Optional) Android Studio for Android development

### Installation

```bash
# Navigate to project
cd pia-mobile

# Install dependencies
npm install

# Configure Firebase (see FIREBASE_SETUP.md for details)
# Edit .env and add your Firebase credentials
```

### Run the App

**Web (fastest for development):**
```bash
npm run web
```
Opens at http://localhost:8081

**iOS Simulator (macOS only):**
```bash
npm run ios
```

**Android Emulator:**
```bash
npm run android
```

**Start Expo DevTools:**
```bash
npm start
```
Scan QR code with Expo Go app on your phone.

## 🔥 Firebase Setup

**Quick Setup:**

1. Copy Firebase credentials from your Firebase Console
2. Open `.env` file in the project root
3. Add your credentials:

```env
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123:web:abc123
FIREBASE_MEASUREMENT_ID=G-XXXXXXXXX
```

**Detailed Instructions:** See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

## 📂 Project Structure

```
pia-mobile/
├── App.tsx                  # Main entry point
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── FloatingCard.tsx
│   │   ├── Mascot.tsx
│   │   └── PiaButton.tsx
│   ├── lib/                 # Firebase & utilities
│   │   ├── firebase.ts      # Firebase config
│   │   ├── auth.ts          # Auth functions
│   │   └── useAuth.ts       # Auth hook
│   └── screens/             # App screens
│       ├── LoginScreen.tsx
│       ├── EmailLoginScreen.tsx
│       └── ParentHomeScreen.tsx
├── .env                     # Firebase credentials
└── package.json
```

## 🧪 Testing

### Test Firebase Connection

1. Run the app: `npm run web`
2. Click "Continue with Email"
3. Create an account
4. You should see success message with:
   - ✅ Firebase connection is working!
   - ✅ Authentication is successful!

### Test Login Flow

1. Create account with email/password
2. Logout
3. Login again with same credentials
4. Verify user state persists on page refresh

## 📚 Documentation

- **[README.md](./README.md)** - This file (overview)
- **[SUMMARY.md](./SUMMARY.md)** - Detailed project status
- **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** - Firebase configuration guide
- **[QUICKSTART.md](./QUICKSTART.md)** - Fast testing guide
- **[MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md)** - Step 4 roadmap

## 🛠️ Tech Stack

**Core:**
- React Native 0.81
- Expo SDK 54
- TypeScript 5.9

**Firebase:**
- Firebase JS SDK 12.8
- Authentication
- Firestore Database

**Navigation:**
- React Navigation 7
- Stack Navigator

**UI:**
- React Native built-in components
- Custom styled components

## 🎯 Next Steps

**For Step 4 (Migrate All Screens):**

1. See [MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md) for detailed roadmap
2. Start with shared components (CategoryTile, LoadingScreen, ProgressRing)
3. Then migrate parent screens
4. Then kid screens
5. Add database integration

**Priority Order:**
1. Complete shared components
2. Parent flow screens
3. Kid flow screens
4. Database/Firestore integration
5. Polish and animations

## 🐛 Troubleshooting

**"Module not found" errors:**
```bash
npm install
```

**"Firebase: Error (auth/invalid-api-key)":**
- Check `.env` file has correct Firebase credentials
- Restart dev server: Stop and run `npm run web` again

**Port already in use:**
```bash
# Kill all node processes
killall node  # macOS/Linux
taskkill /F /IM node.exe  # Windows

# Then restart
npm run web
```

**Can't connect to Firebase:**
- Verify Firebase project has Email/Password auth enabled
- Check Firebase Console → Authentication → Sign-in method
- Ensure .env values match Firebase Console values

## 📱 Platform-Specific Notes

### Web
- ✅ Fully working
- Use for fastest development iteration
- Firebase web SDK works perfectly

### iOS
- Requires macOS + Xcode
- Google Sign-In needs additional setup (iOS URL schemes)
- Test in simulator or Expo Go app

### Android
- Requires Android Studio + Emulator
- Google Sign-In needs SHA-1 fingerprint
- Test in emulator or Expo Go app

## 🔐 Security

**Important:**
- ✅ `.env` is in `.gitignore` (not committed to git)
- ✅ Use `.env.example` as template for team members
- ⚠️ Never commit Firebase credentials to version control
- ✅ Firebase credentials are safe to use in client apps (protected by Firebase security rules)

## 📝 Scripts

```bash
npm start          # Start Expo DevTools
npm run web        # Run on web browser
npm run ios        # Run iOS simulator (macOS)
npm run android    # Run Android emulator
```

## 🤝 Contributing

Since this is a replica of the web app:

1. Follow the web app's design exactly
2. Use same colors, fonts, and spacing
3. Maintain feature parity
4. Test on multiple platforms

## 📄 License

Same license as the original PIA web app.

## 🙋 Need Help?

1. Check [QUICKSTART.md](./QUICKSTART.md) for common issues
2. See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for Firebase problems
3. Review [SUMMARY.md](./SUMMARY.md) for project status
4. Check Expo documentation: https://docs.expo.dev

## ✨ Features Implemented

- ✅ Multi-platform support (iOS/Android/Web)
- ✅ Firebase Authentication
- ✅ Email/Password login
- ✅ Google Sign-In (UI ready)
- ✅ Auth state persistence
- ✅ Responsive design
- ✅ TypeScript
- ✅ Navigation

## 🎉 What's Working

Try it now:

```bash
cd pia-mobile
npm run web
```

1. Click "Continue with Email"
2. Create an account
3. Login and logout
4. Everything works!

Ready to continue with Step 4? See [MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md)!

