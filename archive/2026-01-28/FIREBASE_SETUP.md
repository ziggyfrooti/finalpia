# Firebase Configuration Guide

## Step 1: Get Firebase Credentials

You need to copy the Firebase credentials from your existing 'pia' web project.

### Option A: Copy from existing .env.local (Web Project)

If you have a `.env.local` file in the web project:

1. Navigate to: `c:\Projects\Preethi\Project-PIA\pia\.env.local`
2. Copy all the values starting with `NEXT_PUBLIC_FIREBASE_`

### Option B: Get from Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your PIA project
3. Click the gear icon ⚙️ → Project Settings
4. Scroll down to "Your apps"
5. If you don't have a web app, click "Add app" → Web
6. Copy the config values from the `firebaseConfig` object

## Step 2: Update .env File

Open `pia-mobile/.env` and add your values:

```env
FIREBASE_API_KEY=AIzaSy...
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abc123
FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Step 3: Enable Authentication Methods

Make sure these are enabled in Firebase Console:

1. Go to Authentication → Sign-in method
2. Enable "Email/Password"
3. (Optional) Enable "Google" for Google Sign-In

## Step 4: Test the Connection

```bash
cd pia-mobile
npm run web
```

Click "Continue with Email" and try creating an account. If successful, you'll see:
- ✅ Firebase connection is working!
- ✅ Authentication is successful!

## Troubleshooting

**Error: "Firebase: Error (auth/invalid-api-key)"**
- Check your FIREBASE_API_KEY in .env

**Error: "Firebase: Error (auth/project-not-found)"**
- Check your FIREBASE_PROJECT_ID in .env

**Can't see .env values in code?**
- Restart the development server
- Make sure .env is in the root of pia-mobile folder

## For Google Sign-In (Platform Specific)

### Web
Already configured! No additional steps needed.

### iOS
1. Add iOS app in Firebase Console
2. Download GoogleService-Info.plist
3. Add to Xcode project
4. Configure URL schemes

### Android
1. Add Android app in Firebase Console
2. Download google-services.json
3. Add SHA-1 fingerprint
4. Place file in android/app/
