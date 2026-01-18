# 🚀 START HERE - Test Your App Now!

## ⚡ 3-Minute Test

Follow these steps to see your new React Native app running:

### Step 1: Add Firebase Credentials (2 minutes)

You need to add Firebase credentials to the `.env` file.

**Option A: If you have Firebase Console access**

1. Go to: https://console.firebase.google.com/
2. Select your PIA project
3. Click ⚙️ (Settings) → Project Settings
4. Scroll to "Your apps" → Select Web App (or add one)
5. Copy the config values

**Option B: Use existing web project values**

Your web project (`pia`) is already using Firebase. The credentials might be:
- In environment variables on your hosting platform (Vercel, etc.)
- In your Firebase console (see Option A)

### Step 2: Update .env File

Open: `pia-mobile/.env`

Add these values (replace with your actual Firebase config):

```env
FIREBASE_API_KEY=AIzaSy...
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abc123
FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Step 3: Run the App (1 minute)

```bash
cd c:\Projects\Preethi\Project-PIA\pia-mobile
npm run web
```

The app will open in your browser at http://localhost:8081

### Step 4: Test Login

1. You'll see the PIA welcome screen
2. Click **"Continue with Email"**
3. Enter test email: `test@example.com`
4. Enter password: `password123` (min 6 chars)
5. Click **"Sign Up"**
6. You should see: ✅ Firebase connection is working!

### Step 5: Verify Everything Works

- [ ] Can create account
- [ ] Can see success screen
- [ ] Email is displayed
- [ ] Logout button works
- [ ] Can login again with same credentials

---

## 🎉 Success! What You've Built

You now have:
- ✅ Working React Native app
- ✅ Runs on iOS, Android, and Web
- ✅ Firebase authentication
- ✅ Login/Signup flow
- ✅ User state management

---

## 🐛 If Something Goes Wrong

### Error: "Firebase: Error (auth/invalid-api-key)"

**Fix:** Your .env file isn't loaded or has wrong values

1. Check `.env` file exists in `pia-mobile/` folder
2. Check values don't have quotes or extra spaces
3. Stop the server (Ctrl+C)
4. Run `npm run web` again

### Error: "Module not found"

**Fix:** Dependencies not installed

```bash
cd pia-mobile
npm install
npm run web
```

### Error: Port already in use

**Fix:** Kill the existing process

```bash
# Windows
taskkill /F /IM node.exe

# macOS/Linux
killall node

# Then restart
npm run web
```

### Can't find Firebase credentials?

**Fix:** Create a new Firebase project

1. Go to https://console.firebase.google.com/
2. Create new project (or use existing)
3. Add a Web app
4. Copy credentials to .env
5. Enable Email/Password auth in Authentication → Sign-in method

---

## 📱 Want to Test on Mobile?

### iOS (macOS only)

```bash
npm run ios
```

Requires Xcode installed.

### Android

```bash
npm run android
```

Requires Android Studio + Emulator.

### Real Device (any OS)

1. Install "Expo Go" app on your phone
2. Run: `npm start`
3. Scan QR code with Expo Go

---

## ✅ Next Steps After Testing

Once you've confirmed everything works:

1. **Read [SUMMARY.md](./SUMMARY.md)** - See what's been built
2. **Review [MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md)** - Plan Step 4
3. **Start migrating screens** - Copy from web app

---

## 💡 Pro Tips

**Fast Development:**
- Use web for fastest iteration
- Changes auto-reload
- Chrome DevTools work perfectly

**Testing:**
- Test authentication first
- Then add one screen at a time
- Commit after each working feature

**Firebase:**
- Same database as web app
- Users are shared between web/mobile
- Test account in web works in mobile

---

## 🆘 Still Stuck?

1. Check [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - Detailed Firebase guide
2. Check [QUICKSTART.md](./QUICKSTART.md) - Troubleshooting
3. Check [README.md](./README.md) - Full documentation

---

## 🎯 What's Next?

Your project is at **20% completion**:

- ✅ Step 1: Empty project
- ✅ Step 2: Firebase
- ✅ Step 3: Login
- ⏳ Step 4: Migrate all screens (Next!)

See [MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md) to continue!

---

**Ready? Let's go! Run this now:**

```bash
cd c:\Projects\Preethi\Project-PIA\pia-mobile
npm run web
```

🚀 Your app is waiting!
