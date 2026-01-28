# Quick Start - Testing PIA Mobile

## ⚡ Fast Setup (2 minutes)

Since the web project doesn't have a `.env.local` file, we need to add Firebase credentials manually.

### Option 1: Use Test/Demo Credentials

For quick testing, you can:

1. Open `pia-mobile/.env`
2. Add the Firebase credentials from your Firebase Console
3. Or use the same credentials the web app uses

### Option 2: Find Credentials in Web Code

The web app might have credentials directly in the code:

1. Check: `pia/src/lib/firebase.ts`
2. Look for `process.env.NEXT_PUBLIC_FIREBASE_*` usage
3. These values might be in your hosting platform (Vercel, etc.)

### Finding Your Firebase Config

**Method 1: Firebase Console**
```
1. Go to: https://console.firebase.google.com/
2. Select your project
3. Click ⚙️ (Settings) → Project Settings
4. Scroll to "Your apps" section
5. Click "Web app" (or add one if none exists)
6. Copy the firebaseConfig object values
```

**Method 2: Browser DevTools**
```
1. Open your web app: http://localhost:3000 (or deployed URL)
2. Open DevTools (F12)
3. Go to Console tab
4. Type: localStorage
5. Firebase config might be visible in the app's initialization
```

## 🧪 Test Without Firebase (Offline Mode)

If you want to test the UI without Firebase:

1. Comment out the Firebase imports in:
   - `src/lib/useAuth.ts`
   - `App.tsx`
2. Return mock data instead
3. This lets you test navigation and UI

## 🚀 Running the App

Once .env is configured:

```bash
cd pia-mobile
npm run web
```

The app will open at http://localhost:8081

## ✅ Testing Login

1. Click "Continue with Email"
2. Enter any email: test@example.com
3. Enter any password (min 6 characters)
4. Click "Sign Up" to create account
5. You should see success screen

## 📱 Testing on Mobile

**iOS Simulator (macOS only):**
```bash
npm run ios
```

**Android Emulator:**
```bash
npm run android
```

**Physical Device:**
```bash
npm start
```
Then scan QR code with Expo Go app

## Common Issues

**"Firebase: Error (auth/invalid-api-key)"**
- .env file is not loaded
- Try: Stop server, restart with `npm run web`

**"Module not found"**
```bash
npm install
```

**"Port already in use"**
```bash
killall node
npm run web
```

## Next Steps After Testing

Once login works:
1. ✅ Step 1-3 Complete (Project setup, Firebase, Login)
2. 🔄 Step 4: Copy remaining screens from web app
3. 🔄 Step 5: Implement full user flow

See README.md for full documentation.
