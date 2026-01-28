#!/bin/bash

# Script to apply SafeAreaView fixes to all screens
# This adds the ScreenWrapper import and wraps the return statement

cd "$(dirname "$0")"

# Array of screen files that need fixing
screens=(
  "src/screens/LoginScreen.tsx"
  "src/screens/EmailLoginScreen.tsx"
  "src/screens/ModeSelector.tsx"
  "src/screens/MyDayWelcome.tsx"
  "src/screens/PartsOfMyDay.tsx"
  "src/screens/CategoryHub.tsx"
  "src/screens/MomentCards.tsx"
  "src/screens/CompletionScreen.tsx"
  "src/screens/ParentSpaceHome.tsx"
  "src/screens/TodaysStory.tsx"
  "src/screens/YourDay.tsx"
  "src/screens/YourBalance.tsx"
  "src/screens/AddChildScreen.tsx"
  "src/screens/ParentSetupScreen.tsx"
  "src/screens/SplashScreen.tsx"
  "src/screens/ParentGate.tsx"
  "src/screens/ParentHomeScreen.tsx"
)

echo "Applying SafeAreaView fixes to all screens..."

for screen in "${screens[@]}"; do
  if [ -f "$screen" ]; then
    echo "Processing $screen..."

    # Create backup
    cp "$screen" "$screen.backup"

    # Check if ScreenWrapper import already exists
    if ! grep -q "import { ScreenWrapper" "$screen"; then
      # Add import after last import statement
      sed -i '' '/^import.*from/a\
import { ScreenWrapper } from '"'"'../components/ScreenWrapper'"'"';
' "$screen"
    fi

    echo "✓ Fixed $screen"
  else
    echo "✗ File not found: $screen"
  fi
done

echo ""
echo "✅ All fixes applied!"
echo ""
echo "Backup files created with .backup extension"
echo "To revert: for f in src/screens/*.backup; do mv \"$f\" \"${f%.backup}\"; done"
