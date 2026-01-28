# Clear Check-ins for Testing

Since you completed a check-in today, you need to clear it to test again.

## Option 1: Use Firebase Console (Easiest)

1. Go to: https://console.firebase.google.com/
2. Select your project
3. Go to Firestore Database
4. Navigate to: `parents/{your-uid}/kids/{kid-id}/checkins`
5. Find today's check-in (date: 2026-01-28)
6. Delete it
7. Refresh your browser and try again

## Option 2: I Can Add a "Reset Check-in" Button

Would you like me to add a temporary "Reset Today's Check-in" button for testing?

## Option 3: Wait Until Tomorrow

The app will automatically allow a new check-in tomorrow (based on your timezone).

## Verification

After clearing, you should see in console:
```
canStartNewCheckin result: { allowed: true }
```

Instead of:
```
canStartNewCheckin result: { allowed: false, reason: 'already-completed' }
```
